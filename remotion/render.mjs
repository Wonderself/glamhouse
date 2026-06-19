import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition, ensureBrowser} from '@remotion/renderer';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'assets', 'videos');

console.log('• ensureBrowser…');
await ensureBrowser();

console.log('• bundling…');
const serveUrl = await bundle({
  entryPoint: path.join(__dirname, 'src', 'index.ts'),
  onProgress: (p) => {
    if (p % 25 === 0) console.log(`  bundle ${p}%`);
  },
});

async function render(id, file, codec = 'h264') {
  console.log(`• composition ${id}…`);
  const composition = await selectComposition({serveUrl, id});
  await renderMedia({
    serveUrl,
    composition,
    codec,
    outputLocation: path.join(outDir, file),
    concurrency: 2,
    onProgress: ({progress}) => {
      const pct = Math.round(progress * 100);
      if (pct % 20 === 0) process.stdout.write(`  ${id} ${pct}%\n`);
    },
  });
  console.log(`  ✓ ${file}`);
}

const target = process.argv[2];
if (!target || target === 'hero') await render('HeroFilm', 'motion-hero.mp4');
if (!target || target === 'aurora') await render('AuroraLoop', 'motion-aurora.mp4');
console.log('done.');
