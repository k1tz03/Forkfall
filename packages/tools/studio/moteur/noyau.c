/* FUSIBLE — le studio : les boucles échantillon par échantillon que numpy ne sait
 * pas vectoriser (une récursion dont le coefficient change à chaque échantillon).
 * Compilé une fois par moteur/noyau.py dans un dossier de cache (jamais dans le
 * dépôt) ; sans compilateur, noyau.py retombe sur des équivalents numpy par blocs.
 * Tout est en double précision à l'intérieur, en float32 aux bords. */
#include <math.h>

/* Le filtre en échelle à quatre pôles, sans retard dans la boucle (la forme dite
 * « TPT ») : coupure par échantillon (Hz), résonance k (0..4, auto-oscillation vers
 * 4), saturation douce de l'entrée et de la boucle (tanh) pour le grain analogique.
 * etat : 4 doubles, gardés d'un appel à l'autre. */
void echelle(const float *x, float *y, int n, const float *fc, const float *res,
             double drive, double sr, double *etat)
{
    double s1 = etat[0], s2 = etat[1], s3 = etat[2], s4 = etat[3];
    const double pi = 3.14159265358979323846;
    double nyq = 0.49 * sr;
    for (int i = 0; i < n; i++) {
        double f = fc[i];
        if (f < 10.0) f = 10.0;
        if (f > nyq) f = nyq;
        double g = tan(pi * f / sr);
        double G = g / (1.0 + g);
        double k = res[i];
        double G2 = G * G, G3 = G2 * G, G4 = G3 * G;
        /* la somme pondérée des états (chaque étage : y = G*u + s/(1+g)) */
        double b1 = s1 / (1.0 + g), b2 = s2 / (1.0 + g), b3 = s3 / (1.0 + g), b4 = s4 / (1.0 + g);
        double S = G3 * b1 + G2 * b2 + G * b3 + b4;
        double entree = drive != 1.0 ? tanh(drive * x[i]) / (drive > 1.0 ? tanh(drive) : 1.0) : x[i];
        double u = (entree - k * S) / (1.0 + k * G4);
        u = tanh(u);
        /* les quatre étages passe-bas à un pôle */
        double v = (u - s1) * G; double l1 = v + s1; s1 = l1 + v;
        v = (l1 - s2) * G; double l2 = v + s2; s2 = l2 + v;
        v = (l2 - s3) * G; double l3 = v + s3; s3 = l3 + v;
        v = (l3 - s4) * G; double l4 = v + s4; s4 = l4 + v;
        /* compense la perte de niveau de la résonance */
        y[i] = (float)(l4 * (1.0 + 0.5 * k));
    }
    etat[0] = s1; etat[1] = s2; etat[2] = s3; etat[3] = s4;
}

/* Le filtre d'état variable à deux pôles (TPT) : passe-bas, passe-bande, passe-haut
 * en une fois, coupure par échantillon, Q fixe. etat : 2 doubles. */
void variable(const float *x, float *bas, float *bande, float *haut, int n,
              const float *fc, double q, double sr, double *etat)
{
    double ic1 = etat[0], ic2 = etat[1];
    const double pi = 3.14159265358979323846;
    double nyq = 0.49 * sr;
    double kq = 1.0 / q;
    for (int i = 0; i < n; i++) {
        double f = fc[i];
        if (f < 10.0) f = 10.0;
        if (f > nyq) f = nyq;
        double g = tan(pi * f / sr);
        double a1 = 1.0 / (1.0 + g * (g + kq));
        double a2 = g * a1;
        double a3 = g * a2;
        double v3 = x[i] - ic2;
        double v1 = a1 * ic1 + a2 * v3;
        double v2 = ic2 + a2 * ic1 + a3 * v3;
        ic1 = 2.0 * v1 - ic1;
        ic2 = 2.0 * v2 - ic2;
        if (bas) bas[i] = (float)v2;
        if (bande) bande[i] = (float)v1;
        if (haut) haut[i] = (float)(x[i] - kq * v1 - v2);
    }
    etat[0] = ic1; etat[1] = ic2;
}

/* Lissage asymétrique d'une courbe (en dB ou en gain) : quand la cible monte, on
 * suit avec le coefficient `monte` ; quand elle descend, avec `descend`
 * (coefficients de filtres à un pôle, 0..1 : 1 = suit tout de suite).
 * etat : 1 double. */
void lisse(const float *x, float *y, int n, double monte, double descend, double *etat)
{
    double s = etat[0];
    for (int i = 0; i < n; i++) {
        double c = x[i] > s ? monte : descend;
        s += c * (x[i] - s);
        y[i] = (float)s;
    }
    etat[0] = s;
}

/* Un écho à réinjection : y = x + retour * filtre(y[n - d]) ; le filtre de la boucle
 * est un passe-bas et un passe-haut à un pôle (les échos s'assombrissent et
 * s'amincissent). Mono ; le ping-pong se fait en croisant deux appels. */
void echo(const float *x, float *y, int n, int d, double retour, double cb, double ch,
          float *tampon, int taille, int *pos, double *etat)
{
    double lp = etat[0], hpx = etat[1], hpy = etat[2];
    int p = *pos;
    for (int i = 0; i < n; i++) {
        int j = p - d; if (j < 0) j += taille;
        double r = tampon[j];
        lp += cb * (r - lp);                 /* passe-bas un pôle */
        double h = ch * (hpy + lp - hpx);    /* passe-haut un pôle */
        hpx = lp; hpy = h;
        double sortie = x[i] + retour * h;
        tampon[p] = (float)sortie;
        y[i] = (float)sortie;
        p++; if (p >= taille) p = 0;
    }
    *pos = p;
    etat[0] = lp; etat[1] = hpx; etat[2] = hpy;
}
