import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { drawScaled, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['meme'];
  common: Dict['common'];
}

export default function MemeApp({ t, common }: Props) {
  const [top, setTop] = useState('');
  const [bottom, setBottom] = useState('');

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        const canvas = drawScaled(f.img, f.width, f.height);
        const ctx = canvas.getContext('2d')!;
        const fontSize = Math.max(20, Math.round(canvas.width / 12));
        ctx.font = `900 ${fontSize}px Impact, 'Arial Black', system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(2, fontSize / 12);
        ctx.lineJoin = 'round';
        const draw = (text: string, y: number) => {
          const upper = text.toUpperCase();
          // simple word wrap
          const words = upper.split(' ');
          const lines: string[] = [];
          let line = '';
          for (const w of words) {
            const test = line ? `${line} ${w}` : w;
            if (ctx.measureText(test).width > canvas.width * 0.94 && line) {
              lines.push(line);
              line = w;
            } else line = test;
          }
          if (line) lines.push(line);
          lines.forEach((ln, i) => {
            const ly = y + i * fontSize * 1.15;
            ctx.strokeText(ln, canvas.width / 2, ly);
            ctx.fillText(ln, canvas.width / 2, ly);
          });
        };
        if (top.trim()) draw(top, fontSize * 1.1);
        if (bottom.trim()) {
          const words = bottom.toUpperCase().split(' ');
          // count lines for bottom placement
          let lines = 1;
          let line = '';
          for (const w of words) {
            const test = line ? `${line} ${w}` : w;
            if (ctx.measureText(test).width > canvas.width * 0.94 && line) {
              lines++;
              line = w;
            } else line = test;
          }
          draw(bottom, canvas.height - fontSize * 0.4 - (lines - 1) * fontSize * 1.15);
        }
        const blob = await canvasToBlob(canvas, 'png');
        return {
          blob,
          name: withExtension(f.name, 'png', '-meme'),
          width: canvas.width,
          height: canvas.height,
          originalSize: f.size,
        };
      }),
    );
  };

  const inp = 'w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none';

  return (
    <ToolShell
      t={common}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto grid max-w-xl gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">{t.top}</span>
            <input value={top} onChange={(e) => setTop(e.target.value)} placeholder={t.topPh} className={inp} maxLength={80} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">{t.bottom}</span>
            <input value={bottom} onChange={(e) => setBottom(e.target.value)} placeholder={t.bottomPh} className={inp} maxLength={80} />
          </label>
        </div>
      }
    />
  );
}
