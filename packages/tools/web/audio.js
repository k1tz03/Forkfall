/* ---------------------------------------------------------------------------
 * FUSIBLE — l'univers sonore de l'aperçu jouable.
 *
 * Retour client : « un jeu sans univers musical est un jeu vide. » Puis, en
 * octobre 2026 : « la bande principale n'est vraiment pas fun » et « il
 * faudrait d'autres thèmes ». Puis, la première partition entendue : « ce
 * n'est pas du tout dans l'esprit du jeu, qui se veut avec des histoires
 * sombres, là c'est beaucoup trop joyeux ». D'où LA MUSIQUE (plus bas) : des
 * thèmes noirs écrits note à note, du synthé de polar — un fichier par thème,
 * packages/tools/web/musique/<clé>.js, qui s'enregistre par
 * `FusibleAudio.theme(clé, définition)` ; la bande originale entière (vingt
 * thèmes, leur son, leurs règles) : docs/design/bande_originale.md — et un
 * jingle de départ. Quand un thème joue, la nappe se tait ; elle ne
 * revient que sans thème. Le lieu aussi : retour client, « j'ai l'impression
 * qu'il y a encore l'ancienne musique, ça fait un schlash continu ultra
 * désagréable » — c'était le lit continu des ambiances (la pluie, le néon, la
 * rumeur), mesuré plus fort dans les aigus que les thèmes eux-mêmes. Sous un
 * thème, le lit s'éteint ; il ne reste du lieu que quelques bruits d'objets,
 * rares et bas (une goutte, une porte, des pas, un ballon), marqués `true` en
 * quatrième case de leur événement. Le banc d'essai
 * (packages/tools/web/banc_son.js) rend les thèmes hors ligne, avec leurs
 * niveaux et un spectrogramme. Les couches d'origine :
 *
 *   1. LES AMBIANCES — le lieu où se joue la carte (`card.ambiance`, une des
 *      neuf valeurs de packages/core/lib/src/sfx.dart). Boucles génératives,
 *      très basses, jamais identiques : un lit continu (bruit filtré, bourdon)
 *      plus des événements tirés au hasard dans une fenêtre glissante. Fondu
 *      enchaîné de 1,5 s d'un lieu à l'autre.
 *   2. LA NAPPE — une trame lente accordée à la décennie (synthétique dans les
 *      années 90, de plus en plus dépouillée ensuite), qui monte de quelques
 *      décibels quand la tension monte et se retire le reste du temps. Aucune
 *      mélodie : c'est un décor, pas une chanson.
 *
 * Plus les GESTES : un son court et sec par événement de `card.sfx`, jamais
 * deux fois exactement le même (hauteur, timbre et durée tirés à chaque coup).
 *
 * CONTRAINTE DURE : l'aperçu est un fichier HTML autonome dont la politique de
 * sécurité interdit tout média externe. Aucun fichier audio, aucune URL, aucun
 * data: — TOUT est synthétisé par la Web Audio API : oscillateurs, bruit
 * filtré, enveloppes, réverbération par convolution dont la réponse
 * impulsionnelle est fabriquée à la main, séquenceur à fenêtre glissante.
 *
 * Le module ne touche à rien tant que le joueur n'a pas fait un geste : les
 * navigateurs refusent de démarrer un AudioContext sans interaction, et un jeu
 * qui se met à chanter tout seul à l'ouverture est un jeu qu'on referme.
 *
 * API (window.FusibleAudio) :
 *   FusibleAudio.AMBIANCES / .SFX / .MODES     les vocabulaires fermés
 *   FusibleAudio.createEngine(ctx, dest, opt)  un moteur sur N'IMPORTE quel
 *                                              BaseAudioContext (c'est par là
 *                                              que passe le test hors ligne)
 *   FusibleAudio.setMode('tout'|'gestes'|'muet')
 *   FusibleAudio.mode()                        le mode courant
 *   FusibleAudio.unlock()                      à appeler sur le premier geste
 *   FusibleAudio.started()                     le contexte tourne-t-il ?
 *   FusibleAudio.setAmbiance(nom)              fondu de 1,5 s
 *   FusibleAudio.setTension(0..1)              la nappe monte
 *   FusibleAudio.setYear(annee)                la décennie de la nappe
 *   FusibleAudio.play(evt) / .playAll([evt])   les gestes
 *   FusibleAudio.THEMES / .setTheme(nom|null)  la musique (fondu enchaîné)
 *   FusibleAudio.jingle(nom)                   une phrase jouée une fois
 *
 * La musique, côté partition (les fichiers musique/*.js, le banc, le juke-box) :
 *   FusibleAudio.theme(clé, définition)        enregistre un thème (rend vrai
 *                                              s'il est accepté ; une erreur est
 *                                              gardée, jamais lancée)
 *   FusibleAudio.infos(clé)                    titre, moment, humeur, tonalité, bpm
 *   FusibleAudio.structure(clé)                l'introduction, le corps de la
 *                                              boucle, sa période exacte, en
 *                                              mesures et en secondes (lance
 *                                              l'erreur d'écriture s'il y en a une)
 *   FusibleAudio.erreurs()                     ce qui n'a pas pu s'enregistrer ou
 *                                              se jouer (un thème cassé se tait,
 *                                              il ne casse pas la page)
 *   FusibleAudio.SILENCE                       une mesure vide
 *
 * Un moteur hors ligne se pilote pareil, en passant les temps à la main :
 *   var e = FusibleAudio.createEngine(offlineCtx, offlineCtx.destination);
 *   e.setMode('tout'); e.setAmbiance('tribune', { fade: 0, at: 0 });
 *   e.scheduleUntil(3); offlineCtx.startRendering();
 * Un moteur a aussi `e.setTheme(nom, { at, fade, depuis })` (`depuis` : partir
 * d'une section, de son rang dans l'ordre ou de { index, mesure }) et
 * `e.position(t)` (la section, la mesure, le passage du thème qui joue).
 * ------------------------------------------------------------------------- */
