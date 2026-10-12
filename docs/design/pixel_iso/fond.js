'use strict';
// LE FOND DU GRAND AUBÉRIVE — ce que le rayon rencontre quand il sort du monde.
//
// Retour du porteur (octobre 2026) : « le fond actuel ne me plaît pas » — la ville posée comme une
// maquette sur un sol beige, sous un ciel. Le monde ne s'arrête plus : le sol continue à la hauteur
// du trottoir. Des champs en damier, des haies et leurs chênes, des bois, quelques fermes ; la Rive,
// la voie rapide, les routes, la voie ferrée et les chemins qui touchent un bord du monde continuent
// tout droit (zone.js les relève : `W.bords`) ; au fond, la brume, les collines et la Capitale.
//
// Les champs et les routes prennent les matières du monde (mats.js, les quartiers) : leur texture
// continue sans couture. La lumière est celle de l'heure (presets.js), sans ombre portée ; la nuit,
// quelques fenêtres de ferme et les phares d'une route. Le moteur (engine.js, `bordMonde`) cache la
// tranche du monde pour que le sol peint la prolonge.
const E = require('./engine');
const { M } = require('./mats');
const { lighting } = require('./presets');
const { hash, vnoise, fbm, clamp, MATS, TOP } = E;

// les couleurs des cultures (fin d'été, comme la campagne) : base, rangs
const CULTURES = [
  { p: 0.20, c: [0.70, 0.58, 0.28], r: [0.60, 0.48, 0.22], pas: 3 },   // blé sur pied
  { p: 0.16, c: [0.72, 0.64, 0.42], r: [0.62, 0.54, 0.34], pas: 5 },   // chaume
  { p: 0.15, c: [0.40, 0.30, 0.21], r: [0.31, 0.23, 0.16], pas: 4 },   // labour
  { p: 0.24, c: [0.36, 0.47, 0.22], r: [0.32, 0.42, 0.19], pas: 0 },   // prairie
  { p: 0.13, c: [0.24, 0.37, 0.15], r: [0.18, 0.29, 0.11], pas: 4 },   // maïs
  { p: 0.12, c: [0.47, 0.54, 0.24], r: [0.41, 0.48, 0.20], pas: 3 },   // colza levé, regain
];
const HAIE = [0.16, 0.25, 0.11], CHENE = [0.19, 0.29, 0.13], CHENE_CLAIR = [0.30, 0.42, 0.18], BOIS = [0.14, 0.23, 0.10];
const TOIT = [0.52, 0.27, 0.18], COUR = [0.46, 0.42, 0.36];

// La table des matières par nom (les quartiers ajoutent les leurs à M)
function matiere(nom) { return M[nom] != null ? M[nom] : null; }

