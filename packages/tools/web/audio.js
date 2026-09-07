/* ---------------------------------------------------------------------------
 * FUSIBLE — l'univers sonore de l'aperçu jouable.
 *
 * Retour client : « un jeu sans univers musical est un jeu vide. » Deux
 * couches, et rien d'autre :
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
 *
 * Un moteur hors ligne se pilote pareil, en passant les temps à la main :
 *   var e = FusibleAudio.createEngine(offlineCtx, offlineCtx.destination);
 *   e.setMode('tout'); e.setAmbiance('tribune', { fade: 0, at: 0 });
 *   e.scheduleUntil(3); offlineCtx.startRendering();
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
  function drift(ctx, param, t, center, depth, rate) {
    var o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = rate;
    var g = gain(ctx, depth);
    param.value = center;
    o.connect(g).connect(param);
    o.start(t);
    return o;
  }

  // ------------------------------------------------------------ les lieux --
  // Chaque lieu : une salle (réverbération), un lit continu, et des événements
  // tirés dans un intervalle. `evs` est lu par le séquenceur à fenêtre
  // glissante — le même code sert au direct et au rendu hors ligne.
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
        }],
        // une porte de casier, un banc, un pas sur le carrelage
        [5.5, 13, function (ctx, out, t, rnd) {
          var pan = between(rnd, -0.6, 0.6);
          burst(ctx, out, t, { type: 'lowpass', f: between(rnd, 400, 700), dur: 0.16, q: 0.7, peak: 0.13, pan: pan });
          tone(ctx, out, t, { type: 'triangle', f: between(rnd, 78, 104), f2: 52, dur: 0.13, peak: 0.06 });
          if (rnd() < 0.45) burst(ctx, out, t + between(rnd, 0.11, 0.2), { f: between(rnd, 1800, 2600), dur: 0.05, q: 3, peak: 0.05, pan: pan });
        }]
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
        }],
        // une porte, quelque part au fond
        [11, 26, function (ctx, out, t, rnd) {
          burst(ctx, out, t, { type: 'lowpass', f: between(rnd, 320, 520), dur: 0.2, q: 0.6, peak: 0.07, pan: between(rnd, -0.7, 0.7) });
        }]
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
        }]
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
            drift(ctx, fb.frequency, t, between(rnd, 700, 1100), 300, between(rnd, 3, 6));
            var g = gain(ctx, 0.0001);
            shape(g.gain, t, d * 0.3, d * 0.8, 0.04);
            s.connect(fb).connect(g).connect(out);
            s.stop(t + d * 1.3);
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
        }],
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
    }
  };

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
    ambBus.connect(master); padBus.connect(master); sfxBus.connect(master);

    var mode = 'tout';
    var tension = 0;
    var year = 1990;
    var wanted = null;    // le lieu demandé, même quand le mode le tait
    var slots = [];       // les lieux vivants (deux au plus pendant un fondu)
    var pad = null;
    var scheduled = 0;    // jusqu'où le séquenceur a déjà écrit

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
      var srcs = def.bed(ctx, input, at, rnd) || [];
      if (fade > 0) {
        out.gain.setValueAtTime(0.0001, at);
        out.gain.linearRampToValueAtTime(1, at + fade);
      }
      var next = [];
      for (var i = 0; i < def.evs.length; i++) next.push(at + rnd() * def.evs[i][1] * 0.6);
      return {
        name: name, out: out, input: input, srcs: srcs, def: def, next: next, dead: 0,
        pump: function (t0, t1) {
          for (var i = 0; i < def.evs.length; i++) {
            var e = def.evs[i], guard = 0;
            while (next[i] < t1 && guard++ < 64) {
              if (next[i] >= t0) e[2](ctx, input, next[i], rnd);
              next[i] += between(rnd, e[0], e[1]);
            }
          }
        },
        stop: function (t, fade) {
          this.dead = t + fade + 0.2;
          out.gain.cancelScheduledValues(t);
          out.gain.setValueAtTime(out.gain.value, t);
          out.gain.linearRampToValueAtTime(0.0001, t + fade);
          for (var i = 0; i < srcs.length; i++) {
            try { srcs[i].stop(t + fade + 0.1); } catch (e) {}
          }
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
      var lfo = drift(ctx, filt.frequency, at, d.cut, d.cut * 0.4, d.rate);
      // Le LFO du filtre est posé UNE fois ; la tension déplace son centre, on
      // n'en empile jamais un second (sinon la profondeur double à chaque fois).
      filt.connect(out).connect(padBus);
      var root = 55 * Math.pow(2, ((seed % 5) - 2) / 12); // la tonalité d'une carrière
      var oscs = [lfo];
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

    function now() { return ctx.currentTime; }

    var engine = {
      ctx: ctx,
      // ---- le séquenceur : il écrit les événements jusqu'à `until` ----
      scheduleUntil: function (until) {
        var t0 = scheduled;
        if (until <= t0) return;
        for (var i = 0; i < slots.length; i++) if (!slots[i].dead) slots[i].pump(t0, until);
        scheduled = until;
        // ménage : les lieux éteints sortent du graphe
        var t = now();
        slots = slots.filter(function (s) {
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
          if (!pad) { if (opt.pad !== false) pad = makePad(t, 1.5); } else pad.level(t, 1.2);
        } else {
          for (var i = 0; i < slots.length; i++) if (!slots[i].dead) slots[i].stop(t, 0.4);
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
        pad = makePad(t, 2.5);
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
  var pending = { ambiance: null, tension: 0, year: 1990 };

  function ensure() {
    if (live) return live;
    if (mode === 'muet') return null;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    try { liveCtx = new AC(); } catch (e) { return null; }
    live = createEngine(liveCtx, liveCtx.destination, { mode: mode });
    live.setYear(pending.year);
    if (pending.ambiance) live.setAmbiance(pending.ambiance, { fade: 0.8 });
    live.setTension(pending.tension);
    live.startClock();
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
      if (e && liveCtx && liveCtx.state === 'suspended') { try { liveCtx.resume(); } catch (x) {} }
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
        if (liveCtx && liveCtx.state === 'suspended') { try { liveCtx.resume(); } catch (x) {} }
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
    play: function (name) { if (live) live.play(name); },
    playAll: function (list, o) { if (live) live.playAll(list, o); },
    stop: function () { if (live) live.dispose(); }
  };

  global.FusibleAudio = API;
  if (typeof module === 'object' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : this);