(function (global) {
  'use strict';

  // Les deux vocabulaires fermés du moteur (sfx.dart). L'ordre est celui du
  // Dart : il ne sert à rien ici, mais il rend les écarts visibles.
  var AMBIANCES = ['vestiaire', 'tribune', 'bureau', 'couloir', 'terrain', 'ville', 'maison', 'presse', 'nuit'];
  var SFX = [
    'carte_arrivee', 'choix_gauche', 'choix_droite', 'jauge_danger', 'alarme', 'reaction',
    'nouvelle', 'une', 'match_debut', 'match_but', 'match_encaisse', 'sifflet_final',
    'tampon_fin', 'classement', 'palier_haut', 'palier_bas', 'promesse', 'argent'
  ];
  var MODES = ['tout', 'gestes', 'muet'];

  // --------------------------------------------------------------- hasard --
  // Un générateur à état, cosmétique : il ne touche jamais à la graine de la
  // partie (le son ne déplace pas ce que le moteur raconte).
  function mulberry(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function between(rnd, a, b) { return a + (b - a) * rnd(); }
  function pick(rnd, arr) { return arr[Math.floor(rnd() * arr.length) % arr.length]; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  // ------------------------------------------------------------- matières --
  // Un seul tampon de bruit blanc par contexte : tout le décor en sort (vent,
  // foule, pluie, papier, pas, obturateurs), filtré et enveloppé autrement.
  var NOISE = new WeakMap();
  function noiseBuffer(ctx) {
    var b = NOISE.get(ctx);
    if (b) return b;
    var n = Math.floor(ctx.sampleRate * 4);
    b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = b.getChannelData(c);
      var r = mulberry(0x51ED + c * 7919);
      for (var i = 0; i < n; i++) d[i] = r() * 2 - 1;
    }
    NOISE.set(ctx, b);
    return b;
  }

  // La réverbération, à la main : une réponse impulsionnelle = du bruit qui
  // décroît, plus quelques réflexions précoces posées une par une. Pas de
  // fichier, pas de bibliothèque — un tampon calculé au moment où on en a
  // besoin, et gardé en cache tant que le lieu ne change pas.
  var IR = new WeakMap();
  function impulse(ctx, key, dur, decay, early) {
    var cache = IR.get(ctx);
    if (!cache) { cache = {}; IR.set(ctx, cache); }
    if (cache[key]) return cache[key];
    var n = Math.max(1, Math.floor(ctx.sampleRate * dur));
    var buf = ctx.createBuffer(2, n, ctx.sampleRate);
    var r = mulberry(0xA17 + key.length * 131);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c);
      // le corps : bruit à décroissance exponentielle, un peu assombri par un
      // lissage à un pôle (les aigus meurent avant les graves, comme partout).
      var prev = 0;
      for (var i = 0; i < n; i++) {
        var t = i / n;
        var x = (r() * 2 - 1) * Math.pow(1 - t, decay);
        prev = prev * 0.42 + x * 0.58;
        d[i] = prev;
      }
      // les réflexions précoces : ce qui donne sa taille à la pièce.
      for (var k = 0; k < early.length; k++) {
        var pos = Math.floor(early[k][0] * ctx.sampleRate);
        if (pos > 0 && pos < n) d[pos] += early[k][1] * (c ? 0.86 : 1);
      }
    }
    cache[key] = buf;
    return buf;
  }

  // LA SALLE d'un thème (`salle: { taille, duree, ton }`) : un pré-délai qui
  // dit la taille (4 à 50 ms), quelques réflexions précoces, puis une queue
  // dense, différente à gauche et à droite (la largeur), qui perd 60 dB en
  // `duree` secondes et s'assombrit en route (`ton` : la coupure au départ ;
  // les aigus meurent avant les graves). Calculée une fois par contexte.
  function salleIR(ctx, taille, duree, ton) {
    taille = clamp(taille == null ? 0.6 : +taille, 0, 1);
    duree = clamp(duree == null ? 2.4 : +duree, 0.3, 6);
    ton = clamp(ton == null ? 4500 : +ton, 600, 16000);
    var key = 'salle:' + taille.toFixed(2) + ':' + duree.toFixed(2) + ':' + Math.round(ton);
    var cache = IR.get(ctx);
    if (!cache) { cache = {}; IR.set(ctx, cache); }
    if (cache[key]) return cache[key];
    var sr = ctx.sampleRate, pre = 0.004 + 0.045 * taille;
    var n = Math.max(1, Math.floor(sr * Math.min(duree * 1.1 + pre, 6.5)));
    var buf = ctx.createBuffer(2, n, sr);
    var k = Math.log(1000) / duree, montee = 0.006 + 0.03 * taille;
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c), r = mulberry(0x5A11E + c * 977 + Math.round(taille * 100) * 31 + Math.round(duree * 100));
      var y = 0, i0 = Math.floor(pre * sr);
      for (var i = i0; i < n; i++) {
        var t = (i - i0) / sr;
        var fc = ton * (0.22 + 0.78 * Math.exp(-3 * t / duree));
        var a = 1 - Math.exp(-2 * Math.PI * fc / sr);
        y += a * ((r() * 2 - 1) - y);
        d[i] = y * Math.exp(-k * t) * Math.min(1, t / montee);
      }
      // les premiers murs : des copies franches, de plus en plus faibles
      for (var e = 0; e < 7; e++) {
        var p = i0 + Math.floor(sr * (0.002 + r() * (0.01 + 0.05 * taille)));
        if (p < n) d[p] += (r() < 0.5 ? -1 : 1) * (1.4 - e * 0.16);
      }
    }
    return (cache[key] = buf);
  }
  // LA PORTE (la caisse claire « gated » des années quatre-vingt, `batt.porte`) :
  // une réverbération dense qui tient `tenue` secondes — elle monte même un peu,
  // pour compenser la caisse qui s'éteint dedans, comme les vieux programmes
  // « non linéaires » — puis qu'on ferme d'un coup : la porte de bruit qui
  // coupait la salle.
  function porteIR(ctx, tenue) {
    tenue = clamp(tenue == null ? 0.24 : +tenue, 0.08, 0.6);
    var key = 'porte:' + tenue.toFixed(3);
    var cache = IR.get(ctx);
    if (!cache) { cache = {}; IR.set(ctx, cache); }
    if (cache[key]) return cache[key];
    var sr = ctx.sampleRate, n = Math.floor(sr * (tenue + 0.03));
    var buf = ctx.createBuffer(2, n, sr), a = 1 - Math.exp(-2 * Math.PI * 7000 / sr);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c), r = mulberry(0x6A7E + c * 613), y = 0;
      for (var i = 0; i < n; i++) {
        var t = i / sr;
        y += a * ((r() * 2 - 1) - y);
        var g = t < 0.004 ? 0.7 * t / 0.004 : t < tenue ? 0.7 + 0.3 * (t - 0.004) / tenue : Math.max(0, 1 - (t - tenue) / 0.012);
        d[i] = y * g;
      }
    }
    return (cache[key] = buf);
  }

  // ------------------------------------------------------------- briques ---
  function gain(ctx, v) { var g = ctx.createGain(); g.gain.value = v; return g; }

  function src(ctx, t, loop, rate) {
    var s = ctx.createBufferSource();
    s.buffer = noiseBuffer(ctx);
    // Toujours en boucle : c'est l'appelant qui coupe. Le point de départ
    // change à chaque fois — deux passages ne donnent jamais le même grain.
    s.loop = true;
    if (rate) s.playbackRate.value = rate;
    s.start(t, (t * 7.13 + 0.31) % 3.9);
    return s;
  }

  // Une enveloppe percussive : montée courte, chute exponentielle.
  function shape(param, t, attack, decay, peak) {
    var p = Math.max(peak, 0.0002);
    param.cancelScheduledValues(t);
    param.setValueAtTime(0.0001, t);
    param.linearRampToValueAtTime(p, t + Math.max(attack, 0.001));
    param.exponentialRampToValueAtTime(0.0001, t + Math.max(attack, 0.001) + Math.max(decay, 0.01));
  }

  // Un oscillateur court : hauteur qui glisse, enveloppe, sortie.
  function tone(ctx, out, t, o) {
    var osc = ctx.createOscillator();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(o.f2, 1), t + o.dur);
    if (o.detune) osc.detune.value = o.detune;
    var g = gain(ctx, 0.0001);
    shape(g.gain, t, o.attack || 0.004, o.dur, o.peak);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + (o.attack || 0.004) + o.dur + 0.08);
    return osc;
  }

  // Un souffle court : bruit filtré, enveloppé. Le pain quotidien du décor.
  function burst(ctx, out, t, o) {
    var s = src(ctx, t, false, o.rate || 1);
    var f = ctx.createBiquadFilter();
    f.type = o.type || 'bandpass';
    f.frequency.setValueAtTime(o.f, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(Math.max(o.f2, 20), t + o.dur);
    f.Q.value = o.q == null ? 1 : o.q;
    var g = gain(ctx, 0.0001);
    shape(g.gain, t, o.attack || 0.003, o.dur, o.peak);
    var last = s.connect(f).connect(g);
    if (o.pan != null && ctx.createStereoPanner) {
      var p = ctx.createStereoPanner();
      p.pan.value = clamp(o.pan, -1, 1);
      last = last.connect(p);
    }
    last.connect(out);
    s.stop(t + (o.attack || 0.003) + o.dur + 0.08);
    return s;
  }

  // Un mouvement lent posé sur un paramètre : c'est ce qui empêche une boucle
  // d'être une boucle. Les fréquences sont volontairement incommensurables.
  // Pendant qu'on fabrique un lit ou une nappe, `RECOLTE` ramasse ces
  // oscillateurs pour qu'ils s'arrêtent avec lui : sans ça, chaque lieu quitté
  // en laissait tourner deux ou trois jusqu'à la fin de la partie.
  var RECOLTE = null;
  function drift(ctx, param, t, center, depth, rate) {
    var o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = rate;
    var g = gain(ctx, depth);
    param.value = center;
    o.connect(g).connect(param);
    o.start(t);
    if (RECOLTE) RECOLTE.push(o);
    return o;
  }

  // ------------------------------------------------------------ les lieux --
  // Chaque lieu : une salle (réverbération), un lit continu, et des événements
  // tirés dans un intervalle. `evs` est lu par le séquenceur à fenêtre
  // glissante — le même code sert au direct et au rendu hors ligne. Un
  // événement est [écart min, écart max, bruit, sous la musique ?] : sous un
  // thème, le lit se tait et seuls les événements marqués `true` jouent, plus
  // bas et deux fois plus espacés (jamais un souffle, jamais un tic régulier,
  // jamais une hauteur fixe qui sonnerait faux contre le thème).
  var PLACES = {

    vestiaire: {
      wet: 0.34, ir: ['vest', 0.9, 3.4, [[0.011, 0.5], [0.019, -0.36], [0.031, 0.24], [0.047, -0.16]]],
      bed: function (ctx, out, t, rnd) {
        // le ronflement d'une pièce carrelée, et rien d'autre : le vestiaire
        // se remarque à ses échos, pas à son fond.
        var s = src(ctx, t, true, 0.72);
        var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 0.6;
        var g = gain(ctx, 0.05);
        drift(ctx, f.frequency, t, 230, 60, 0.043);
        drift(ctx, g.gain, t, 0.05, 0.018, 0.031);
        s.connect(f).connect(g).connect(out);
        return [s];
      },
      evs: [
        // le robinet qui goutte
        [1.7, 4.6, function (ctx, out, t, rnd) {
          tone(ctx, out, t, { type: 'sine', f: between(rnd, 1150, 1500), f2: between(rnd, 520, 700), dur: 0.09, peak: 0.05 });
          burst(ctx, out, t, { f: between(rnd, 2600, 3400), dur: 0.035, q: 2, peak: 0.03 });
        }, true],
        // une porte de casier, un banc, un pas sur le carrelage
        [5.5, 13, function (ctx, out, t, rnd) {
          var pan = between(rnd, -0.6, 0.6);
          burst(ctx, out, t, { type: 'lowpass', f: between(rnd, 400, 700), dur: 0.16, q: 0.7, peak: 0.13, pan: pan });
          tone(ctx, out, t, { type: 'triangle', f: between(rnd, 78, 104), f2: 52, dur: 0.13, peak: 0.06 });
          if (rnd() < 0.45) burst(ctx, out, t + between(rnd, 0.11, 0.2), { f: between(rnd, 1800, 2600), dur: 0.05, q: 3, peak: 0.05, pan: pan });
        }, true]
      ]
    },

    tribune: {
      wet: 0.42, ir: ['trib', 2.2, 2.1, [[0.023, 0.34], [0.041, -0.26], [0.067, 0.2], [0.103, -0.14]]],
      bed: function (ctx, out, t, rnd) {
        // la rumeur : du bruit large, filtré bas, qui respire. Une foule, de
        // loin, c'est exactement ça — un souffle qui monte et retombe.
        var s = src(ctx, t, true, 0.55);
        var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.55;
        var g = gain(ctx, 0.1);
        drift(ctx, f.frequency, t, 620, 190, 0.037);
        drift(ctx, g.gain, t, 0.1, 0.05, 0.023);
        var f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = 1800;
        s.connect(f).connect(f2).connect(g).connect(out);
        return [s];
      },
      evs: [
        // le tambour du kop : trois ou quatre coups, jamais dans le tempo
        [4.5, 11, function (ctx, out, t, rnd) {
          var n = 3 + Math.floor(rnd() * 4), step = between(rnd, 0.42, 0.62);
          for (var i = 0; i < n; i++) {
            var tt = t + i * step;
            tone(ctx, out, tt, { type: 'sine', f: between(rnd, 62, 76), f2: 41, dur: 0.22, peak: 0.1 });
            burst(ctx, out, tt, { type: 'lowpass', f: 300, dur: 0.05, q: 0.5, peak: 0.045 });
          }
        }],
        // un chant sans paroles : deux voyelles tenues, deux formants, rien
        // qui ressemble à un mot.
        [9, 21, function (ctx, out, t, rnd) {
          var dur = between(rnd, 1.1, 1.9);
          var s = src(ctx, t, true, 0.5);
          var f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.Q.value = 6;
          var f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.Q.value = 5;
          f1.frequency.setValueAtTime(between(rnd, 480, 620), t);
          f1.frequency.linearRampToValueAtTime(between(rnd, 620, 760), t + dur);
          f2.frequency.value = between(rnd, 1000, 1350);
          var g = gain(ctx, 0.0001);
          shape(g.gain, t, dur * 0.35, dur * 0.7, 0.075);
          s.connect(f1).connect(g).connect(out);
          s.connect(f2).connect(g);
          s.stop(t + dur * 1.2);
        }]
      ]
    },

    bureau: {
      wet: 0.16, ir: ['bur', 0.5, 4.6, [[0.007, 0.4], [0.013, -0.26], [0.021, 0.15]]],
      bed: function (ctx, out, t, rnd) {
        // la ville étouffée derrière une double vitre, et le bourdon d'un
        // radiateur qu'on n'entend qu'en se taisant.
        var s = src(ctx, t, true, 0.4);
        var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 0.4;
        var g = gain(ctx, 0.055);
        drift(ctx, f.frequency, t, 180, 45, 0.019);
        drift(ctx, g.gain, t, 0.055, 0.02, 0.029);
        s.connect(f).connect(g).connect(out);
        var h = ctx.createOscillator(); h.type = 'sine'; h.frequency.value = 51;
        var hg = gain(ctx, 0.022);
        h.connect(hg).connect(out); h.start(t);
        return [s, h];
      },
      evs: [
        // l'horloge : une seconde, pile. C'est la seule chose du jeu qui soit
        // à l'heure.
        [1, 1, function (ctx, out, t, rnd) {
          var tick = (Math.round(t * 2) % 2) === 0;
          burst(ctx, out, t, { f: tick ? between(rnd, 2100, 2400) : between(rnd, 1500, 1750), dur: 0.02, q: 5, peak: 0.038 });
          tone(ctx, out, t, { type: 'triangle', f: tick ? 1900 : 1350, dur: 0.018, peak: 0.02 });
        }],
        // des papiers qu'on retourne
        [4.5, 12, function (ctx, out, t, rnd) {
          var n = 2 + Math.floor(rnd() * 3);
          for (var i = 0; i < n; i++) {
            burst(ctx, out, t + i * between(rnd, 0.07, 0.16), {
              type: 'highpass', f: between(rnd, 1800, 3200), dur: between(rnd, 0.05, 0.11), q: 0.7,
              peak: between(rnd, 0.03, 0.055), pan: between(rnd, -0.4, 0.4)
            });
          }
        }]
      ]
    },

    couloir: {
      wet: 0.5, ir: ['coul', 1.5, 2.6, [[0.017, 0.44], [0.033, -0.3], [0.052, 0.22], [0.081, -0.15], [0.12, 0.1]]],
      bed: function (ctx, out, t, rnd) {
        // le néon : 100 Hz, sa quinte de secteur, et un grésillement qui
        // clignote juste assez pour qu'on lève les yeux.
        var a = ctx.createOscillator(); a.type = 'sine'; a.frequency.value = 100;
        var b = ctx.createOscillator(); b.type = 'sine'; b.frequency.value = 200.7;
        var ag = gain(ctx, 0.026), bg = gain(ctx, 0.01);
        drift(ctx, ag.gain, t, 0.026, 0.01, 0.13);
        a.connect(ag).connect(out); b.connect(bg).connect(out);
        a.start(t); b.start(t);
        var s = src(ctx, t, true, 1.3);
        var f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 4200;
        var g = gain(ctx, 0.012);
        drift(ctx, g.gain, t, 0.012, 0.009, 3.1);
        s.connect(f).connect(g).connect(out);
        return [a, b, s];
      },
      evs: [
        // des pas qui passent et s'éloignent
        [7, 18, function (ctx, out, t, rnd) {
          var n = 4 + Math.floor(rnd() * 5), step = between(rnd, 0.36, 0.52), pan = between(rnd, -0.8, 0.8);
          for (var i = 0; i < n; i++) {
            var k = 1 - i / (n + 2);
            burst(ctx, out, t + i * step, {
              type: 'bandpass', f: between(rnd, 900, 1500), f2: 320, dur: 0.06, q: 1.2,
              peak: 0.075 * k, pan: pan * (1 - i / n) - pan * (i / n) * 0.4
            });
            tone(ctx, out, t + i * step, { type: 'sine', f: between(rnd, 96, 128), f2: 60, dur: 0.07, peak: 0.03 * k });
          }
        }, true],
        // une porte, quelque part au fond
        [11, 26, function (ctx, out, t, rnd) {
          burst(ctx, out, t, { type: 'lowpass', f: between(rnd, 320, 520), dur: 0.2, q: 0.6, peak: 0.07, pan: between(rnd, -0.7, 0.7) });
        }, true]
      ]
    },

    terrain: {
      wet: 0.3, ir: ['terr', 1.7, 3.2, [[0.031, 0.22], [0.058, -0.15], [0.09, 0.11]]],
      bed: function (ctx, out, t, rnd) {
        // le vent dans un stade vide : large, sans direction, jamais deux fois
        // la même rafale.
        var s = src(ctx, t, true, 0.35);
        var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 1.4;
        var g = gain(ctx, 0.075);
        drift(ctx, f.frequency, t, 520, 300, 0.047);
        drift(ctx, g.gain, t, 0.075, 0.045, 0.061);
        s.connect(f).connect(g).connect(out);
        // la rumeur lointaine des tribunes garnies
        var s2 = src(ctx, t, true, 0.6);
        var f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 420; f2.Q.value = 0.7;
        var g2 = gain(ctx, 0.035);
        drift(ctx, g2.gain, t, 0.035, 0.022, 0.033);
        s2.connect(f2).connect(g2).connect(out);
        return [s, s2];
      },
      evs: [
        // un coup de sifflet, loin, pour quelqu'un d'autre
        [9, 24, function (ctx, out, t, rnd) {
          whistle(ctx, out, t, between(rnd, 0.12, 0.2), 0.035, rnd);
        }],
        // un ballon frappé
        [5, 14, function (ctx, out, t, rnd) {
          burst(ctx, out, t, { type: 'bandpass', f: between(rnd, 260, 420), dur: 0.09, q: 1.1, peak: 0.08, pan: between(rnd, -0.5, 0.5) });
          tone(ctx, out, t, { type: 'triangle', f: between(rnd, 120, 170), f2: 70, dur: 0.1, peak: 0.045 });
        }, true]
      ]
    },

    ville: {
      wet: 0.24, ir: ['vil', 1.1, 3.6, [[0.021, 0.26], [0.039, -0.18], [0.062, 0.12]]],
      bed: function (ctx, out, t, rnd) {
        // la circulation continue, un étage plus bas.
        var s = src(ctx, t, true, 0.45);
        var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 0.7;
        var g = gain(ctx, 0.08);
        drift(ctx, f.frequency, t, 340, 120, 0.027);
        drift(ctx, g.gain, t, 0.08, 0.03, 0.041);
        s.connect(f).connect(g).connect(out);
        return [s];
      },
      evs: [
        // une voiture qui passe : le filtre s'ouvre puis se referme
        [3.5, 9, function (ctx, out, t, rnd) {
          var dur = between(rnd, 0.9, 1.7), pan = rnd() < 0.5 ? -0.8 : 0.8;
          var s = src(ctx, t, true, 0.5);
          var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.9;
          f.frequency.setValueAtTime(between(rnd, 300, 420), t);
          f.frequency.linearRampToValueAtTime(between(rnd, 900, 1400), t + dur * 0.5);
          f.frequency.linearRampToValueAtTime(280, t + dur);
          var g = gain(ctx, 0.0001);
          shape(g.gain, t, dur * 0.45, dur * 0.6, between(rnd, 0.06, 0.1));
          var last = s.connect(f).connect(g);
          if (ctx.createStereoPanner) {
            var p = ctx.createStereoPanner();
            p.pan.setValueAtTime(pan, t);
            p.pan.linearRampToValueAtTime(-pan, t + dur);
            last = last.connect(p);
          }
          last.connect(out);
          s.stop(t + dur * 1.2);
        }],
        // un klaxon, une conversation qui traverse la rue
        [12, 28, function (ctx, out, t, rnd) {
          if (rnd() < 0.5) {
            var f0 = between(rnd, 380, 470);
            tone(ctx, out, t, { type: 'square', f: f0, dur: between(rnd, 0.16, 0.3), peak: 0.028 });
            tone(ctx, out, t, { type: 'square', f: f0 * 1.26, dur: 0.22, peak: 0.018 });
          } else {
            var d = between(rnd, 0.5, 1.0);
            var s = src(ctx, t, true, 0.9);
            var fb = ctx.createBiquadFilter(); fb.type = 'bandpass'; fb.Q.value = 4;
            var dv = drift(ctx, fb.frequency, t, between(rnd, 700, 1100), 300, between(rnd, 3, 6));
            var g = gain(ctx, 0.0001);
            shape(g.gain, t, d * 0.3, d * 0.8, 0.04);
            s.connect(fb).connect(g).connect(out);
            s.stop(t + d * 1.3); dv.stop(t + d * 1.3);
          }
        }]
      ]
    },

    maison: {
      wet: 0.14, ir: ['mais', 0.45, 5, [[0.006, 0.36], [0.011, -0.22], [0.018, 0.13]]],
      bed: function (ctx, out, t, rnd) {
        // la télévision en sourdine dans la pièce d'à côté : une bande étroite
        // qui bouge comme une voix, sans jamais dire un mot.
        var s = src(ctx, t, true, 0.8);
        var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 2.2;
        var g = gain(ctx, 0.05);
        drift(ctx, f.frequency, t, 780, 380, 1.7);
        drift(ctx, g.gain, t, 0.05, 0.035, 2.9);
        var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
        s.connect(f).connect(lp).connect(g).connect(out);
        // le fond de la maison
        var s2 = src(ctx, t, true, 0.3);
        var f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = 150;
        s2.connect(f2).connect(gain(ctx, 0.03)).connect(out);
        return [s, s2];
      },
      evs: [
        // le stade dans le poste : ça monte, ça retombe, ce n'était rien
        [8, 20, function (ctx, out, t, rnd) {
          var dur = between(rnd, 0.8, 1.6);
          var s = src(ctx, t, true, 0.55);
          var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = between(rnd, 600, 900); f.Q.value = 1.1;
          var g = gain(ctx, 0.0001);
          shape(g.gain, t, dur * 0.3, dur * 0.75, between(rnd, 0.05, 0.085));
          s.connect(f).connect(g).connect(out);
          s.stop(t + dur * 1.3);
        }],
        // une tasse, une chaise, quelqu'un qui bouge dans la cuisine
        [6, 16, function (ctx, out, t, rnd) {
          tone(ctx, out, t, { type: 'triangle', f: between(rnd, 900, 1500), dur: 0.07, peak: 0.035, pan: 0.3 });
          burst(ctx, out, t + 0.02, { type: 'highpass', f: 2600, dur: 0.05, q: 0.8, peak: 0.025 });
        }]
      ]
    },

    presse: {
      wet: 0.3, ir: ['pres', 1.2, 3, [[0.013, 0.4], [0.026, -0.27], [0.043, 0.18], [0.07, -0.12]]],
      bed: function (ctx, out, t, rnd) {
        // le brouhaha d'une salle trop petite pour tous ces micros.
        var s = src(ctx, t, true, 0.75);
        var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8;
        var g = gain(ctx, 0.075);
        drift(ctx, f.frequency, t, 860, 260, 0.083);
        drift(ctx, g.gain, t, 0.075, 0.03, 0.117);
        s.connect(f).connect(g).connect(out);
        return [s];
      },
      evs: [
        // les déclencheurs : une rafale part, les autres suivent
        [1.8, 5.5, function (ctx, out, t, rnd) {
          var n = 2 + Math.floor(rnd() * 5);
          for (var i = 0; i < n; i++) {
            var tt = t + i * between(rnd, 0.055, 0.13);
            burst(ctx, out, tt, {
              type: 'highpass', f: between(rnd, 2600, 4200), dur: between(rnd, 0.012, 0.028), q: 0.9,
              peak: between(rnd, 0.05, 0.09), pan: between(rnd, -0.8, 0.8)
            });
            tone(ctx, out, tt, { type: 'square', f: between(rnd, 1400, 2200), f2: 700, dur: 0.012, peak: 0.02 });
          }
        }]
      ]
    },

    nuit: {
      wet: 0.22, ir: ['nuit', 1.3, 3.4, [[0.019, 0.24], [0.037, -0.16], [0.059, 0.1]]],
      bed: function (ctx, out, t, rnd) {
        // la pluie : du bruit haut, dense, qui varie à peine.
        var s = src(ctx, t, true, 1.15);
        var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1100;
        var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.5;
        var g = gain(ctx, 0.07);
        drift(ctx, lp.frequency, t, 5200, 1400, 0.053);
        drift(ctx, g.gain, t, 0.07, 0.022, 0.037);
        s.connect(hp).connect(lp).connect(g).connect(out);
        // la circulation mouillée, en bas
        var s2 = src(ctx, t, true, 0.4);
        var f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = 260;
        s2.connect(f2).connect(gain(ctx, 0.05)).connect(out);
        return [s, s2];
      },
      evs: [
        // une goutte sur une gouttière
        [2.5, 7, function (ctx, out, t, rnd) {
          tone(ctx, out, t, { type: 'sine', f: between(rnd, 900, 1700), f2: between(rnd, 380, 600), dur: 0.07, peak: 0.045, pan: between(rnd, -0.6, 0.6) });
        }, true],
        // une voiture sur l'asphalte trempé
        [10, 24, function (ctx, out, t, rnd) {
          var dur = between(rnd, 1.2, 2.0);
          var s = src(ctx, t, true, 0.7);
          var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8;
          f.frequency.setValueAtTime(500, t);
          f.frequency.linearRampToValueAtTime(1500, t + dur * 0.5);
          f.frequency.linearRampToValueAtTime(400, t + dur);
          var g = gain(ctx, 0.0001);
          shape(g.gain, t, dur * 0.4, dur * 0.65, 0.07);
          s.connect(f).connect(g).connect(out);
          s.stop(t + dur * 1.2);
        }]
      ]
    }
  };

  // Le sifflet, partagé par le terrain et par trois gestes : deux sinus en
  // quinte, une trille rapide, un souffle. C'est tout un arbitre.
  function whistle(ctx, out, t, dur, peak, rnd) {
    var f0 = between(rnd, 2350, 2750);
    var a = ctx.createOscillator(); a.type = 'sine'; a.frequency.value = f0;
    var b = ctx.createOscillator(); b.type = 'sine'; b.frequency.value = f0 * 1.5;
    // la bille dans la coquille : un vibrato rapide, jamais à la même vitesse
    var v = ctx.createOscillator(); v.type = 'sine'; v.frequency.value = between(rnd, 28, 44);
    var vg = gain(ctx, between(rnd, 60, 120));
    v.connect(vg).connect(a.frequency); v.start(t); v.stop(t + dur + 0.1);
    var g = gain(ctx, 0.0001);
    shape(g.gain, t, 0.012, dur, peak);
    var bg = gain(ctx, 0.35);
    a.connect(g).connect(out);
    b.connect(bg).connect(g);
    a.start(t); b.start(t);
    a.stop(t + dur + 0.1); b.stop(t + dur + 0.1);
    burst(ctx, out, t, { type: 'highpass', f: 3000, dur: dur * 0.6, q: 0.7, peak: peak * 0.4 });
  }

  // ------------------------------------------------------------ la nappe --
  // Une trame par décennie. Jamais de mélodie : un accord tenu, un filtre qui
  // respire. Les années 90 sont synthétiques (dents de scie désaccordées,
  // filtre résonant) ; on se dépouille à mesure que le siècle avance, jusqu'à
  // deux sinus et un souffle en 2040.
  var DECADES = [
    { from: 0, type: 'sawtooth', voices: [0, 7, 12, 19], detune: 9, cut: 380, q: 6.5, rate: 0.037, sub: 0.5 },
    { from: 2000, type: 'sawtooth', voices: [0, 7, 12], detune: 6, cut: 340, q: 4.5, rate: 0.029, sub: 0.45 },
    { from: 2010, type: 'triangle', voices: [0, 7, 12], detune: 4, cut: 460, q: 2.2, rate: 0.023, sub: 0.4 },
    { from: 2020, type: 'triangle', voices: [0, 7], detune: 3, cut: 520, q: 1.4, rate: 0.019, sub: 0.35 },
    { from: 2035, type: 'sine', voices: [0, 7], detune: 2, cut: 620, q: 0.9, rate: 0.013, sub: 0.3 }
  ];
  function decadeOf(year) {
    var d = DECADES[0];
    for (var i = 0; i < DECADES.length; i++) if (year >= DECADES[i].from) d = DECADES[i];
    return d;
  }

  // ------------------------------------------------------------ les gestes -
  // Un son par événement de `card.sfx`. Court, sec, et jamais deux fois le même
  // (la hauteur, la durée et le timbre sont tirés à chaque appel).
  var GESTES = {
    // la vignette qui se pose : du papier, un peu de bois.
    carte_arrivee: function (ctx, out, t, rnd) {
      burst(ctx, out, t, { type: 'bandpass', f: between(rnd, 1700, 2600), f2: 600, dur: 0.07, q: 0.9, peak: 0.11 });
      tone(ctx, out, t, { type: 'triangle', f: between(rnd, 150, 200), f2: 80, dur: 0.06, peak: 0.05 });
    },
    // les deux sorties : le même geste, deux côtés. Gauche plus sourd.
    choix_gauche: function (ctx, out, t, rnd) {
      burst(ctx, out, t, { type: 'lowpass', f: between(rnd, 700, 1000), dur: 0.1, q: 0.8, peak: 0.1, pan: -0.4 });
      tone(ctx, out, t, { type: 'sine', f: between(rnd, 190, 230), f2: 110, dur: 0.09, peak: 0.055 });
    },
    choix_droite: function (ctx, out, t, rnd) {
      burst(ctx, out, t, { type: 'bandpass', f: between(rnd, 1300, 1800), dur: 0.08, q: 1.2, peak: 0.09, pan: 0.4 });
      tone(ctx, out, t, { type: 'sine', f: between(rnd, 250, 300), f2: 170, dur: 0.08, peak: 0.05 });
    },
    // une jauge au bord : deux graves qui battent l'un contre l'autre.
    jauge_danger: function (ctx, out, t, rnd) {
      var f = between(rnd, 96, 118);
      tone(ctx, out, t, { type: 'sine', f: f, dur: 0.5, attack: 0.09, peak: 0.075 });
      tone(ctx, out, t, { type: 'sine', f: f * 1.012, dur: 0.5, attack: 0.09, peak: 0.06 });
    },
    // l'alarme : deux coups, dans le nez, sans réverbération.
    alarme: function (ctx, out, t, rnd) {
      var f = between(rnd, 600, 700);
      for (var i = 0; i < 2; i++) {
        tone(ctx, out, t + i * 0.14, { type: 'square', f: i ? f * 1.335 : f, dur: 0.1, peak: 0.055 });
        burst(ctx, out, t + i * 0.14, { type: 'bandpass', f: f * 3, dur: 0.05, q: 3, peak: 0.03 });
      }
    },
    // quelqu'un rebondit sur ton choix : un bloc de bois.
    reaction: function (ctx, out, t, rnd) {
      tone(ctx, out, t, { type: 'triangle', f: between(rnd, 780, 1050), f2: 420, dur: 0.05, peak: 0.08 });
      burst(ctx, out, t, { type: 'bandpass', f: between(rnd, 2200, 3000), dur: 0.025, q: 2.5, peak: 0.04 });
    },
    // le monde parle : deux notes de radio, et le souffle d'un poste qu'on règle.
    nouvelle: function (ctx, out, t, rnd) {
      var f = between(rnd, 980, 1120);
      tone(ctx, out, t, { type: 'sine', f: f, dur: 0.13, peak: 0.055 });
      tone(ctx, out, t + 0.1, { type: 'sine', f: f * 1.5, dur: 0.18, peak: 0.045 });
      burst(ctx, out, t, { type: 'bandpass', f: between(rnd, 1200, 1800), f2: 3000, dur: 0.16, q: 4, peak: 0.028 });
    },
    // la Une : une presse qui claque, une plaque qui résonne.
    une: function (ctx, out, t, rnd) {
      tone(ctx, out, t, { type: 'sine', f: between(rnd, 70, 92), f2: 45, dur: 0.22, peak: 0.11 });
      burst(ctx, out, t, { type: 'lowpass', f: 900, dur: 0.12, q: 0.7, peak: 0.09 });
      burst(ctx, out, t + 0.05, { type: 'bandpass', f: between(rnd, 2400, 3400), dur: 0.3, q: 7, peak: 0.03 });
    },
    // le coup d'envoi : un sifflet net, un souffle de foule.
    match_debut: function (ctx, out, t, rnd) {
      whistle(ctx, out, t, 0.22, 0.075, rnd);
      burst(ctx, out, t + 0.06, { type: 'bandpass', f: 700, dur: 0.5, q: 0.6, peak: 0.05 });
    },
    // ça rentre : deux notes qui montent, et le stade derrière.
    match_but: function (ctx, out, t, rnd) {
      var f = between(rnd, 380, 440);
      tone(ctx, out, t, { type: 'triangle', f: f, dur: 0.12, peak: 0.07 });
      tone(ctx, out, t + 0.09, { type: 'triangle', f: f * 1.5, dur: 0.28, peak: 0.065 });
      burst(ctx, out, t + 0.04, { type: 'bandpass', f: 760, dur: 0.7, q: 0.7, peak: 0.055 });
    },
    // on encaisse : deux notes qui tombent, un coup mat.
    match_encaisse: function (ctx, out, t, rnd) {
      var f = between(rnd, 330, 380);
      tone(ctx, out, t, { type: 'triangle', f: f, dur: 0.13, peak: 0.06 });
      tone(ctx, out, t + 0.1, { type: 'triangle', f: f * 0.749, dur: 0.34, peak: 0.06 });
      burst(ctx, out, t, { type: 'lowpass', f: 320, dur: 0.2, q: 0.6, peak: 0.06 });
    },
    // fin du match : court, court, long.
    sifflet_final: function (ctx, out, t, rnd) {
      whistle(ctx, out, t, 0.11, 0.07, rnd);
      whistle(ctx, out, t + 0.17, 0.11, 0.07, rnd);
      whistle(ctx, out, t + 0.34, 0.42, 0.08, rnd);
    },
    // le tampon sur le dossier : bois, encre, et le silence après.
    tampon_fin: function (ctx, out, t, rnd) {
      tone(ctx, out, t, { type: 'sine', f: between(rnd, 58, 74), f2: 38, dur: 0.4, peak: 0.13 });
      burst(ctx, out, t, { type: 'lowpass', f: between(rnd, 500, 800), dur: 0.16, q: 0.8, peak: 0.11 });
      burst(ctx, out, t + 0.012, { type: 'bandpass', f: between(rnd, 1600, 2400), dur: 0.06, q: 1.6, peak: 0.05 });
    },
    // le classement : trois barreaux d'échelle, en montant.
    classement: function (ctx, out, t, rnd) {
      var f = between(rnd, 620, 700);
      for (var i = 0; i < 3; i++) {
        tone(ctx, out, t + i * 0.07, { type: 'sine', f: f * Math.pow(1.122, i), dur: 0.1, peak: 0.05 });
      }
      burst(ctx, out, t, { type: 'highpass', f: 2400, dur: 0.09, q: 0.7, peak: 0.03 });
    },
    // un palier franchi vers le haut : une quinte, sans insister.
    palier_haut: function (ctx, out, t, rnd) {
      var f = between(rnd, 440, 500);
      tone(ctx, out, t, { type: 'sine', f: f, dur: 0.16, attack: 0.01, peak: 0.055 });
      tone(ctx, out, t + 0.11, { type: 'sine', f: f * 1.5, dur: 0.3, attack: 0.01, peak: 0.05 });
    },
    // et vers le bas : la même chose, à l'envers.
    palier_bas: function (ctx, out, t, rnd) {
      var f = between(rnd, 430, 490);
      tone(ctx, out, t, { type: 'sine', f: f, dur: 0.16, attack: 0.01, peak: 0.05 });
      tone(ctx, out, t + 0.11, { type: 'sine', f: f * 0.667, dur: 0.34, attack: 0.01, peak: 0.055 });
    },
    // la promesse au patron : un accord chaud, une poignée de main.
    promesse: function (ctx, out, t, rnd) {
      var f = between(rnd, 196, 224);
      tone(ctx, out, t, { type: 'triangle', f: f, dur: 0.42, attack: 0.03, peak: 0.055 });
      tone(ctx, out, t, { type: 'triangle', f: f * 1.5, dur: 0.38, attack: 0.05, peak: 0.04 });
      tone(ctx, out, t, { type: 'sine', f: f * 2, dur: 0.34, attack: 0.07, peak: 0.03 });
    },
    // l'argent : trois ou quatre pièces, et rien qui sonne pareil.
    argent: function (ctx, out, t, rnd) {
      var n = 3 + Math.floor(rnd() * 2);
      for (var i = 0; i < n; i++) {
        var tt = t + i * between(rnd, 0.03, 0.075);
        tone(ctx, out, tt, { type: 'triangle', f: between(rnd, 2100, 3600), dur: between(rnd, 0.05, 0.12), peak: between(rnd, 0.03, 0.05) });
        burst(ctx, out, tt, { type: 'highpass', f: 4200, dur: 0.02, q: 1, peak: 0.02 });
      }
    },
    // ---- les bruits des scènes jouées (ville_cinema.js, l'étape `son:`) : hors du
    // vocabulaire du moteur, la ville seule les joue ----
    // le téléphone à cadran : deux sonneries, la cloche frappée vingt fois par seconde.
    sonnerie: function (ctx, out, t, rnd) {
      var f = between(rnd, 860, 940);
      for (var r = 0; r < 2; r++) {
        for (var i = 0; i < 8; i++) {
          var tt = t + r * 0.62 + i * 0.05;
          tone(ctx, out, tt, { type: 'triangle', f: f, dur: 0.045, peak: 0.045, pan: i % 2 ? 0.12 : -0.12 });
          tone(ctx, out, tt, { type: 'sine', f: f * 2.76, dur: 0.035, peak: 0.016 });
        }
      }
    },
    // la sirène de l'usine (ou celle qui passe au loin) : elle monte, elle tient, elle retombe.
    sirene: function (ctx, out, t, rnd) {
      var lo = between(rnd, 260, 300), hi = lo * 2.35;
      [0, 7].forEach(function (d) {
        tone(ctx, out, t, { type: 'sawtooth', f: lo, f2: hi, dur: 1.15, attack: 0.25, peak: 0.022, detune: d });
        tone(ctx, out, t + 1.15, { type: 'sawtooth', f: hi, f2: lo * 1.1, dur: 1.5, attack: 0.02, peak: 0.022, detune: d });
      });
      burst(ctx, out, t, { type: 'bandpass', f: 900, dur: 2.4, q: 0.6, peak: 0.012 });
    },
    // une porte qu'on claque : le bois, la serrure, le chambranle qui vibre.
    porte: function (ctx, out, t, rnd) {
      tone(ctx, out, t, { type: 'sine', f: between(rnd, 62, 78), f2: 38, dur: 0.3, peak: 0.13 });
      burst(ctx, out, t, { type: 'lowpass', f: between(rnd, 500, 750), dur: 0.14, q: 0.8, peak: 0.1 });
      burst(ctx, out, t + 0.03, { type: 'bandpass', f: between(rnd, 1800, 2600), dur: 0.06, q: 2, peak: 0.035 });
    },
    // un klaxon dans la rue : deux notes en même temps, dans le nez.
    klaxon: function (ctx, out, t, rnd) {
      var f = between(rnd, 400, 440);
      tone(ctx, out, t, { type: 'square', f: f, dur: 0.42, attack: 0.01, peak: 0.045 });
      tone(ctx, out, t, { type: 'square', f: f * 1.26, dur: 0.42, attack: 0.01, peak: 0.036 });
    },
    // deux verres qui se touchent.
    verre: function (ctx, out, t, rnd) {
      var f = between(rnd, 2500, 3100);
      tone(ctx, out, t, { type: 'sine', f: f, dur: 0.32, attack: 0.002, peak: 0.04 });
      tone(ctx, out, t, { type: 'sine', f: f * 1.47, dur: 0.22, attack: 0.002, peak: 0.018 });
      tone(ctx, out, t + 0.09, { type: 'sine', f: f * 1.06, dur: 0.24, attack: 0.002, peak: 0.025 });
    }
  };

  // ============================================================ la musique =
  // Deux retours du client, en octobre 2026. D'abord : « la bande principale
  // n'est vraiment pas fun », « il faudrait d'autres thèmes ». Puis, sur la
  // première partition (un hymne en majeur, un marché qui sifflotait) : « ce
  // n'est pas du tout dans l'esprit du jeu, qui se veut avec des histoires
  // sombres, là c'est beaucoup trop joyeux ». La musique est donc NOIRE, et
  // elle doit rester amusante à écouter : du synthé de polar, des tonalités
  // mineures, une basse qui pulse en doubles croches, une grosse caisse qui
  // fait pomper tout le reste, une caisse claire « gated » des années
  // quatre-vingt, des échos qui rebondissent d'une oreille à l'autre, et pour
  // chaque thème un motif qu'on garde dans la tête. Toujours rien
  // qu'oscillateurs et bruit : aucun fichier, aucune URL.
  //
  // LES THÈMES vivent chacun dans son fichier, packages/tools/web/musique/<clé>.js
  // (les noms qui commencent par « _ » ne sont pas chargés : le modèle). Un
  // fichier appelle `FusibleAudio.theme(clé, définition)` ; l'aperçu
  // (assemble.js), le banc (banc_son.js) et le juke-box (juke_box.js) les posent
  // juste après ce fichier, par ordre alphabétique, chacun dans son filet (une
  // erreur dans un fichier n'emporte que son thème). La partition d'ensemble, les
  // vingt thèmes et le guide du compositeur : docs/design/bande_originale.md.
  //
  // L'ÉCRITURE. Une case par double croche, seize par mesure, séparées par des
  // espaces. Une note (C5, F#4, Bb3) attaque ; « - » la tient ; « . » se tait.
  // « ~ » devant une note la fait glisser depuis la précédente ; « ! » après
  // l'accentue (plus fort, le filtre plus ouvert). La basse, l'arpège et les
  // accords se jouent sur la grille de la section (« Am », « Fm », « F/E » ;
  // « Dm E » : deux accords dans la mesure) avec des degrés : R (la basse de
  // l'accord), 1, 3, 5, 7, 8 (l'octave), 9 ; X (tout l'accord). La batterie :
  // k grosse caisse, K la lourde, s caisse claire, S la caisse « gated », h
  // charleston fermé, o ouvert, c clap, r cerclage, t tom, T tom basse, x
  // cymbale, m le métal, i le tic, z la montée (un souffle qui enfle pendant
  // une demi-mesure : à poser sur la neuvième case), b le boum — combinables
  // (« kS »). Une voix porte une mesure (répétée) ou une liste de mesures (qui
  // tourne).
  //
  // LES VOIX. `inst` (l'instrument), `vol`, `oct` (l'octave des degrés),
  // `pan`, `echo` (la part envoyée à l'écho), `pompe` (la voix respire avec la
  // grosse caisse), `drive` (saturée), `filtre` (un passe-bas sur la voix, que
  // la clé `ouvre` d'une section balaie : `ouvre: { basse: [150, 2400] }`),
  // `faux` (la boîte à musique désaccordée, en cents), `epoque` (le timbre suit
  // la décennie — `setYear` le dit au moteur). `harmo` (dans une section) : la
  // voix du même nom double la mélodie en dessous, sur une note de l'accord.
  // Depuis la palette de la cassette (2026), aussi :
  //   `rev`      la part envoyée à la salle du thème (0 à 1 ; 0,15 à 0,45)
  //   `flotte`   le flottement de la bande : { prof, vit } — la hauteur ondule de
  //              ±prof cents à vit Hz (deux lenteurs mêlées, jamais pareilles) ;
  //              un nombre seul vaut `prof` (vit 0,55). La voix passe par un
  //              retard qu'on étire : c'est la bande, pas la note, qui flotte
  //   `env`      l'enveloppe imposée à l'instrument : [attaque, chute, palier
  //              (0 à 1), relâche], en secondes
  //   `ton`      le filtre de l'instrument : [ouverture, palier, temps] (Hz, Hz, s)
  //   `duty`     la largeur du carré de `pulse` (0,5 : carré ; 0,125 : nasillard)
  //   `plancher` une note ('E1') : quand la basse d'un accord tomberait dessous, ses
  //              degrés (et `X`) montent d'une octave — une basse en `oct: 1` reste
  //              entre mi 1 et ré dièse 2, au lieu de descendre à do 1 (33 Hz)
  //              qu'aucun téléphone ne rend
  //   supersaw : `scies` (5 ou 7), `desaccord` (cents, défaut 18), `large` (0 à 1)
  //   reese :    `desaccord` (cents, défaut 9 : le battement), `chaleur` (1 à 3)
  //   vox :      `voyelle` ('a', 'o', 'ou', 'e', 'eu'), `vers` (la voyelle d'arrivée)
  // LA BATTERIE (la voix `batt`) : `vol`, et `drive` (le bus saturé), `filtre`
  // (un passe-bas sur tout le bus, que `ouvre: { batt: [...] }` balaie), `rev`
  // (les caisses claires, claps, toms et cerclages vers la salle), `porte` (la
  // caisse S dans une réverbération qu'on ferme net : la grosse caisse claire des
  // années quatre-vingt) et `tenue` (combien de temps la porte reste ouverte, 0,24 s).
  // LES INSTRUMENTS : pulse, pluck, tri, saw, cuivre, nappe, flute, contrebasse,
  // basse, acide, lead, pad, sub, saxo, cloche, epiano, choeur ; et ceux de la
  // cassette : supersaw (la grande scie, pour tenir), reese (deux scies qui
  // battent), stab (un accord plaqué), vox (une voix de synthèse, « aah »,
  // « ouh »), sqbasse (la basse carrée), pluck2 (le pincé en dents de scie).
  // Au thème : `bpm`, `gain` (le niveau), `swing`, `transpose` (demi-tons),
  // `ordre` (les sections) et `boucle` (le rang où la boucle reprend : ce qui
  // est avant est l'introduction, jouée une fois) ; `pompe` ({ prof, rel } : de
  // combien la grosse caisse creuse le reste, et en combien de temps il
  // revient), `echo` ({ pas, retour, coupe } : le retard en doubles croches, la
  // réinjection, le passe-bas du retour) ; et :
  //   `salle`    une vraie salle pour ce thème : { taille (0 à 1 : le pré-délai,
  //              les premiers murs), duree (s : la queue, −60 dB), ton (Hz : la
  //              clarté de la queue), piece (ce qui passe encore dans la petite
  //              pièce commune, 0 par défaut) }. Sans `salle`, tout le thème passe
  //              dans la petite pièce, comme avant
  //   `cassette` la bande fatiguée : { sature (0 à 2 : la saturation douce du
  //              mélange), coupe (Hz : les aigus arrondis), bas (Hz : le grave
  //              inutile coupé, 30 à 40), souffle (le niveau du souffle, 0,002 à
  //              0,01), flotte (comme une voix : tout le mélange flotte, batterie
  //              comprise) }. Absente : rien ne change
  //   `titre`, `moment`, `humeur`, `tonalite` (ce que montre le juke-box) et
  //   `ville: true` (un thème de ville : sa boucle doit durer quatre minutes).

  var PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function midiDe(n) {
    var m = /^([A-G])(#|b)?(\d)$/.exec(n);
    if (!m) return null;
    return 12 * (+m[3] + 1) + PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  }
  function hzDe(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  var QUALITES = {
    '': [0, 4, 7], m: [0, 3, 7], '7': [0, 4, 7, 10], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10],
    dim: [0, 3, 6], sus4: [0, 5, 7], m7b5: [0, 3, 6, 10], '6': [0, 4, 7, 9]
  };
  var CACHE_ACCORDS = {};
  function accordDe(sym) {
    if (CACHE_ACCORDS[sym]) return CACHE_ACCORDS[sym];
    var m = /^([A-G])(#|b)?(maj7|m7b5|m7|sus4|dim|m|7|6)?(?:\/([A-G])(#|b)?)?$/.exec(sym);
    if (!m) throw new Error('accord illisible : ' + sym);
    var pc = (PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
    var basse = m[4] ? (PC[m[4]] + (m[5] === '#' ? 1 : m[5] === 'b' ? -1 : 0) + 12) % 12 : pc;
    return (CACHE_ACCORDS[sym] = { pc: pc, iv: QUALITES[m[3] || ''], basse: basse });
  }
  // `plancher` (un numéro MIDI) : si la basse de l'accord tomberait dessous, tout le cadre monte
  // d'une octave (le motif « R 8 » reste une octave, juste plus haut)
  function degreMidi(acc, d, oct, plancher) {
    var base = 12 * (oct + 1), iv = acc.iv;
    if (plancher != null) while (base + acc.basse < plancher) base += 12;
    switch (d) {
      case 'R': return base + acc.basse;
      case '1': return base + acc.pc;
      case '3': return base + acc.pc + iv[1];
      case '5': return base + acc.pc + iv[2];
      case '7': return base + acc.pc + (iv[3] != null ? iv[3] : 12);
      case '8': return base + acc.pc + 12;
      case '9': return base + acc.pc + iv[1] + 12;
    }
    return null;
  }
  // la voix d'harmonie : la plus haute note de l'accord au moins une tierce
  // mineure sous la mélodie — elle ne fait jamais de fausse note contre la grille
  function harmonieSous(m, acc) {
    for (var k = 3; k < 15; k++) {
      if (acc.iv.indexOf((((m - k - acc.pc) % 12) + 12) % 12) >= 0) return m - k;
    }
    return m - 12;
  }

  var SILENCE = '. . . . . . . . . . . . . . . .';

  // ── le registre : les thèmes s'y inscrivent depuis leur fichier
  //    (musique/<clé>.js), par `FusibleAudio.theme(clé, définition)`. Ce qui ne
  //    s'inscrit pas, ou ne se compile pas, va dans ERREURS : un thème cassé se
  //    tait, il n'emporte ni la page ni les autres thèmes.
  var MUSIQUE = {};
  var ERREURS = [];
  function signaler(ou, e) {
    var m = String(e && e.message ? e.message : e);
    for (var i = 0; i < ERREURS.length; i++) if (ERREURS[i].ou === ou && ERREURS[i].message === m) return;
    ERREURS.push({ ou: ou, message: m });
    if (ERREURS.length > 40) ERREURS.shift();
    if (global.console && global.console.error) global.console.error('FusibleAudio — ' + ou + ' : ' + m);
  }
  function enregistrer(cle, def) {
    try {
      if (typeof cle !== 'string' || !/^[a-z][a-z0-9_]*$/.test(cle)) throw new Error('clé illisible (des minuscules, des chiffres, « _ »)');
      if (!def || typeof def !== 'object') throw new Error('la définition doit être un objet');
      if (!(def.bpm > 0)) throw new Error('bpm manquant');
      if (!def.voix || typeof def.voix !== 'object') throw new Error('voix manquantes');
      if (!def.sections || typeof def.sections !== 'object') throw new Error('sections manquantes');
      if (!Array.isArray(def.ordre) || !def.ordre.length) throw new Error('ordre manquant');
      def.ordre.forEach(function (sn) { if (!def.sections[sn]) throw new Error('ordre : section inconnue « ' + sn + ' »'); });
      var b = def.boucle || 0;
      if (b < 0 || b >= def.ordre.length || b !== Math.floor(b)) throw new Error('boucle : ' + b + ' hors de l\'ordre');
      if (MUSIQUE[cle]) throw new Error('déjà enregistré (deux fichiers pour la même clé ?)');
      MUSIQUE[cle] = def;
      delete COMPILES[cle];
      return true;
    } catch (e) {
      signaler('thème ' + cle, e);
      return false;
    }
  }

  // Les courtes phrases jouées une fois : le départ d'une histoire (un boum,
  // une cymbale, la mèche qui monte en la mineur).
  var JINGLES = {
    depart: {
      bpm: 150, inst: 'lead', vol: 0.1, frappe: 0.5,
      notes: [['A3', 0, 1], ['E4', 1, 1], ['A4', 2, 1], ['C5', 3, 1], ['E5', 4, 8], ['A1', 4, 8, 'basse', 0.16]],
      frappes: [['K', 0], ['K', 4], ['b', 4], ['x', 4]]
    }
  };

  // ── la partition compilée : pour chaque section, les attaques de chaque
  //    double croche, déjà résolues en hauteurs (une fois, au premier usage).
  var COMPILES = {};
  function grille(barre, ou) {
    var t = String(barre).trim().split(/\s+/);
    if (t.length !== 16) throw new Error(ou + ' : ' + t.length + ' cases au lieu de 16 « ' + barre + ' »');
    return t;
  }
  function mesures(v, n) {
    if (v == null) return null;
    var l = Array.isArray(v) ? v : [v];
    var out = [];
    for (var i = 0; i < n; i++) out.push(l[i % l.length]);
    return out;
  }
  function compilerTheme(nom) {
    if (COMPILES[nom]) return COMPILES[nom];
    var th = MUSIQUE[nom];
    if (!th) throw new Error('thème inconnu « ' + nom + ' »');
    Object.keys(th.voix).forEach(function (vn) {
      var v = th.voix[vn];
      if (!v || typeof v !== 'object') throw new Error(nom + '.voix.' + vn + ' : une voix est un objet');
      if (!(v.vol >= 0)) throw new Error(nom + '.voix.' + vn + ' : `vol` manquant');
      if (vn !== 'batt' && !INSTRUMENTS[v.inst] && !A_PART[v.inst]) throw new Error(nom + '.voix.' + vn + ' : instrument inconnu « ' + v.inst + ' »');
    });
    var sections = {};
    Object.keys(th.sections).forEach(function (sn) {
      var sec = th.sections[sn], base = sec;
      if (sec.copie) {
        // `copie: 'A'` (une section du thème) ; `copie: 'autre.A'` (d'un autre
        // thème : à éviter, chaque compositeur tient son fichier)
        var p = sec.copie.split('.');
        base = p.length > 1 ? (MUSIQUE[p[0]] && MUSIQUE[p[0]].sections[p[1]]) : th.sections[sec.copie];
        if (!base) throw new Error(nom + '.' + sn + ' : copie d\'une section inconnue « ' + sec.copie + ' »');
        var fus = {};
        Object.keys(base).forEach(function (k) { fus[k] = base[k]; });
        Object.keys(sec).forEach(function (k) { if (k !== 'copie') fus[k] = sec[k]; });
        sec = fus;
      }
      var accords = sec.accords || [];
      var nb = accords.length, pas = nb * 16, parPas = [];
      for (var i = 0; i < pas; i++) parPas.push([]);
      // l'accord sous chaque double croche (« F G » : deux dans la mesure)
      var sous = [];
      accords.forEach(function (a) {
        var l = a.split(/\s+/), part = 16 / l.length;
        for (var k = 0; k < 16; k++) sous.push(accordDe(l[Math.floor(k / part)]));
      });
      if (sec.ouvre) Object.keys(sec.ouvre).forEach(function (vn) {
        if (!th.voix[vn] || !th.voix[vn].filtre) throw new Error(nom + '.' + sn + ' : « ouvre » vise ' + vn + ', une voix sans filtre');
      });
      var tr = th.transpose || 0;
      Object.keys(th.voix).forEach(function (vn) {
        var voix = th.voix[vn];
        var plancher = voix.plancher ? midiDe(voix.plancher) : null;
        if (voix.plancher && plancher == null) throw new Error(nom + '.voix.' + vn + ' : plancher illisible « ' + voix.plancher + ' »');
        var src = vn === 'harmo' ? (sec.harmo ? sec.lead : null) : sec[vn];
        var bars = mesures(src, nb);
        if (!bars) return;
        var cases = [];
        bars.forEach(function (b, bi) { cases = cases.concat(grille(b, nom + '.' + sn + '.' + vn + ' m' + (bi + 1))); });
        if (vn === 'batt') {
          cases.forEach(function (c, i) {
            if (c === '.' || c === '-') return;
            if (!/^[kKsShocrtTxmizb]+$/.test(c)) throw new Error(nom + '.' + sn + '.batt : frappe illisible « ' + c + ' »');
            parPas[i].push({ v: vn, frappe: c });
          });
          return;
        }
        var prec = null;
        for (var i = 0; i < cases.length; i++) {
          var c = cases[i];
          if (c === '.' || c === '-') continue;
          var len = 1;
          while (i + len < cases.length && cases[i + len] === '-') len++;
          var mt = /^(~?)(.+?)(!?)$/.exec(c), corps = mt[2];
          var hauteurs = [];
          if (corps === 'X') {
            var a = sous[i], o = voix.oct || 4, bx = 12 * (o + 1);
            if (plancher != null) while (bx + a.pc < plancher) bx += 12;
            a.iv.forEach(function (iv) { hauteurs.push(bx + a.pc + iv + tr); });
          } else if (/^[R135789]$/.test(corps)) {
            var m = degreMidi(sous[i], corps, voix.oct || 3, plancher);
            if (m != null) hauteurs.push(m + tr);
          } else {
            var mm = midiDe(corps);
            if (mm == null) throw new Error(nom + '.' + sn + '.' + vn + ' : note illisible « ' + c + ' »');
            if (vn === 'harmo') mm = harmonieSous(mm, sous[i]);
            hauteurs.push(mm + tr);
          }
          parPas[i].push({ v: vn, h: hauteurs, len: len, acc: mt[3] === '!', de: mt[1] === '~' ? prec : null });
          prec = hauteurs[hauteurs.length - 1];
        }
      });
      sections[sn] = { pas: pas, parPas: parPas, ouvre: sec.ouvre || null, sous: sous };
    });
    th.ordre.forEach(function (sn) {
      if (!sections[sn].pas) throw new Error(nom + '.' + sn + ' : sans accords, la section n\'a pas de longueur (un accord par mesure)');
    });
    return (COMPILES[nom] = { th: th, sections: sections, ordre: th.ordre, boucle: th.boucle || 0, pas: 60 / th.bpm / 4 });
  }

  // ── la forme d'un thème : l'introduction (jouée une fois), le corps de la
  //    boucle, et sa période — la plus courte durée au bout de laquelle la
  //    musique se redit À L'IDENTIQUE (les notes, la batterie, les balayages
  //    de filtre, case par case). Un corps « A B A B » a la période de « A B ».
  function signatureCase(sec, p) {
    var evs = sec.parPas[p], s = p === 0 && sec.ouvre ? JSON.stringify(sec.ouvre) : '';
    for (var i = 0; i < evs.length; i++) {
      var e = evs[i];
      s += '|' + e.v + ':' + (e.frappe || (e.h.join(',') + '/' + e.len + (e.acc ? '!' : '') + (e.de != null ? '~' + e.de : '')));
    }
    return s;
  }
  function structureDe(nom) {
    var C = compilerTheme(nom), th = C.th, mesure = C.pas * 16;
    var sections = C.ordre.map(function (sn, i) {
      var m = C.sections[sn].pas / 16;
      return { nom: sn, index: i, mesures: m, secondes: m * mesure, boucle: i >= C.boucle };
    });
    var intro = 0, corps = 0;
    sections.forEach(function (s) { if (s.boucle) corps += s.mesures; else intro += s.mesures; });
    var sig = [];
    for (var j = C.boucle; j < C.ordre.length; j++) {
      var sec = C.sections[C.ordre[j]];
      for (var p = 0; p < sec.pas; p++) sig.push(signatureCase(sec, p));
    }
    var N = sig.length, periode = N;
    for (var d = 16; d < N; d += 16) {
      if (N % d) continue;
      var ok = true;
      for (var k = 0; k < N && ok; k++) if (sig[k] !== sig[(k + d) % N]) ok = false;
      if (ok) { periode = d; break; }
    }
    return {
      cle: nom, bpm: th.bpm, pas: C.pas, mesure: mesure, ordre: C.ordre.slice(), boucle: C.boucle,
      sections: sections,
      intro: { mesures: intro, secondes: intro * mesure },
      corps: { mesures: corps, secondes: corps * mesure },
      periode: { mesures: periode / 16, secondes: periode / 16 * mesure },
      // le moment où l'on entend pour la première fois quelque chose déjà joué
      redite: (intro + periode / 16) * mesure
    };
  }

  // ── les voix ──
  var ONDES = new WeakMap();
  function onde(ctx, duty) {
    var c = ONDES.get(ctx);
    if (!c) { c = {}; ONDES.set(ctx, c); }
    var k = String(duty);
    if (c[k]) return c[k];
    var n = 48, re = new Float32Array(n), im = new Float32Array(n);
    for (var i = 1; i < n; i++) re[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * duty);
    return (c[k] = ctx.createPeriodicWave(re, im));
  }
  // une enveloppe : attaque, chute vers le palier, relâche ; rend l'heure du silence
  function env(param, t, a, d, sus, r, dur, peak) {
    var p = Math.max(peak, 0.0002);
    param.setValueAtTime(0.0001, t);
    param.linearRampToValueAtTime(p, t + a);
    if (sus < 1) param.setTargetAtTime(Math.max(p * sus, 0.0001), t + a, Math.max(d, 0.005) / 3);
    var off = t + Math.max(dur, a + 0.01);
    param.setTargetAtTime(0.0001, off, Math.max(r, 0.005) / 3);
    return off + r * 2 + 0.03;
  }
  // `filtre` : [ouverture à l'attaque, palier], `fenv` le temps qu'il met à se
  // refermer ; `detune` : un écart (deux oscillateurs) ou la liste des écarts ;
  // `sub` : un sinus à la même hauteur, pour le poids ; `vib` : la profondeur
  // du vibrato (il ne vient que sur les notes tenues) ; `niveau` : ce qui
  // remet l'instrument à la hauteur des autres (à `vol` égal, la même force).
  // Une voix peut changer l'enveloppe (`env: [a, d, s, r]`) et le filtre de
  // l'instrument (`ton: [ouverture, palier, temps]`).
  // Le coût, en oscillateurs par note (à compter dans les parties rapides) :
  // pulse, pluck, tri, sub, acide 1 ; flute, contrebasse 1 ; saw, cuivre,
  // nappe, lead, saxo, pluck2, stab 2 (+1 pour le vibrato) ; sqbasse 2 ;
  // basse 3 ; reese 3 ; cloche 3 ; epiano 2 ; pad 4 ; vox 4 ; choeur 5 ;
  // supersaw 5 ou 7.
  var INSTRUMENTS = {
    pulse:       { osc: 'pulse', a: 0.004, d: 0.1, s: 0.72, r: 0.05, vib: 1 },
    pluck:       { osc: 'pulse', duty: 0.5, a: 0.003, d: 0.22, s: 0.05, r: 0.07, filtre: [3400, 900] },
    tri:         { osc: 'triangle', a: 0.003, d: 0.08, s: 0.9, r: 0.03 },
    saw:         { osc: 'sawtooth', a: 0.008, d: 0.18, s: 0.6, r: 0.08, filtre: [3000, 1500], detune: 7, vib: 1 },
    cuivre:      { osc: 'sawtooth', a: 0.02, d: 0.14, s: 0.45, r: 0.07, filtre: [2600, 900], detune: 6 },
    nappe:       { osc: 'sawtooth', a: 0.35, d: 0.6, s: 0.85, r: 0.7, filtre: [1100, 900], detune: 10 },
    flute:       { osc: 'triangle', a: 0.05, d: 0.2, s: 0.85, r: 0.12, vib: 1 },
    contrebasse: { osc: 'triangle', a: 0.004, d: 0.5, s: 0.22, r: 0.12 },
    // la palette noire
    basse:       { osc: 'sawtooth', a: 0.003, d: 0.15, s: 0.55, r: 0.05, filtre: [1500, 460], q: 2.2, fenv: 0.05, detune: 7, sub: 0.3 },
    acide:       { osc: 'sawtooth', a: 0.002, d: 0.13, s: 0.25, r: 0.04, filtre: [2200, 260], q: 11, fenv: 0.045 },
    lead:        { osc: 'sawtooth', a: 0.008, d: 0.3, s: 0.72, r: 0.14, filtre: [4200, 2600], q: 1.2, fenv: 0.2, detune: 6, vib: 1 },
    pad:         { osc: 'sawtooth', a: 0.4, d: 0.9, s: 0.85, r: 0.9, filtre: [1500, 1100], fenv: 0.5, detune: [-15, -6, 6, 15] },
    sub:         { osc: 'sine', a: 0.008, d: 0.2, s: 0.92, r: 0.08 },
    saxo:        { osc: 'sawtooth', a: 0.035, d: 0.3, s: 0.78, r: 0.16, filtre: [2000, 1100], q: 2.5, fenv: 0.18, detune: 3, vib: 1.4 },
    // la palette de la cassette (2026) : un accord plaqué qui se ferme vite, la
    // basse carrée des années quatre-vingt, un pincé en dents de scie
    stab:        { osc: 'sawtooth', a: 0.002, d: 0.17, s: 0.12, r: 0.09, filtre: [6500, 450], q: 3.2, fenv: 0.045, detune: 9, niveau: 2.2 },
    sqbasse:     { osc: 'square', a: 0.002, d: 0.12, s: 0.55, r: 0.045, filtre: [2100, 560], q: 2.4, fenv: 0.05, detune: [-4, 4], sub: 0.45, niveau: 0.6 },
    pluck2:      { osc: 'sawtooth', a: 0.002, d: 0.2, s: 0.04, r: 0.08, filtre: [5200, 650], q: 2.2, fenv: 0.06, detune: 5, niveau: 2 }
  };
  // les instruments joués à part (plus bas, dans jouerNote) : cloche, epiano,
  // choeur, et la palette de la cassette — supersaw, reese, vox
  var A_PART = { cloche: 1, epiano: 1, choeur: 1, supersaw: 1, reese: 1, vox: 1 };
  // les voyelles de `vox` : les deux premiers formants (Hz)
  var VOYELLES = { a: [760, 1180], o: [520, 880], ou: [340, 760], e: [470, 1650], eu: [440, 1250] };
  // le timbre de l'époque, pour les voix `epoque` : un carré d'avant l'an 2000,
  // une scie ensuite, et à partir de 2013 un saxophone de synthèse, plus sourd
  function timbreEpoque(inst, year) {
    if (inst === 'lead') return year < 1998 ? 'pulse' : year < 2013 ? 'lead' : 'saxo';
    if (inst === 'pulse') return year < 1998 ? 'pulse' : year < 2013 ? 'saw' : 'flute';
    if (inst === 'pluck') return year < 1998 ? 'pluck' : year < 2013 ? 'epiano' : 'cloche';
    if (inst === 'flute') return year < 1998 ? 'flute' : year < 2013 ? 'saw' : 'epiano';
    return inst;
  }
  // la saturation : une tangente hyperbolique, normalisée (la crête reste à 1)
  var COURBES = {};
  function courbeDrive(k) {
    if (COURBES[k]) return COURBES[k];
    var n = 2048, c = new Float32Array(n), norme = Math.tanh(k);
    for (var i = 0; i < n; i++) { var x = i * 2 / (n - 1) - 1; c[i] = Math.tanh(k * x) / norme; }
    return (COURBES[k] = c);
  }
  // la saturation douce de la cassette : sans gain aux petits niveaux (la pente
  // vaut 1), elle arrondit seulement les crêtes — tanh(k·x)/k. La courbe couvre
  // ±DOUCE (le mélange y entre divisé d'autant) : au-delà de ±1, un façonneur
  // écrêterait net au lieu d'arrondir.
  var DOUCE = 4;
  function courbeDouce(k) {
    var cle = 'douce:' + k;
    if (COURBES[cle]) return COURBES[cle];
    var n = 4096, c = new Float32Array(n);
    for (var i = 0; i < n; i++) { var x = DOUCE * (i * 2 / (n - 1) - 1); c[i] = Math.tanh(k * x) / k; }
    return (COURBES[cle] = c);
  }
  function panner(ctx, out, pan) {
    if (!pan || !ctx.createStereoPanner) return out;
    var p = ctx.createStereoPanner();
    p.pan.value = clamp(pan, -1, 1);
    p.connect(out);
    return p;
  }
  // une note : `ex.acc` l'accentue, `ex.de` (Hz) la fait glisser depuis là
  function jouerNote(ctx, out, nom, t, dur, f, vol, voix, ex) {
    ex = ex || {};
    var g = gain(ctx, 0.0001);
    g.connect(out);
    var fin, oscs = [];
    if (ex.acc) vol *= 1.35;
    if (nom === 'cloche') {
      // la boîte à musique : trois sinus inharmoniques qui s'éteignent chacun à
      // leur rythme ; `faux` la désaccorde (un écart par note, et un ressort
      // fatigué qui fait onduler la hauteur)
      var lg = null, lfo = null, tenue = Math.min(dur, 1);
      if (voix.faux) {
        lfo = ctx.createOscillator(); lfo.frequency.value = 0.85;
        lg = gain(ctx, voix.faux * 0.5);
        lfo.connect(lg);
        lfo.start(t); lfo.stop(t + 1.6 + tenue);
      }
      var ecart = voix.faux ? (((t * 7919.31) % 1) - 0.5) * voix.faux : 0;
      [[1, 1, 1.5], [2.76, 0.32, 0.6], [5.4, 0.13, 0.25]].forEach(function (p) {
        var o = ctx.createOscillator(), og = gain(ctx, 0.0001);
        o.type = 'sine'; o.frequency.value = f * p[0]; o.detune.value = ecart;
        if (lg) lg.connect(o.detune);
        og.gain.setValueAtTime(0.0001, t);
        og.gain.linearRampToValueAtTime(vol * p[1], t + 0.003);
        og.gain.exponentialRampToValueAtTime(0.0001, t + p[2] + tenue);
        o.connect(og).connect(out);
        o.start(t); o.stop(t + p[2] + tenue + 0.05);
      });
      return;
    }
    if (nom === 'epiano') {
      // le piano électrique : une modulation de fréquence qui s'adoucit
      var c = ctx.createOscillator(), mo = ctx.createOscillator(), mg = gain(ctx, 0);
      c.type = 'sine'; mo.type = 'sine';
      c.frequency.value = f; mo.frequency.value = f;
      mg.gain.setValueAtTime(f * 2.2, t);
      mg.gain.exponentialRampToValueAtTime(f * 0.35, t + 0.5);
      mo.connect(mg).connect(c.frequency);
      c.connect(g);
      fin = env(g.gain, t, 0.004, 0.9, 0.32, 0.3, dur, vol);
      c.start(t); mo.start(t); c.stop(fin); mo.stop(fin);
      return;
    }
    if (nom === 'choeur') {
      // la tribune qui chante : des scies désaccordées dans deux formants de « o »
      var f1 = ctx.createBiquadFilter(), f2 = ctx.createBiquadFilter(), lp = ctx.createBiquadFilter();
      f1.type = 'bandpass'; f1.frequency.value = 620; f1.Q.value = 4.5;
      f2.type = 'bandpass'; f2.frequency.value = 1050; f2.Q.value = 5.5;
      lp.type = 'lowpass'; lp.frequency.value = 3200;
      var mix = gain(ctx, 1);
      mix.connect(f1); mix.connect(f2);
      f1.connect(lp); f2.connect(lp); lp.connect(g);
      [[1, 0], [1, 9], [1, -9], [0.5, 4]].forEach(function (p, i) {
        var o = ctx.createOscillator(), og = gain(ctx, i === 3 ? 0.45 : 1);
        o.type = 'sawtooth'; o.frequency.value = f * p[0]; o.detune.value = p[1];
        o.connect(og).connect(mix);
        oscs.push(o);
      });
      var vlfo = ctx.createOscillator(), vlg = gain(ctx, 0);
      vlfo.frequency.value = 5.1;
      vlg.gain.setValueAtTime(0, t);
      vlg.gain.linearRampToValueAtTime(f * 0.008, t + 0.35);
      vlfo.connect(vlg);
      oscs.forEach(function (o) { vlg.connect(o.frequency); });
      fin = env(g.gain, t, 0.09, 0.3, 0.9, 0.28, dur, vol * 2.4);
      oscs.forEach(function (o) { o.start(t); o.stop(fin); });
      vlfo.start(t); vlfo.stop(fin);
      return;
    }
    // l'enveloppe et le filtre que la voix impose (`env`, `ton`), sinon ceux de l'instrument
    var ve = voix.env || [];
    if (nom === 'supersaw') {
      // LA GRANDE SCIE : cinq ou sept scies désaccordées (`desaccord`, en cents,
      // pour la plus écartée), posées de gauche à droite (`large`, 0 à 1),
      // chacune partie un rien après l'autre (les phases s'écartent : pas de
      // claquement à l'attaque). Pour les accords tenus et les leads larges : à
      // éviter en doubles croches (sept oscillateurs par note).
      var nS = voix.scies === 5 ? 5 : 7;
      var forme = nS === 5 ? [-1, -0.46, 0, 0.47, 0.98] : [-1, -0.63, -0.29, 0, 0.31, 0.61, 0.97];
      var cale = [0, 0.0013, 0.0029, 0, 0.0021, 0.0035, 0.0009];
      var desac = voix.desaccord == null ? 18 : voix.desaccord;
      var large = voix.large == null ? 0.7 : clamp(voix.large, 0, 1);
      var tonS = voix.ton || [6500, 3800, 0.4];
      var fS = ctx.createBiquadFilter();
      fS.type = 'lowpass'; fS.Q.value = ex.acc ? 2.5 : 0.6;
      fS.frequency.setValueAtTime(tonS[0] * (ex.acc ? 1.5 : 1), t);
      // une rampe qui finit (trois constantes de temps) : passé le balayage, le filtre ne coûte plus rien
      fS.frequency.exponentialRampToValueAtTime(Math.max(tonS[1], 20), t + 0.01 + 3 * (tonS[2] || 0.4));
      fS.connect(g);
      var cotes = [panner(ctx, fS, -large), fS, panner(ctx, fS, large)];
      for (var si = 0; si < nS; si++) {
        var os = ctx.createOscillator();
        os.type = 'sawtooth'; os.detune.value = forme[si] * desac;
        os.connect(cotes[forme[si] < -0.1 ? 0 : forme[si] > 0.1 ? 2 : 1]);
        oscs.push(os);
      }
      oscs.forEach(function (o) {
        if (ex.de) { o.frequency.setValueAtTime(ex.de, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.07); }
        else o.frequency.value = f;
      });
      fin = env(g.gain, t, ve[0] != null ? ve[0] : 0.012, ve[1] != null ? ve[1] : 0.5, ve[2] != null ? ve[2] : 0.82,
        ve[3] != null ? ve[3] : 0.35, dur, vol * 0.71 / Math.sqrt(nS));
      oscs.forEach(function (o, i) { o.start(t + cale[i % cale.length]); o.stop(fin); });
      return;
    }
    if (nom === 'reese') {
      // LA REESE : deux scies qui battent lentement l'une contre l'autre
      // (±`desaccord` cents : le battement s'entend comme un tangage),
      // saturées (`chaleur`), sous un passe-bas qui se referme ; un sinus dessous.
      var dR = voix.desaccord == null ? 9 : voix.desaccord;
      var tonR = voix.ton || [1500, 520, 0.25];
      var preR = gain(ctx, 0.5);
      var wsR = ctx.createWaveShaper();
      wsR.curve = courbeDrive(voix.chaleur == null ? 1.6 : voix.chaleur); wsR.oversample = '2x';
      var fR = ctx.createBiquadFilter();
      fR.type = 'lowpass'; fR.Q.value = ex.acc ? 4 : 1.3;
      fR.frequency.setValueAtTime(tonR[0] * (ex.acc ? 1.6 : 1), t);
      fR.frequency.exponentialRampToValueAtTime(Math.max(tonR[1], 20), t + 0.005 + 3 * (tonR[2] || 0.25));
      preR.connect(wsR).connect(fR).connect(g);
      [-dR, dR].forEach(function (dt) {
        var o = ctx.createOscillator();
        o.type = 'sawtooth'; o.detune.value = dt;
        o.connect(preR); oscs.push(o);
      });
      var soR = ctx.createOscillator();
      soR.type = 'sine'; soR.connect(gain(ctx, 0.5)).connect(g);
      oscs.push(soR);
      oscs.forEach(function (o) {
        if (ex.de) { o.frequency.setValueAtTime(ex.de, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.09); }
        else o.frequency.value = f;
      });
      fin = env(g.gain, t, ve[0] != null ? ve[0] : 0.006, ve[1] != null ? ve[1] : 0.3, ve[2] != null ? ve[2] : 0.85,
        ve[3] != null ? ve[3] : 0.12, dur, vol * 0.82);
      oscs.forEach(function (o) { o.start(t); o.stop(fin); });
      return;
    }
    if (nom === 'vox') {
      // LA VOIX : le chœur de la tribune, adouci — deux scies et un triangle dans
      // deux formants larges (`voyelle` : a, o, ou, e, eu ; `vers` : la voyelle
      // où elle glisse pendant la note), un peu de corps sous les formants,
      // une attaque lente, un vibrato qui vient tard.
      var v0 = VOYELLES[voix.voyelle] || VOYELLES.a, v1 = VOYELLES[voix.vers] || null;
      var fv1 = ctx.createBiquadFilter(), fv2 = ctx.createBiquadFilter(), corps = ctx.createBiquadFilter(), lpv = ctx.createBiquadFilter();
      fv1.type = 'bandpass'; fv1.Q.value = 2.6; fv1.frequency.setValueAtTime(v0[0], t);
      fv2.type = 'bandpass'; fv2.Q.value = 3.4; fv2.frequency.setValueAtTime(v0[1], t);
      if (v1) {
        fv1.frequency.linearRampToValueAtTime(v1[0], t + Math.max(dur, 0.2));
        fv2.frequency.linearRampToValueAtTime(v1[1], t + Math.max(dur, 0.2));
      }
      corps.type = 'lowpass'; corps.frequency.value = Math.max(f * 2.5, 300); corps.Q.value = 0.5;
      lpv.type = 'lowpass'; lpv.frequency.value = 2800; lpv.Q.value = 0.5;
      var mixv = gain(ctx, 1);
      mixv.connect(fv1); mixv.connect(fv2);
      mixv.connect(corps).connect(gain(ctx, 0.35)).connect(lpv);
      fv1.connect(lpv); fv2.connect(gain(ctx, 0.7)).connect(lpv);
      lpv.connect(g);
      [['sawtooth', 0, 1], ['sawtooth', 7, 0.8], ['triangle', -5, 1.2]].forEach(function (p) {
        var o = ctx.createOscillator();
        o.type = p[0]; o.detune.value = p[1];
        o.connect(gain(ctx, p[2])).connect(mixv);
        oscs.push(o);
      });
      oscs.forEach(function (o) { o.frequency.value = f; });
      var vbv = ctx.createOscillator(), vbg = gain(ctx, 0);
      vbv.frequency.value = 4.7;
      vbg.gain.setValueAtTime(0, t + 0.25);
      vbg.gain.linearRampToValueAtTime(f * 0.0045, t + 0.8);
      vbv.connect(vbg);
      oscs.forEach(function (o) { vbg.connect(o.frequency); });
      oscs.push(vbv);
      fin = env(g.gain, t, ve[0] != null ? ve[0] : 0.28, ve[1] != null ? ve[1] : 0.6, ve[2] != null ? ve[2] : 0.9,
        ve[3] != null ? ve[3] : 0.6, dur, vol * 0.36);
      oscs.forEach(function (o) { o.start(t); o.stop(fin); });
      return;
    }
    var def = INSTRUMENTS[nom] || INSTRUMENTS.pulse;
    var entree = g;
    var fdef = voix.ton || def.filtre;
    if (fdef) {
      var flt = ctx.createBiquadFilter();
      flt.type = 'lowpass'; flt.Q.value = (def.q || 1.2) + (ex.acc ? 4 : 0);
      flt.frequency.setValueAtTime(fdef[0] * (ex.acc ? 1.8 : 1), t);
      flt.frequency.setTargetAtTime(fdef[1], t + def.a, (voix.ton && voix.ton[2]) || def.fenv || 0.12);
      flt.connect(g);
      entree = flt;
    }
    var detunes = Array.isArray(def.detune) ? def.detune : def.detune ? [-def.detune, def.detune] : [0];
    detunes.forEach(function (dt) {
      var o = ctx.createOscillator();
      if (def.osc === 'pulse') o.setPeriodicWave(onde(ctx, voix.duty || def.duty || 0.5));
      else o.type = def.osc;
      o.detune.value = dt;
      var og = gain(ctx, 1 / detunes.length);
      o.connect(og).connect(entree);
      oscs.push(o);
    });
    if (def.sub) {
      var so = ctx.createOscillator();
      so.type = 'sine';
      so.connect(gain(ctx, def.sub)).connect(g);
      oscs.push(so);
    }
    oscs.forEach(function (o) {
      if (ex.de) { o.frequency.setValueAtTime(ex.de, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.07); }
      else o.frequency.value = f;
    });
    if (def.vib && dur > 0.28) {
      var v = ctx.createOscillator(), vg = gain(ctx, 0);
      v.frequency.value = 5.4;
      vg.gain.setValueAtTime(0, t + 0.12);
      vg.gain.linearRampToValueAtTime(f * 0.006 * def.vib, t + 0.32);
      v.connect(vg);
      oscs.forEach(function (o) { vg.connect(o.frequency); });
      oscs.push(v);
    }
    fin = env(g.gain, t, ve[0] != null ? ve[0] : def.a, ve[1] != null ? ve[1] : def.d, ve[2] != null ? ve[2] : def.s,
      ve[3] != null ? ve[3] : def.r, dur, vol * (def.niveau || 1));
    oscs.forEach(function (o) { o.start(t); o.stop(fin); });
  }
  // un souffle tenu puis coupé net : la caisse claire « gated » des années
  // quatre-vingt (la réverbération qu'on ferme d'un coup)
  function porte(ctx, out, t, o) {
    var s = src(ctx, t, false, 1);
    var f = ctx.createBiquadFilter();
    f.type = o.type || 'bandpass'; f.frequency.value = o.f; f.Q.value = o.q || 0.7;
    var g = gain(ctx, 0.0001);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(o.peak, t + 0.002);
    g.gain.exponentialRampToValueAtTime(o.peak * 0.35, t + o.tenue);
    g.gain.linearRampToValueAtTime(0.0001, t + o.tenue + 0.02);
    s.connect(f).connect(g).connect(out);
    s.stop(t + o.tenue + 0.06);
  }
  function jouerFrappe(ctx, out, k, t, vol, pas) {
    switch (k) {
      case 'k':
        tone(ctx, out, t, { type: 'sine', f: 150, f2: 50, dur: 0.24, peak: 0.8 * vol });
        burst(ctx, out, t, { type: 'highpass', f: 3000, q: 0.7, dur: 0.012, peak: 0.12 * vol });
        break;
      case 'K':
        tone(ctx, out, t, { type: 'sine', f: 130, f2: 45, dur: 0.36, peak: 0.85 * vol });
        tone(ctx, out, t, { type: 'triangle', f: 280, f2: 75, dur: 0.06, peak: 0.35 * vol });
        burst(ctx, out, t, { type: 'highpass', f: 2600, q: 0.7, dur: 0.014, peak: 0.16 * vol });
        break;
      case 's':
        burst(ctx, out, t, { type: 'bandpass', f: 1900, q: 0.7, dur: 0.17, peak: 0.42 * vol });
        tone(ctx, out, t, { type: 'triangle', f: 190, f2: 160, dur: 0.09, peak: 0.3 * vol });
        break;
      case 'S':
        porte(ctx, out, t, { f: 1500, q: 0.55, tenue: 0.17, peak: 0.5 * vol });
        porte(ctx, out, t, { type: 'highpass', f: 5200, q: 0.7, tenue: 0.15, peak: 0.2 * vol });
        tone(ctx, out, t, { type: 'triangle', f: 210, f2: 150, dur: 0.11, peak: 0.42 * vol });
        break;
      case 'h':
        burst(ctx, out, t, { type: 'highpass', f: 7600, q: 0.8, dur: 0.035, peak: 0.16 * vol, pan: 0.25 });
        break;
      case 'o':
        burst(ctx, out, t, { type: 'highpass', f: 7000, q: 0.8, dur: 0.22, peak: 0.14 * vol, pan: 0.25 });
        break;
      case 'c':
        for (var i = 0; i < 3; i++) burst(ctx, out, t + i * 0.011, { type: 'bandpass', f: 1250, q: 1.1, dur: 0.012, peak: 0.32 * vol });
        burst(ctx, out, t + 0.03, { type: 'bandpass', f: 1150, q: 0.9, dur: 0.12, peak: 0.2 * vol });
        break;
      case 'r':
        tone(ctx, out, t, { type: 'triangle', f: 1700, dur: 0.025, peak: 0.16 * vol });
        burst(ctx, out, t, { type: 'highpass', f: 5000, q: 0.7, dur: 0.02, peak: 0.08 * vol });
        break;
      case 't':
        tone(ctx, out, t, { type: 'sine', f: 210, f2: 115, dur: 0.24, peak: 0.55 * vol });
        break;
      case 'T':
        tone(ctx, out, t, { type: 'sine', f: 120, f2: 64, dur: 0.38, peak: 0.75 * vol });
        burst(ctx, out, t, { type: 'lowpass', f: 1100, q: 0.7, dur: 0.05, peak: 0.16 * vol });
        break;
      case 'x':
        burst(ctx, out, t, { type: 'highpass', f: 5200, q: 0.6, dur: 1.3, peak: 0.13 * vol });
        burst(ctx, out, t, { type: 'bandpass', f: 8200, q: 1.5, dur: 0.6, peak: 0.07 * vol, pan: -0.2 });
        break;
      case 'm':
        // le métal : une barre qu'on frappe (quatre partiels qui ne s'accordent pas)
        [[540, 0.5], [833, 0.36], [1291, 0.26], [1966, 0.18]].forEach(function (p) {
          tone(ctx, out, t, { type: 'triangle', f: p[0], dur: 0.34, peak: p[1] * 0.22 * vol });
        });
        burst(ctx, out, t, { type: 'bandpass', f: 3200, q: 1.2, dur: 0.05, peak: 0.18 * vol });
        break;
      case 'i':
        // le tic : une mèche, une horloge
        tone(ctx, out, t, { type: 'square', f: 3600, dur: 0.006, peak: 0.05 * vol });
        burst(ctx, out, t, { type: 'highpass', f: 8000, q: 0.7, dur: 0.008, peak: 0.08 * vol });
        break;
      case 'z':
        // la montée : un souffle qui enfle pendant une demi-mesure, coupé net
        var dz = (pas || 0.125) * 8, sz = src(ctx, t, false, 1), fz = ctx.createBiquadFilter(), gz = gain(ctx, 0.0001);
        fz.type = 'bandpass'; fz.Q.value = 0.9;
        fz.frequency.setValueAtTime(500, t); fz.frequency.exponentialRampToValueAtTime(7000, t + dz);
        gz.gain.setValueAtTime(0.0001, t);
        gz.gain.exponentialRampToValueAtTime(0.22 * vol, t + dz);
        gz.gain.linearRampToValueAtTime(0.0001, t + dz + 0.03);
        sz.connect(fz).connect(gz).connect(out);
        sz.stop(t + dz + 0.08);
        break;
      case 'b':
        // le boum : ce qui tombe au fond de la pièce
        tone(ctx, out, t, { type: 'sine', f: 72, f2: 30, dur: 1.5, peak: 0.85 * vol });
        burst(ctx, out, t, { type: 'lowpass', f: 600, f2: 90, q: 0.7, dur: 1.0, peak: 0.22 * vol });
        break;
    }
  }

  // ============================================================== le moteur =
  // Il tourne sur n'importe quel BaseAudioContext : le direct (AudioContext)
  // et le banc d'essai (OfflineAudioContext) passent par le même code.

  function createEngine(ctx, dest, opt) {
    opt = opt || {};
    var seed = opt.seed == null ? (Date.now() & 0x7fffffff) : opt.seed;
    var rnd = mulberry(seed);
    // Hors ligne (banc d'essai), tout est écrit à l'avance : pas d'horloge, pas
    // de minuterie de ménage — rien qui dépende du temps réel.
    var offline = opt.offline === true ||
      (ctx.constructor && /Offline/.test(ctx.constructor.name || ''));

    var master = gain(ctx, opt.master == null ? 0.85 : opt.master);
    // Un limiteur doux en sortie : rien ne doit jamais saturer, même si trois
    // gestes tombent sur la même image.
    var comp = ctx.createDynamicsCompressor ? ctx.createDynamicsCompressor() : null;
    if (comp) {
      comp.threshold.value = -14; comp.knee.value = 12; comp.ratio.value = 6;
      comp.attack.value = 0.004; comp.release.value = 0.18;
      master.connect(comp).connect(dest);
    } else {
      master.connect(dest);
    }

    var ambBus = gain(ctx, 1);   // les lieux
    var padBus = gain(ctx, 1);   // la nappe
    var sfxBus = gain(ctx, 1);   // les gestes
    var musBus = gain(ctx, opt.musique == null ? 0.6 : opt.musique);   // la musique
    ambBus.connect(master); padBus.connect(master); sfxBus.connect(master); musBus.connect(master);
    // une petite salle pour la musique : ce qui la sort de la boîte
    var musWet = gain(ctx, 0.14);
    var musRev = ctx.createConvolver();
    musRev.normalize = true;
    musRev.buffer = impulse(ctx, 'musique', 1.5, 3.4, [[0.017, 0.35], [0.031, 0.25]]);
    musWet.connect(musRev).connect(musBus);

    var mode = 'tout';
    var tension = 0;
    var year = 1990;
    var wanted = null;    // le lieu demandé, même quand le mode le tait
    var slots = [];       // les lieux vivants (deux au plus pendant un fondu)
    var pad = null;
    var themes = [];      // les thèmes vivants (deux au plus pendant un fondu)
    var themeVoulu = null;
    var scheduled = 0;    // jusqu'où le séquenceur a déjà écrit
    // Sous un thème, le lieu n'a plus de lit et ses bruits jouent à ce niveau.
    var SOUS_MUSIQUE = 0.4;
    function sousMusique() { return themeVoulu != null; }
    function glisser(param, t, v, d) {
      param.cancelScheduledValues(t);
      param.setValueAtTime(param.value, t);
      param.linearRampToValueAtTime(v, t + d);
    }

    // ---- un lieu ----
    function makeSlot(name, at, fade) {
      var def = PLACES[name];
      if (!def) return null;
      var out = gain(ctx, fade > 0 ? 0.0001 : 1);
      var wet = gain(ctx, def.wet);
      var dry = gain(ctx, 1 - def.wet * 0.5);
      var conv = ctx.createConvolver();
      conv.normalize = true;
      conv.buffer = impulse(ctx, def.ir[0], def.ir[1], def.ir[2], def.ir[3]);
      var input = gain(ctx, 1);
      input.connect(dry).connect(out);
      input.connect(wet).connect(conv).connect(out);
      out.connect(ambBus);
      // le lit et les bruits ont chacun leur niveau ; sous un thème, le lit ne
      // tourne pas du tout et les bruits baissent (voir `musique`)
      var sous = sousMusique();
      var lit = gain(ctx, 1), bruits = gain(ctx, sous ? SOUS_MUSIQUE : 1);
      lit.connect(input); bruits.connect(input);
      var srcs = [];
      function allumer(t) {
        RECOLTE = [];
        srcs = (def.bed(ctx, lit, t, rnd) || []).concat(RECOLTE);
        RECOLTE = null;
      }
      function eteindre(t) {
        for (var i = 0; i < srcs.length; i++) { try { srcs[i].stop(t); } catch (e) {} }
        srcs = [];
      }
      if (!sous) allumer(at);
      if (fade > 0) {
        out.gain.setValueAtTime(0.0001, at);
        out.gain.linearRampToValueAtTime(1, at + fade);
      }
      var next = [];
      for (var i = 0; i < def.evs.length; i++) next.push(at + rnd() * def.evs[i][1] * 0.6);
      return {
        name: name, out: out, input: input, def: def, next: next, dead: 0,
        pump: function (t0, t1) {
          for (var i = 0; i < def.evs.length; i++) {
            var e = def.evs[i], guard = 0;
            while (next[i] < t1 && guard++ < 64) {
              if (next[i] >= t0 && (!sous || e[3])) e[2](ctx, bruits, next[i], rnd);
              next[i] += between(rnd, e[0], e[1]) * (sous ? 2 : 1);
            }
          }
        },
        // un thème commence ou s'arrête : le lit s'éteint ou revient
        musique: function (t, on) {
          if (on === sous) return;
          sous = on;
          glisser(bruits.gain, t, on ? SOUS_MUSIQUE : 1, 1.2);
          if (on) { glisser(lit.gain, t, 0.0001, 1.2); eteindre(t + 1.3); return; }
          eteindre(t);
          lit.gain.cancelScheduledValues(t);
          lit.gain.setValueAtTime(0.0001, t);
          lit.gain.linearRampToValueAtTime(1, t + 1.2);
          allumer(t);
        },
        stop: function (t, fade) {
          this.dead = t + fade + 0.2;
          out.gain.cancelScheduledValues(t);
          out.gain.setValueAtTime(out.gain.value, t);
          out.gain.linearRampToValueAtTime(0.0001, t + fade);
          eteindre(t + fade + 0.1);
        }
      };
    }

    // ---- la nappe ----
    function makePad(at, fade) {
      var d = decadeOf(year);
      var out = gain(ctx, 0.0001);
      var filt = ctx.createBiquadFilter();
      filt.type = 'lowpass'; filt.Q.value = d.q;
      filt.frequency.value = d.cut;
      RECOLTE = [];
      drift(ctx, filt.frequency, at, d.cut, d.cut * 0.4, d.rate);
      // Le LFO du filtre est posé UNE fois ; la tension déplace son centre, on
      // n'en empile jamais un second (sinon la profondeur double à chaque fois).
      filt.connect(out).connect(padBus);
      var root = 55 * Math.pow(2, ((seed % 5) - 2) / 12); // la tonalité d'une carrière
      var oscs = [];
      for (var i = 0; i < d.voices.length; i++) {
        var f = root * Math.pow(2, d.voices[i] / 12);
        for (var k = 0; k < 2; k++) {
          var o = ctx.createOscillator();
          o.type = d.type;
          o.frequency.value = f;
          o.detune.value = (k ? d.detune : -d.detune) * (1 + i * 0.2);
          var g = gain(ctx, 0.16 / (1 + i * 0.5));
          // chaque voix respire à son rythme : l'accord n'est jamais figé
          drift(ctx, g.gain, at, 0.16 / (1 + i * 0.5), 0.05 / (1 + i), 0.017 + i * 0.011 + k * 0.006);
          o.connect(g).connect(filt);
          o.start(at);
          oscs.push(o);
        }
      }
      // la basse : ce qui reste quand tout le reste s'efface
      var sub = ctx.createOscillator();
      sub.type = 'sine'; sub.frequency.value = root / 2;
      var sg = gain(ctx, d.sub * 0.5);
      sub.connect(sg).connect(out);
      sub.start(at);
      oscs.push(sub);
      oscs = oscs.concat(RECOLTE); RECOLTE = null;
      var p = {
        out: out, oscs: oscs, base: 0.055,
        level: function (t, ramp) {
          var v = (mode === 'tout') ? p.base * (1 + 2.2 * tension) : 0.0001;
          out.gain.cancelScheduledValues(t);
          out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), t);
          out.gain.linearRampToValueAtTime(Math.max(v, 0.0001), t + ramp);
          filt.frequency.cancelScheduledValues(t);
          filt.frequency.setTargetAtTime(d.cut * (1 + 1.4 * tension), t, 1.2);
        },
        stop: function (t, fade) {
          out.gain.cancelScheduledValues(t);
          out.gain.setValueAtTime(out.gain.value, t);
          out.gain.linearRampToValueAtTime(0.0001, t + fade);
          for (var i = 0; i < oscs.length; i++) { try { oscs[i].stop(t + fade + 0.1); } catch (e) {} }
        }
      };
      p.level(at, fade);
      return p;
    }

    // ---- l'écho d'un thème : la note revient à gauche, puis à droite, puis à
    //      gauche, chaque passage plus bas (`retour`), et plus sourd à chaque
    //      aller-retour (`coupe`). UN seul retard, stéréo, dont les deux canaux
    //      se croisent : deux retards l'un dans l'autre se faisaient servir dans
    //      un ordre qui changeait d'un rendu à l'autre (Chromium), et le banc ne
    //      rendait jamais deux fois le même fichier ----
    function faireEcho(out, e, pas) {
      var t = Math.min(1.9, (e.pas || 3) * pas);
      var entree = gain(ctx, 1);
      var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 280;
      var r = e.retour == null ? 0.35 : e.retour;
      var mel = ctx.createChannelMerger(2), sep = ctx.createChannelSplitter(2);
      var d = ctx.createDelay(2);
      d.delayTime.value = t;
      var gd = gain(ctx, r), gg = gain(ctx, r);
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = e.coupe || 2600;
      entree.connect(hp).connect(mel, 0, 0);
      mel.connect(d).connect(sep);
      // la gauche revient : on l'entend, et elle repart à droite
      sep.connect(panner(ctx, out, -0.6), 0);
      sep.connect(gd, 0).connect(mel, 0, 1);
      // la droite revient : on l'entend, et elle repart à gauche, plus sourde
      sep.connect(panner(ctx, out, 0.6), 1);
      sep.connect(lp, 1).connect(gg).connect(mel, 0, 0);
      return entree;
    }

    // ---- un thème ----
    // Le chemin du son. Chaque voix a son bus : le flottement de la cassette
    // (`flotte`), la saturation, le filtre, le niveau, le panoramique, et ses
    // envois (l'écho, la salle). Les voix `pompe` passent par un gain que chaque
    // grosse caisse creuse. La batterie a son bus (saturation, filtre, envois à
    // la salle et à la porte). Tout se rejoint dans `mix`, passe par la cassette
    // si le thème en a une (saturation douce, aigus arrondis, souffle), puis par
    // `out` : le niveau du thème et ses fondus. Sans salle, le thème entier passe
    // dans la petite pièce commune (`musWet`), comme avant.
    function makeTheme(nom, at, fade, depuis) {
      var C = compilerTheme(nom), th = C.th, niveau = th.gain || 1;
      var out = gain(ctx, fade > 0 ? 0.0001 : niveau);
      out.connect(musBus);
      var piece = th.salle ? (th.salle.piece || 0) : 1;
      if (piece === 1) out.connect(musWet);
      else if (piece > 0) out.connect(gain(ctx, piece)).connect(musWet);
      if (fade > 0) { out.gain.setValueAtTime(0.0001, at); out.gain.linearRampToValueAtTime(niveau, at + fade); }
      // ce qui tourne tant que le thème vit (le souffle, les flottements) : arrêté avec lui
      var vivants = [];
      // le flottement d'une bande : la voix passe par un retard qui s'allonge et
      // raccourcit lentement — la hauteur ondule de ±`prof` cents, à `vit` Hz, en
      // deux lenteurs qui ne se rejoignent jamais (le flottement ne se répète pas)
      function flottement(entree, f) {
        var prof = clamp(typeof f === 'number' ? f : (f.prof == null ? 8 : f.prof), 0, 40);
        var vit = clamp(typeof f === 'number' ? 0.55 : (f.vit == null ? 0.55 : f.vit), 0.2, 12);
        var frac = Math.pow(2, prof / 1200) - 1;
        var a1 = frac * 0.65 / (2 * Math.PI * vit), a2 = frac * 0.35 / (2 * Math.PI * vit * 0.383);
        var d = ctx.createDelay(0.25);
        d.delayTime.value = a1 + a2 + 0.002;
        [[vit, a1], [vit * 0.383, a2]].forEach(function (c) {
          var o = ctx.createOscillator();
          o.frequency.value = c[0];
          o.connect(gain(ctx, c[1])).connect(d.delayTime);
          o.start(at); vivants.push(o);
        });
        entree.connect(d);
        return d;
      }
      // LA CASSETTE (au thème) : `cassette: { sature, coupe, bas, souffle, flotte }`
      var mix = out, K = th.cassette;
      if (K) {
        mix = gain(ctx, 1);
        var xk = mix;
        if (K.flotte) xk = flottement(xk, K.flotte);
        if (K.sature > 0) {
          var wk = ctx.createWaveShaper();
          // sans suréchantillonnage : la saturation est douce, ses harmoniques sont minces (et le mélange entier passe ici)
          wk.curve = courbeDouce(K.sature); wk.oversample = 'none';
          // le mélange entre divisé par DOUCE ; la courbe rend tanh(k·x)/k dans
          // l'échelle d'origine (sa pente vaut 1 aux petits niveaux)
          xk = xk.connect(gain(ctx, 1 / DOUCE));
          xk.connect(wk); xk = wk;
        }
        if (K.bas > 0) {
          // le grave sous le grave (rien qu'un téléphone ou un casque rende) s'en va
          var bk0 = ctx.createBiquadFilter();
          bk0.type = 'highpass'; bk0.frequency.value = K.bas; bk0.Q.value = 0.6;
          xk.connect(bk0); xk = bk0;
        }
        var lk = ctx.createBiquadFilter();
        lk.type = 'lowpass'; lk.frequency.value = K.coupe || 12000; lk.Q.value = 0.5;
        xk.connect(lk); lk.connect(out);
        if (K.souffle > 0) {
          // le souffle de la bande : du bruit dans le médium-aigu, très bas
          var sk = src(ctx, at, true, 0.93);
          var hk = ctx.createBiquadFilter(); hk.type = 'highpass'; hk.frequency.value = 1600; hk.Q.value = 0.5;
          var bk = ctx.createBiquadFilter(); bk.type = 'lowpass'; bk.frequency.value = 7000; bk.Q.value = 0.5;
          sk.connect(hk).connect(bk).connect(gain(ctx, K.souffle)).connect(lk);
          vivants.push(sk);
        }
      }
      // LA SALLE (au thème) : `salle: { taille, duree, ton, piece }` ; les voix y
      // envoient `rev`. Sans `salle`, une voix qui a un `rev` reçoit une salle moyenne.
      var salle = null, aSalle = !!th.salle;
      Object.keys(th.voix).forEach(function (vn) { if (th.voix[vn].rev > 0) aSalle = true; });
      if (aSalle) {
        var S0 = th.salle || {};
        salle = gain(ctx, 1);
        var hs = ctx.createBiquadFilter(); hs.type = 'highpass'; hs.frequency.value = 170; hs.Q.value = 0.5;
        var cs = ctx.createConvolver(); cs.normalize = true;
        cs.buffer = salleIR(ctx, S0.taille, S0.duree, S0.ton);
        salle.connect(hs).connect(cs).connect(mix);
      }
      var pompe = null;
      if (th.pompe) { pompe = gain(ctx, 1); pompe.connect(mix); }
      var echo = th.echo ? faireEcho(mix, th.echo, C.pas) : null;
      var bus = {};
      Object.keys(th.voix).forEach(function (vn) {
        if (vn === 'batt') return;
        var v = th.voix[vn], entree = gain(ctx, 1), x = entree, flt = null;
        if (v.flotte) x = flottement(x, v.flotte);
        if (v.drive) {
          var ws = ctx.createWaveShaper();
          ws.curve = courbeDrive(v.drive); ws.oversample = '2x';
          x.connect(ws); x = ws;
        }
        if (v.filtre) {
          flt = ctx.createBiquadFilter();
          flt.type = 'lowpass'; flt.frequency.value = v.filtre; flt.Q.value = v.q || 0.7;
          x.connect(flt); x = flt;
        }
        // une voix saturée entre à pleine force dans la saturation : son
        // niveau ne s'applique qu'après
        var lvl = gain(ctx, v.drive ? v.vol : 1);
        x.connect(lvl);
        lvl.connect(panner(ctx, v.pompe && pompe ? pompe : mix, v.pan));
        if (v.echo && echo) lvl.connect(gain(ctx, v.echo)).connect(echo);
        if (v.rev && salle) lvl.connect(gain(ctx, v.rev)).connect(salle);
        bus[vn] = { entree: entree, filtre: flt };
      });
      // LA BATTERIE (la voix `batt` : `vol`, `drive`, `filtre`, `rev`, `porte`,
      // `tenue`). La grosse caisse, le charleston, les cymbales et le reste vont
      // au bus ; les caisses claires, les claps, les toms et le cerclage passent
      // aussi par la salle (`rev`) ; la caisse « gated » S, en plus, par la porte.
      var bt = th.voix.batt || null, battBus = null, battCaisse = null, battS = null;
      if (bt) {
        battBus = gain(ctx, 1);
        var xb = battBus, fb = null;
        if (bt.drive) {
          // la batterie entre à pleine force dans la saturation, son niveau après
          var pre = gain(ctx, 1 / Math.max(bt.vol || 1, 0.05));
          var wb = ctx.createWaveShaper();
          wb.curve = courbeDrive(bt.drive); wb.oversample = '2x';
          xb.connect(pre).connect(wb); xb = wb;
        }
        if (bt.filtre) {
          fb = ctx.createBiquadFilter();
          fb.type = 'lowpass'; fb.frequency.value = bt.filtre; fb.Q.value = bt.q || 0.7;
          xb.connect(fb); xb = fb;
          bus.batt = { entree: null, filtre: fb };
        }
        if (bt.drive) xb = xb.connect(gain(ctx, bt.vol));
        xb.connect(mix);
        battCaisse = gain(ctx, 1); battCaisse.connect(battBus);
        if (bt.rev && salle) battCaisse.connect(gain(ctx, bt.rev)).connect(salle);
        battS = gain(ctx, 1); battS.connect(battCaisse);
        if (bt.porte) {
          var cp = ctx.createConvolver(); cp.normalize = true;
          cp.buffer = porteIR(ctx, bt.tenue);
          // `porte: 1` : la queue presque aussi forte que la caisse elle-même ; 0,5 : douze décibels dessous
          battS.connect(cp).connect(gain(ctx, bt.porte * 6)).connect(battBus);
        }
      }
      function battDest(f) {
        if (!battBus) return mix;
        if (f === 'S') return battS;
        if (f === 's' || f === 'c' || f === 't' || f === 'T' || f === 'r') return battCaisse;
        return battBus;
      }
      function pomper(tt) {
        var g = pompe.gain;
        g.setTargetAtTime(1 - th.pompe.prof, tt, 0.004);
        g.setTargetAtTime(1, tt + 0.03, (th.pompe.rel || 0.15) / 3);
      }
      // le début d'une section : les filtres qu'elle balaie, les autres rendus
      function debut(sec, tt) {
        Object.keys(bus).forEach(function (vn) {
          var b = bus[vn];
          if (!b.filtre) return;
          var o = sec.ouvre && sec.ouvre[vn], f = b.filtre.frequency;
          if (o) { f.setValueAtTime(o[0], tt); f.exponentialRampToValueAtTime(o[1], tt + sec.pas * C.pas); }
          else f.setValueAtTime(th.voix[vn].filtre, tt);
        });
      }
      // d'où l'on part : le début, ou `depuis` (le nom d'une section, son rang
      // dans l'ordre, ou { index, mesure } — une mesure négative compte depuis la fin)
      var idx = 0, step = 0, passage = 0;
      if (depuis != null) {
        var di = typeof depuis === 'number' ? depuis : typeof depuis === 'string' ? C.ordre.indexOf(depuis) : depuis.index;
        if (!(di >= 0 && di < C.ordre.length)) throw new Error(nom + ' : départ inconnu « ' + JSON.stringify(depuis) + ' »');
        idx = di;
        var nbm = C.sections[C.ordre[di]].pas / 16, dm = depuis && depuis.mesure ? depuis.mesure : 0;
        if (dm < 0) dm = nbm + dm;
        step = clamp(Math.floor(dm), 0, nbm - 1) * 16;
      }
      var tStep = at, entree0 = step > 0;
      // le journal : quand chaque section commence (la position affichée)
      var journal = [];
      function noter(t) {
        journal.push({ t: t, index: idx, section: C.ordre[idx], mesures: C.sections[C.ordre[idx]].pas / 16, passage: passage });
        if (journal.length > 24) journal.shift();
      }
      noter(at - step * C.pas);
      function decalage(n) {
        var sw = th.swing || 0;
        return n % 4 === 2 ? sw * C.pas : (n % 2 === 1 ? sw * C.pas * 0.5 : 0);
      }
      function jouerPas(sec, n, tt) {
        var evs = sec.parPas[n];
        for (var i = 0; i < evs.length; i++) {
          var e = evs[i], voix = th.voix[e.v];
          if (e.frappe) {
            for (var k = 0; k < e.frappe.length; k++) {
              var f = e.frappe[k];
              jouerFrappe(ctx, battDest(f), f, tt, voix.vol, C.pas);
              if (pompe && (f === 'k' || f === 'K')) pomper(tt);
            }
            continue;
          }
          var inst = voix.epoque ? timbreEpoque(voix.inst, year) : voix.inst;
          var dur = e.len * C.pas * (e.len > 1 ? 0.96 : 0.8);
          var vol = (voix.drive ? 1 : voix.vol) / Math.sqrt(e.h.length);
          var ex = { acc: e.acc, de: e.de != null ? hzDe(e.de) : 0 };
          for (var j = 0; j < e.h.length; j++) jouerNote(ctx, bus[e.v].entree, inst, tt, dur, hzDe(e.h[j]), vol, voix, ex);
        }
      }
      return {
        name: nom, out: out, dead: 0,
        pump: function (t0, t1) {
          var garde = 0;
          while (tStep < t1 && garde++ < 4096) {
            var sec = C.sections[C.ordre[idx]];
            if (!sec) break;
            var tt = tStep + decalage(step);
            if (tt >= t0 - 0.02) {
              if (step === 0) debut(sec, tt);
              else if (entree0) debut(sec, tStep - step * C.pas);
              entree0 = false;
              jouerPas(sec, step, tt);
            }
            step++; tStep += C.pas;
            if (step >= sec.pas) {
              step = 0; idx++;
              if (idx >= C.ordre.length) { idx = C.boucle; passage++; }
              noter(tStep);
            }
          }
        },
        // où en est la musique à l'heure `t` : la section, la mesure, le passage
        position: function (t) {
          var e = null;
          for (var i = journal.length - 1; i >= 0; i--) if (journal[i].t <= t + 1e-6) { e = journal[i]; break; }
          if (!e) e = journal[0];
          if (!e) return null;
          var m = Math.floor((t - e.t) / (C.pas * 16));
          return {
            theme: nom, section: e.section, index: e.index, passage: e.passage, boucle: e.index >= C.boucle,
            mesure: clamp(m, 0, e.mesures - 1) + 1, mesures: e.mesures,
            secondes: clamp(t - e.t, 0, e.mesures * C.pas * 16)
          };
        },
        stop: function (t, f) {
          this.dead = t + f + 0.4;
          out.gain.cancelScheduledValues(t);
          out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), t);
          out.gain.linearRampToValueAtTime(0.0001, t + f);
          for (var i = 0; i < vivants.length; i++) { try { vivants[i].stop(t + f + 0.3); } catch (e) { /* déjà arrêté */ } }
        }
      };
    }

    function now() { return ctx.currentTime; }

    var engine = {
      ctx: ctx,
      // ---- le séquenceur : il écrit les événements jusqu'à `until` ----
      scheduleUntil: function (until) {
        var t0 = scheduled;
        if (until <= t0) return;
        for (var i = 0; i < slots.length; i++) if (!slots[i].dead) slots[i].pump(t0, until);
        for (var m = 0; m < themes.length; m++) if (!themes[m].dead || themes[m].dead > t0) themes[m].pump(t0, until);
        scheduled = until;
        // ménage : les lieux éteints sortent du graphe
        var t = now();
        slots = slots.filter(function (s) {
          if (s.dead && s.dead < t) { try { s.out.disconnect(); } catch (e) {} return false; }
          return true;
        });
        themes = themes.filter(function (s) {
          if (s.dead && s.dead < t) { try { s.out.disconnect(); } catch (e) {} return false; }
          return true;
        });
      },
      setMode: function (m, at) {
        if (MODES.indexOf(m) < 0) m = 'tout';
        if (m === mode) return;
        mode = m;
        var t = at == null ? now() : at;
        if (mode === 'tout') {
          if (wanted && !slots.some(function (s) { return s.name === wanted && !s.dead; })) engine.setAmbiance(wanted, { fade: 0.6, at: t });
          if (themeVoulu) { var tv = themeVoulu; themeVoulu = null; engine.setTheme(tv, { at: t, fade: 0.8 }); }
          else if (!pad) { if (opt.pad !== false) pad = makePad(t, 1.5); } else pad.level(t, 1.2);
        } else {
          for (var i = 0; i < slots.length; i++) if (!slots[i].dead) slots[i].stop(t, 0.4);
          for (var j = 0; j < themes.length; j++) if (!themes[j].dead) themes[j].stop(t, 0.4);
          if (pad) { pad.stop(t, 0.5); pad = null; }
        }
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(mode === 'muet' ? 0.0001 : (opt.master == null ? 0.85 : opt.master), t + 0.2);
      },
      mode: function () { return mode; },
      // ---- le lieu : fondu enchaîné de 1,5 s ----
      setAmbiance: function (name, o) {
        o = o || {};
        if (AMBIANCES.indexOf(name) < 0) return;
        wanted = name;
        if (mode !== 'tout') return;
        var cur = slots.filter(function (s) { return !s.dead; }).pop();
        if (cur && cur.name === name) return;
        var t = o.at == null ? now() : o.at;
        var fade = o.fade == null ? 1.5 : o.fade;
        if (cur) cur.stop(t, fade);
        var s = makeSlot(name, t, fade);
        if (s) {
          slots.push(s);
          // le lieu qui arrive doit être servi jusqu'où les autres le sont
          if (scheduled > t) s.pump(t, scheduled);
        }
      },
      ambiance: function () { return wanted; },
      // ---- la tension : la nappe monte de quelques décibels ----
      setTension: function (v, at) {
        v = clamp(Number(v) || 0, 0, 1);
        if (Math.abs(v - tension) < 0.02) return;
        tension = v;
        if (pad) pad.level(at == null ? now() : at, 2.5);
      },
      tension: function () { return tension; },
      // ---- la décennie : on refait la nappe quand on change d'époque ----
      setYear: function (y, at) {
        y = Number(y) || 1990;
        if (decadeOf(y) === decadeOf(year)) { year = y; return; }
        year = y;
        if (mode !== 'tout') return;
        var t = at == null ? now() : at;
        if (pad) pad.stop(t, 2);
        pad = themes.some(function (s) { return !s.dead; }) ? null : makePad(t, 2.5);
      },
      // ---- la musique : un thème, en fondu enchaîné ; null rend la nappe.
      //      `o.depuis` (une section, son rang, ou { index, mesure }) part d'ailleurs
      //      que du début — et relance le thème même s'il joue déjà. Un thème qui
      //      ne se compile pas se tait (l'erreur va dans FusibleAudio.erreurs()) :
      //      la musique d'avant continue ----
      setTheme: function (nom, o) {
        o = o || {};
        if (nom != null && !MUSIQUE[nom]) return;
        var t = o.at == null ? now() : o.at;
        if (mode !== 'tout') { themeVoulu = nom; return; }
        var cur = themes.filter(function (s) { return !s.dead; }).pop();
        if (cur && cur.name === nom && o.depuis == null) {
          themeVoulu = nom;
          for (var i = 0; i < slots.length; i++) if (!slots[i].dead) slots[i].musique(t, true);
          return;
        }
        var fade = o.fade == null ? 1.2 : o.fade, s = null;
        if (nom) {
          try {
            s = makeTheme(nom, t + (cur ? Math.min(fade, 0.6) : 0.05), cur ? Math.min(0.8, Math.max(fade, 0.05)) : Math.min(fade, 0.4), o.depuis);
          } catch (e) {
            signaler('thème ' + nom, e);
            return;
          }
        }
        themeVoulu = nom;
        for (var j = 0; j < slots.length; j++) if (!slots[j].dead) slots[j].musique(t, nom != null);
        if (cur) cur.stop(t, fade);
        if (s) {
          themes.push(s);
          if (scheduled > t) s.pump(t, scheduled);
          if (pad) { pad.stop(t, 1); pad = null; }
        } else if (!pad && opt.pad !== false) pad = makePad(t, 1.5);
      },
      theme: function () { return themeVoulu; },
      // où en est le thème qui joue (le juke-box l'affiche) : { theme, section,
      // index, mesure, mesures, secondes (depuis le début de la section),
      // passage, boucle } — ou null
      position: function (at) {
        var cur = themes.filter(function (s) { return !s.dead; }).pop();
        return cur ? cur.position(at == null ? now() : at) : null;
      },
      // ---- une courte phrase jouée une fois (le départ d'une histoire) ----
      jingle: function (nom, o) {
        var J = JINGLES[nom];
        if (!J || mode !== 'tout') return;
        var t = o && o.at != null ? o.at : now() + 0.01, p = 60 / J.bpm / 4;
        var g = gain(ctx, 1);
        g.connect(musBus); g.connect(musWet);
        J.notes.forEach(function (n) {
          jouerNote(ctx, g, n[3] || J.inst || 'pulse', t + n[1] * p, n[2] * p * 0.9, hzDe(midiDe(n[0]) + (J.transpose || 0)),
            n[4] || J.vol || 0.12, { duty: 0.25 }, null);
        });
        J.frappes.forEach(function (f) { jouerFrappe(ctx, g, f[0], t + f[1] * p, J.frappe || 0.8, p); });
        if (!offline && global.setTimeout) global.setTimeout(function () { try { g.disconnect(); } catch (e) {} }, 4000);
      },
      // ---- les gestes ----
      play: function (name, o) {
        o = o || {};
        var fn = GESTES[name];
        if (!fn || mode === 'muet') return;
        var t = (o.at == null ? now() + 0.008 : o.at);
        var g = gain(ctx, o.gain == null ? 1 : o.gain);
        g.connect(sfxBus);
        fn(ctx, g, t, rnd);
        // Le graphe ne doit pas grossir d'un nœud par carte pendant deux
        // heures : le geste se débranche tout seul, une fois éteint.
        if (!offline && global.setTimeout) global.setTimeout(function () { try { g.disconnect(); } catch (e) {} }, 4000);
      },
      playAll: function (list, o) {
        if (!list || !list.length) return;
        o = o || {};
        var step = o.step == null ? 0.075 : o.step;
        var t = (o.at == null ? now() + 0.008 : o.at);
        for (var i = 0; i < list.length; i++) engine.play(list[i], { at: t + i * step, gain: i ? 0.75 : 1 });
      },
      // ---- le direct : une fenêtre glissante d'une seconde et demie ----
      startClock: function () {
        if (engine._timer) return;
        scheduled = Math.max(scheduled, now());
        engine._timer = setInterval(function () {
          try { engine.scheduleUntil(now() + 1.5); } catch (e) {}
        }, 250);
        engine.scheduleUntil(now() + 1.5);
      },
      stopClock: function () {
        if (engine._timer) { clearInterval(engine._timer); engine._timer = null; }
      },
      dispose: function () {
        engine.stopClock();
        var t = now();
        for (var i = 0; i < slots.length; i++) if (!slots[i].dead) slots[i].stop(t, 0.1);
        for (var j = 0; j < themes.length; j++) if (!themes[j].dead) themes[j].stop(t, 0.1);
        if (pad) { pad.stop(t, 0.1); pad = null; }
      }
    };
    // Le mode d'ouverture : la nappe n'existe qu'en « tout ». `opt.pad: false`
    // la coupe pour de bon — c'est ce qui permet au banc d'essai de mesurer un
    // lieu ou un geste tout seul, sans la trame par-dessus.
    if (opt.mode && opt.mode !== 'tout') { mode = opt.mode; if (mode === 'muet') master.gain.value = 0.0001; }
    else if (opt.pad !== false) pad = makePad(opt.at == null ? ctx.currentTime : opt.at, 2);
    return engine;
  }

  // ============================================================= le direct =
  // Un seul moteur pour la page, créé au PREMIER GESTE du joueur : avant ça,
  // aucun AudioContext n'existe (les navigateurs le refusent, et un jeu qui
  // chante tout seul à l'ouverture est un jeu qu'on referme).
  var live = null, liveCtx = null;
  var mode = 'tout';
  var pending = { ambiance: null, tension: 0, year: 1990, theme: null };
  // LA PAGE CACHÉE — le téléphone verrouillé, un autre onglet, l'application en
  // fond : la musique se tait (le contexte est suspendu, le séquenceur arrêté, plus
  // rien ne se programme) et reprend où elle en était quand la page revient, si le
  // son est ouvert. Un geste joué pendant ce temps ne s'entend pas : personne n'écoute.
  var cachee = !!(global.document && global.document.hidden);
  function reveiller() {
    if (!liveCtx || cachee || liveCtx.state === 'closed') return;
    if (liveCtx.state !== 'running') { try { var p = liveCtx.resume(); if (p && p.catch) p.catch(function () {}); } catch (x) { /* un geste le relancera */ } }
  }
  function cacher() {
    if (cachee) return;
    cachee = true;
    if (live) live.stopClock();
    if (liveCtx && liveCtx.state === 'running') { try { var p = liveCtx.suspend(); if (p && p.catch) p.catch(function () {}); } catch (x) { /* rien */ } }
  }
  function montrer() {
    if (!cachee) return;
    cachee = false;
    if (!live || !liveCtx) return;
    reveiller();
    live.startClock();
    // un téléphone (iOS) peut refuser de relancer le son sans un geste : le prochain le relance
    var geste = function () {
      ['pointerdown', 'keydown', 'touchend'].forEach(function (t) { global.document.removeEventListener(t, geste, true); });
      reveiller();
    };
    ['pointerdown', 'keydown', 'touchend'].forEach(function (t) { global.document.addEventListener(t, geste, true); });
  }
  if (global.document && global.addEventListener) {
    global.document.addEventListener('visibilitychange', function () { if (global.document.hidden) cacher(); else montrer(); });
    global.addEventListener('pagehide', cacher);
    global.addEventListener('pageshow', function () { if (!global.document.hidden) montrer(); });
  }

  function ensure() {
    if (live) return live;
    if (mode === 'muet') return null;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    try { liveCtx = new AC(); } catch (e) { return null; }
    live = createEngine(liveCtx, liveCtx.destination, { mode: mode });
    live.setYear(pending.year);
    // le thème avant le lieu : le lit d'un lieu né sous un thème naît éteint
    if (pending.theme) live.setTheme(pending.theme, { fade: 0.6 });
    if (pending.ambiance) live.setAmbiance(pending.ambiance, { fade: 0.8 });
    live.setTension(pending.tension);
    // né pendant que la page est cachée (rare : il faut un geste) : il attend qu'elle revienne
    if (cachee) { try { liveCtx.suspend(); } catch (x) { /* rien */ } } else live.startClock();
    return live;
  }

  var API = {
    AMBIANCES: AMBIANCES.slice(),
    SFX: SFX.slice(),
    MODES: MODES.slice(),
    createEngine: createEngine,
    // Le premier geste du joueur : c'est là, et seulement là, que le son naît.
    unlock: function () {
      var e = ensure();
      if (e) reveiller();
      return !!e;
    },
    started: function () { return !!live && !!liveCtx && liveCtx.state === 'running'; },
    mode: function () { return mode; },
    setMode: function (m) {
      if (MODES.indexOf(m) < 0) m = 'tout';
      mode = m;
      if (m === 'muet') {
        if (live) { live.dispose(); }
        if (liveCtx) { try { liveCtx.close(); } catch (x) {} }
        live = null; liveCtx = null;
        return mode;
      }
      var e = ensure();
      if (e) {
        e.setMode(m);
        reveiller();
      }
      return mode;
    },
    setAmbiance: function (name) {
      if (AMBIANCES.indexOf(name) < 0) return;
      pending.ambiance = name;
      if (live) live.setAmbiance(name);
    },
    ambiance: function () { return pending.ambiance; },
    setTension: function (v) {
      pending.tension = clamp(Number(v) || 0, 0, 1);
      if (live) live.setTension(pending.tension);
    },
    setYear: function (y) {
      pending.year = Number(y) || 1990;
      if (live) live.setYear(pending.year);
    },
    setTheme: function (nom) {
      if (nom != null && !MUSIQUE[nom]) return;
      pending.theme = nom;
      if (live) live.setTheme(nom);
    },
    // deux usages : `theme()` rend le thème demandé (le jeu) ; `theme(clé,
    // définition)` inscrit un thème (son fichier, musique/<clé>.js)
    theme: function (cle, def) {
      if (arguments.length >= 2) return enregistrer(cle, def);
      return pending.theme;
    },
    // ce que le juke-box et le banc affichent, sans rien compiler
    infos: function (cle) {
      var th = MUSIQUE[cle];
      if (!th) return null;
      return {
        cle: cle, titre: th.titre || cle, moment: th.moment || '', humeur: th.humeur || '',
        tonalite: th.tonalite || '', bpm: th.bpm, ville: th.ville === true
      };
    },
    structure: function (cle) { return structureDe(cle); },
    erreurs: function () { return ERREURS.map(function (e) { return { ou: e.ou, message: e.message }; }); },
    _erreur: function (ou, e) { signaler(ou, e); },
    SILENCE: SILENCE,
    jingle: function (nom) { if (live) live.jingle(nom); },
    // le banc d'essai : la partition compilée d'un thème (les erreurs d'écriture sortent ici)
    _compiler: function (nom) { var C = compilerTheme(nom); return { ordre: C.ordre, pas: Object.keys(C.sections).map(function (k) { return k + ':' + C.sections[k].pas; }) }; },
    _partition: function (nom) { return compilerTheme(nom); },
    play: function (name) { if (live) live.play(name); },
    playAll: function (list, o) { if (live) live.playAll(list, o); },
    stop: function () { if (live) live.dispose(); }
  };
  // les thèmes inscrits, dans l'ordre où leurs fichiers sont arrivés (une copie :
  // la liste se lit à la demande, après que musique/*.js a parlé)
  Object.defineProperty(API, 'THEMES', { enumerable: true, get: function () { return Object.keys(MUSIQUE); } });

  global.FusibleAudio = API;
  if (typeof module === 'object' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : this);
