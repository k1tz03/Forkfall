#!/usr/bin/env node
// LE BANC D'ESSAI DU SON — rend la musique de audio.js hors ligne, sans
// haut-parleur : Chromium (Playwright) joue un thème dans un
// OfflineAudioContext, le banc en tire un WAV, et ffmpeg en donne le niveau
// (crête, moyenne) et un spectrogramme. C'est ainsi qu'on vérifie un thème
// qu'on ne peut pas écouter : les notes et le rythme se voient, la saturation
// se mesure.
//
//   NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/banc_son.js \
//     [--out <dossier>] [--duree 24] [--annee 1990] [accueil ville_jour …]
//
// Sans nom de thème, il les rend tous. Sorties : <thème>.wav, <thème>.png
// (spectrogramme), et une ligne de niveaux par thème.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ICI = __dirname;

function args() {
  const a = process.argv.slice(2), o = { themes: [], out: path.join(process.cwd(), 'banc_son'), duree: 24, annee: 1990 };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--out') o.out = a[++i];
    else if (a[i] === '--duree') o.duree = +a[++i];
    else if (a[i] === '--annee') o.annee = +a[++i];
    else o.themes.push(a[i]);
  }
  return o;
}

async function main() {
  const o = args();
  const { chromium } = require('playwright');
  fs.mkdirSync(o.out, { recursive: true });
  const audio = fs.readFileSync(path.join(ICI, 'audio.js'), 'utf8');
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage();
  await page.setContent('<!doctype html><meta charset="utf-8"><script>' + audio.split('</script').join('<\\/script') + '</script>');
  const themes = o.themes.length ? o.themes : await page.evaluate(() => window.FusibleAudio.THEMES);
  for (const nom of themes) {
    const b64 = await page.evaluate(async ({ nom, duree, annee }) => {
      const sr = 44100;
      const ctx = new OfflineAudioContext(2, Math.ceil(sr * duree), sr);
      const e = window.FusibleAudio.createEngine(ctx, ctx.destination, { seed: 1, pad: false, at: 0 });
      e.setYear(annee);
      e.setTheme(nom, { at: 0, fade: 0 });
      e.scheduleUntil(duree);
      const buf = await ctx.startRendering();
      // en WAV 16 bits stéréo
      const n = buf.length, L = buf.getChannelData(0), R = buf.getChannelData(1);
      const out = new DataView(new ArrayBuffer(44 + n * 4));
      const w = (o, s) => { for (let i = 0; i < s.length; i++) out.setUint8(o + i, s.charCodeAt(i)); };
      w(0, 'RIFF'); out.setUint32(4, 36 + n * 4, true); w(8, 'WAVE'); w(12, 'fmt ');
      out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 2, true);
      out.setUint32(24, sr, true); out.setUint32(28, sr * 4, true); out.setUint16(32, 4, true); out.setUint16(34, 16, true);
      w(36, 'data'); out.setUint32(40, n * 4, true);
      for (let i = 0; i < n; i++) {
        out.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true);
        out.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true);
      }
      const bytes = new Uint8Array(out.buffer);
      let s = '';
      for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      return btoa(s);
    }, { nom, duree: o.duree, annee: o.annee });
    const wav = path.join(o.out, nom + '.wav');
    fs.writeFileSync(wav, Buffer.from(b64, 'base64'));
    const png = path.join(o.out, nom + '.png');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-lavfi', 'showspectrumpic=s=1400x520:legend=1:scale=log:fscale=log', png]);
    // volumedetect écrit sur la sortie d'erreur
    const r = spawnSync('ffmpeg', ['-hide_banner', '-i', wav, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
    const moy = /mean_volume: (-?[\d.]+) dB/.exec(r.stderr), max = /max_volume: (-?[\d.]+) dB/.exec(r.stderr);
    const stats = `moyenne ${moy ? moy[1] : '?'} dB · crête ${max ? max[1] : '?'} dB`;
    console.log(`${nom.padEnd(11)} ${stats} → ${path.relative(process.cwd(), wav)}, ${path.basename(png)}`);
  }
  await browser.close();
}

main().catch((e) => { console.error('banc_son : ' + (e && e.message ? e.message : e)); process.exit(1); });