function fond(o) {
  const FW = o.width, FH = o.height, cu = o.cu, cv = o.cv, N = o.N, ZL = o.ZL || 10;
  const time = o.time || 'day', nuit = time === 'night', crep = time === 'dusk';
  const L = lighting(time);
  // la lumière d'un sol à plat, sans ombre (ambiance + soleil)
  const fa = (L.faceAmb || [1, 0.8, 0.62])[TOP];
  const lum = [0, 1, 2].map(i => L.ambient[i] * fa + L.sun[i] * Math.max(0, L.sunDir[2]));
  const bords = o.bords || { ouest: [], est: [], nord: [], sud: [] };
  const Hb = o.horizon != null ? o.horizon : 220;      // la ligne d'horizon, en pixels depuis le haut
  const zg = ZL + 2;                                    // le dessus du trottoir

  // ── le ciel : un dégradé, des nuages en bandes, la Capitale et les collines sur l'horizon
  const ciel = nuit ? { top: [0.04, 0.03, 0.045], hor: [0.15, 0.12, 0.12] }
    : crep ? { top: [0.12, 0.10, 0.16], hor: [0.50, 0.30, 0.22] }
      : { top: [0.50, 0.58, 0.66], hor: [0.80, 0.77, 0.70] };
  const brume = nuit ? [0.10, 0.085, 0.09] : crep ? [0.42, 0.30, 0.26] : [0.74, 0.72, 0.67];
  // l'eau peinte, divisée par la lumière du sol (elle la reçoit ensuite) : le ciel qu'elle renvoie
  const reflet = nuit ? [0.30, 0.30, 0.38] : crep ? [0.36, 0.30, 0.34] : [0.26, 0.31, 0.34];
  const R = E.rng(4646);
  // la silhouette de l'horizon : des collines douces, la Capitale vers la gauche, des bois
  const colline = new Float32Array(FW), ville = new Int16Array(FW), feux = new Uint8Array(FW * 64);
  for (let x = 0; x < FW; x++) colline[x] = 5 + 30 * Math.pow(fbm(x / 520, 3.1, 77, 3), 1.3) + 10 * fbm(x / 120, 7.7, 78, 2) + 4 * fbm(x / 30, 9.1, 79, 2);
  {
    let x = Math.floor(FW * 0.08);
    const fin = Math.floor(FW * 0.36);
    while (x < fin) {
      const w = 6 + Math.floor(R() * 18), h = 8 + Math.floor(R() * 26) + (x > FW * 0.17 && x < FW * 0.25 ? Math.floor(R() * 34) : 0);
      for (let i = 0; i < w && x + i < FW; i++) {
        ville[x + i] = Math.max(ville[x + i], h);
        if (nuit) for (let y = 2; y < h - 1; y += 2) if ((i % 2) === 1 && R() < 0.16) feux[(x + i) * 64 + Math.min(63, y)] = 1;
      }
      x += w - 1;
    }
  }
  function cielEn(px, py, out) {
    const t = clamp(py / Hb, 0, 1), kk = Math.pow(t, nuit ? 1.7 : 1.3);
    let r = ciel.top[0] + (ciel.hor[0] - ciel.top[0]) * kk, g = ciel.top[1] + (ciel.hor[1] - ciel.top[1]) * kk, b = ciel.top[2] + (ciel.hor[2] - ciel.top[2]) * kk;
    const cl = fbm(px / 80, py / 12, 601, 4), d = clamp((cl - 0.52) * 3, 0, 1) * (0.4 + 0.6 * t);
    if (nuit) { r += 0.05 * d; g += 0.032 * d; b += 0.026 * d; } else { r += ((crep ? 0.70 : 0.92) - r) * d * 0.5; g += ((crep ? 0.48 : 0.90) - g) * d * 0.5; b += ((crep ? 0.40 : 0.86) - b) * d * 0.5; }
    let er = 0, eg = 0, eb = 0;
    // l'horizon : la Capitale, puis les collines, plus sombres que le ciel (plus claires que le sol)
    const hc = ville[px], hh = colline[px];
    const lointain = nuit ? [0.10, 0.085, 0.09] : crep ? [0.34, 0.24, 0.24] : [0.62, 0.64, 0.66];
    const proche = nuit ? [0.075, 0.065, 0.07] : crep ? [0.28, 0.20, 0.19] : [0.52, 0.56, 0.52];
    if (py >= Hb - hc && py < Hb) {
      r = lointain[0]; g = lointain[1]; b = lointain[2];
      if (nuit && feux[px * 64 + Math.min(63, Hb - py)]) { er = 0.30; eg = 0.22; eb = 0.10; }
    }
    if (py >= Hb - hh && py < Hb + 4) { r = proche[0]; g = proche[1]; b = proche[2]; }
    if (nuit) { const gl = Math.exp(-((py - Hb) ** 2) / (2 * 26 * 26)) * clamp(1 - Math.abs(px - FW * 0.22) / (FW * 0.25), 0, 1); r += 0.10 * gl; g += 0.07 * gl; b += 0.04 * gl; }
    out[0] = r; out[1] = g; out[2] = b; out[3] = er; out[4] = eg; out[5] = eb;
    return out;
  }

  // ── ce qui continue au-delà d'un bord : la sorte (route, eau, rail, chemin) au point (t le long du bord,
  // d la distance au-delà) ; la Rive serpente un peu en s'éloignant
  function prolonge(segs, t, d) {
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      let a = s.a, b = s.b;
      if (s.type === 'eau' && b - a > 20) { const m = Math.sin(d / 170) * Math.min(1, d / 260) * 26; a += m; b += m - Math.min(10, d / 60); }
      else if (s.type === 'chemin') { const m = Math.sin(d / 120 + s.a) * Math.min(1, d / 200) * 10; a += m; b += m; }
      if (t >= a && t < b) return { type: s.type, u: t - a, w: b - a };
    }
    return null;
  }
  function trait(x, y) {
    let f = null;
    if (x < 0) f = prolonge(bords.ouest, y, -x);
    else if (x >= N) f = prolonge(bords.est, y, x - N + 1);
    let g = null;
    if (y < 0) g = prolonge(bords.nord, x, -y);
    else if (y >= N) g = prolonge(bords.sud, x, y - N + 1);
    if (!f) return g;
    if (!g) return f;
    // dans un coin, deux bords : l'eau d'abord, puis la route
    const rang = { eau: 3, route: 2, rail: 1, chemin: 0 };
    return rang[f.type] >= rang[g.type] ? f : g;
  }

  // ── les matières du monde, lues comme le moteur les lit (texture continue)
  const ctx = { face: TOP, hx: 0, hy: 0, hz: 2, ix: 0, iy: 0, iz: zg, a: 0, b: 0, cr: 0.5, cg: 0.5, cb: 0.5, er: 0, eg: 0, eb: 0, wet: 0, m: 0, W: o.W || null };
  const out3 = [0, 0, 0];
  function teinte(m, x, y, z, out) {
    const mat = m != null && MATS[m];
    if (!mat) return false;
    ctx.face = TOP; ctx.hx = x; ctx.hy = y; ctx.hz = z; ctx.ix = Math.floor(x); ctx.iy = Math.floor(y); ctx.iz = zg;
    ctx.a = Math.floor(2 * x); ctx.b = Math.floor(2 * y); ctx.cr = 0.5; ctx.cg = 0.5; ctx.cb = 0.5; ctx.er = 0; ctx.eg = 0; ctx.eb = 0; ctx.wet = 0; ctx.m = m;
    try { mat.shade(ctx); } catch (e) { return false; }
    out[0] = ctx.cr; out[1] = ctx.cg; out[2] = ctx.cb;
    return true;
  }
  const mHerbe = matiere('GRASS'), mTerre = matiere('CMP_TERRE'), mRoute = matiere('ASPHALT'), mLigne = matiere('ROADLINE'),
    mEau = matiere('RIVER2'), mChemin = matiere('CMP_CHEMIN') != null ? matiere('CMP_CHEMIN') : matiere('GRAVEL'), mBallast = matiere('TIL_BALLAST');

  // ── le damier des champs : des colonnes et des rangs aux bords un peu de travers
  const LX = 132, LY = 96;
  function bordX(k) { return k * LX + (hash(k, 3, 41, 9) - 0.5) * 46; }
  function bordY(j) { return j * LY + (hash(j, 5, 43, 9) - 0.5) * 34; }
  function parcelle(x, y) {
    let k = Math.floor(x / LX); if (x < bordX(k)) k--; else if (x >= bordX(k + 1)) k++;
    let j = Math.floor(y / LY); if (y < bordY(j)) j--; else if (y >= bordY(j + 1)) j++;
    const dx = Math.min(x - bordX(k), bordX(k + 1) - x), dy = Math.min(y - bordY(j), bordY(j + 1) - y);
    return { k, j, dx, dy };
  }
  function culture(k, j) {
    let h = hash(k, j, 47, 9), acc = 0;
    for (let i = 0; i < CULTURES.length; i++) { acc += CULTURES[i].p; if (h < acc) return CULTURES[i]; }
    return CULTURES[0];
  }

  // la couleur (albédo) du sol peint en (x, y), et sa lumière propre la nuit
  function sol(x, y, out, emi) {
    emi[0] = 0; emi[1] = 0; emi[2] = 0;
    const ix = Math.floor(x), iy = Math.floor(y);
    const f = trait(x, y);
    if (f) {
      if (f.type === 'eau') {
        if (f.u < 2 || f.u > f.w - 2) { out[0] = 0.30; out[1] = 0.33; out[2] = 0.20; return; }   // la berge
        // le reflet du ciel (la Rive du monde est mouillée : elle renvoie le ciel), des rides
        const k = 0.86 + 0.24 * vnoise(x / 9, y / 3, 91), ride = (Math.floor(y * 1.5 + 2 * Math.sin(x / 9)) % 9) === 0 ? 1.15 : 1;
        out[0] = reflet[0] * k * ride; out[1] = reflet[1] * k * ride; out[2] = reflet[2] * k * ride; return;
      }
      if (f.type === 'route') {
        const mil = f.w > 18 && Math.abs(f.u - f.w / 2) < 1 && (Math.floor((x + y) / 8) & 1);
        if (mil && teinte(mLigne, x, y, 1, out)) return;
        if (teinte(mRoute, x, y, 1, out)) {
          // la nuit, des phares de loin en loin
          if (nuit && hash(Math.floor((x + y) / 90), Math.floor(f.u / 6), 17, 9) < 0.08 && ((x + y) % 90) < 2) { emi[0] = 0.9; emi[1] = 0.8; emi[2] = 0.55; }
          return;
        }
        out[0] = 0.18; out[1] = 0.18; out[2] = 0.19; return;
      }
      if (f.type === 'rail') {
        const rail = (Math.floor(f.u) % 14 === 5 || Math.floor(f.u) % 14 === 9);
        if (rail) { out[0] = 0.36; out[1] = 0.34; out[2] = 0.32; return; }
        if (teinte(mBallast, x, y, 2, out)) return;
        out[0] = 0.33; out[1] = 0.30; out[2] = 0.27; return;
      }
      if (f.type === 'chemin' && teinte(mChemin, x, y, 1, out)) return;
    }
    // un bois (de grandes taches)
    const fb = fbm(x / 260, y / 260, 313, 4);
    if (fb > 0.6) {
      // des houppiers de deux tailles, chacun dans sa case, décalé : on ne voit pas la grille
      let c = BOIS, best = 9;
      for (const [T, s0, dec] of [[11, 51, 0], [7, 55, 3.5]]) {
        const cx = Math.floor((x + dec) / T), cy = Math.floor((y + dec * 0.6) / T);
        for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
          const h = hash(cx + i, cy + j, s0, 9);
          if (h < 0.18) continue;
          const ox = (cx + i) * T - dec + T * hash(cx + i, cy + j, s0 + 1, 9), oy = (cy + j) * T - dec * 0.6 + T * hash(cx + i, cy + j, s0 + 2, 9);
          const r = T * (0.38 + 0.3 * h), d = Math.hypot(x - ox, y - oy) / r;
          if (d < 1 && d < best) { best = d; c = (x - ox + y - oy) < -0.35 * r ? CHENE_CLAIR : CHENE; }
        }
      }
      const k = (best < 1 ? 0.92 - 0.18 * best * best : 0.8) * (0.9 + 0.2 * hash(ix, iy, 53, 9));
      out[0] = c[0] * k; out[1] = c[1] * k; out[2] = c[2] * k;
      return;
    }
    const P = parcelle(x, y);
    // une ferme, rarement, au milieu d'une parcelle : une cour, un toit de tuiles, une fenêtre allumée
    if (hash(P.k, P.j, 61, 9) < 0.035) {
      const cx = bordX(P.k) + 18, cy = bordY(P.j) + 14;
      const dx = x - cx, dy = y - cy;
      if (dx > -12 && dx < 12 && dy > -9 && dy < 9) {
        // un corps de ferme le long de x, une grange le long de y, la cour entre les deux
        const logis = dy > -9 && dy < -4 && dx > -11 && dx < 8, grange = dx > 6 && dx < 11 && dy > -9 && dy < 7;
        let c = COUR, k = 0.86 + 0.2 * hash(ix, iy, 62, 9);
        if (logis) { c = TOIT; k *= dy < -6.5 ? 1.08 : 0.86; }
        else if (grange) { c = [0.44, 0.40, 0.36]; k *= dx < 8.5 ? 1.06 : 0.84; }
        out[0] = c[0] * k; out[1] = c[1] * k; out[2] = c[2] * k;
        if (nuit && logis && dy > -4.8 && (ix % 3 === 0) && hash(ix, 1, 63, 9) < 0.6) { emi[0] = 0.55; emi[1] = 0.40; emi[2] = 0.16; }
        return;
      }
    }
    // une haie au bord de la parcelle (pas toutes), et ses chênes
    const haieX = P.dx < 2.2 && hash(P.k, Math.floor(y / 40), 71, 9) < 0.72;
    const haieY = P.dy < 2.2 && hash(Math.floor(x / 40), P.j, 72, 9) < 0.72;
    if (haieX || haieY) {
      const t = haieX ? y : x, cx2 = Math.round(t / 26) * 26;
      const k = 0.8 + 0.35 * hash(ix, iy, 73, 9);
      const c = Math.abs(t - cx2) < 5 && hash(Math.floor(t / 26), haieX ? P.k : P.j, 74, 9) < 0.55 ? CHENE : HAIE;
      out[0] = c[0] * k; out[1] = c[1] * k; out[2] = c[2] * k;
      return;
    }
    // le champ : la matière du monde, teintée de sa culture, avec ses rangs
    const cu0 = culture(P.k, P.j);
    const sens = hash(P.k, P.j, 49, 9) < 0.5;
    const rang = cu0.pas && ((Math.floor((sens ? x : y) / cu0.pas) & 1) === 0);
    const c = rang ? cu0.r : cu0.c;
    const base = cu0 === CULTURES[3] ? mHerbe : mTerre;
    if (base != null && teinte(base, x, y, 1, out3)) {
      // la texture de la matière, la couleur de la culture
      const lm = (out3[0] + out3[1] + out3[2]) / 3 || 0.4;
      const k = clamp(lm / 0.42, 0.75, 1.25);
      out[0] = c[0] * k; out[1] = c[1] * k; out[2] = c[2] * k;
    } else { const k = 0.88 + 0.22 * hash(ix, iy, 75, 9); out[0] = c[0] * k; out[1] = c[1] * k; out[2] = c[2] * k; }
    // des marbrures (l'herbe plus drue, la terre plus sèche) et le grain du voxel
    const mb = 0.9 + 0.14 * vnoise(x / 23, y / 17, 81) + 0.08 * vnoise(x / 6, y / 5, 82) + 0.07 * (hash(ix, iy, 83, 9) - 0.5);
    out[0] *= mb; out[1] *= mb; out[2] *= mb;
    // des bottes de paille sur le chaume
    if (cu0 === CULTURES[1] && (ix % 23) < 3 && (iy % 19) < 3) { out[0] = 0.78; out[1] = 0.66; out[2] = 0.36; }
  }

  const out6 = [0, 0, 0, 0, 0, 0], alb = [0, 0, 0], em = [0, 0, 0], ciel6 = [0, 0, 0, 0, 0, 0];
  function backdrop(px, py) {
    if (py < Hb) return cielEn(px, py, out6);
    const u = px + cu + 0.5, v = py + cv + 0.5;
    const x = (v + 2 * zg + u / 2) / 2, y = (v + 2 * zg - u / 2) / 2;
    sol(x, y, alb, em);
    let r = alb[0] * lum[0], g = alb[1] * lum[1], b = alb[2] * lum[2];
    // la brume vers l'horizon, et un peu plus loin du monde vers l'arrière
    const loin = Math.max(0, -x, -y);
    let h = Math.pow(clamp(1 - (py - Hb) / 520, 0, 1), 1.6);
    h = Math.max(h, clamp((loin - 500) / 900, 0, 0.85));
    if (py < Hb + 8) { cielEn(px, py, ciel6); h = Math.max(h, 1 - (py - Hb) / 8); r = r * (1 - h) + ciel6[0] * h; g = g * (1 - h) + ciel6[1] * h; b = b * (1 - h) + ciel6[2] * h; }
    else { r = r * (1 - h) + brume[0] * h; g = g * (1 - h) + brume[1] * h; b = b * (1 - h) + brume[2] * h; }
    const ke = 1 - h;
    out6[0] = r + em[0] * ke; out6[1] = g + em[1] * ke; out6[2] = b + em[2] * ke;
    out6[3] = em[0] * ke; out6[4] = em[1] * ke; out6[5] = em[2] * ke;
    return out6;
  }
  const f3 = [0, 0, 0];
  function fog() { f3[0] = brume[0]; f3[1] = brume[1]; f3[2] = brume[2]; return f3; }
  return { backdrop, fog };
}

module.exports = { fond };
