import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { drawScaled, canvasToBlob, withExtension, createCanvas, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['meme'];
  common: Dict['common'];
}

export default function MemeApp({ t, common }: Props) {
  const [top, setTop] = useState('');
  const [bottom, setBottom] = useState('');
  const [style, setStyle] = useState<'inside' | 'outside'>('inside');
  const [textColor, setTextColor] = useState('#ffffff');
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [fontScale, setFontScale] = useState(100); // % of default size

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        const baseSize = Math.max(20, Math.round(f.width / 12));
        const fontSize = Math.max(12, Math.round((baseSize * fontScale) / 100));
        const topText = top.trim().toUpperCase();
        const bottomText = bottom.trim().toUpperCase();

        const wrapLines = (ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] => {
          const words = text.split(' ');
          const lines: string[] = [];
          let line = '';
          for (const w of words) {
            const test = line ? `${line} ${w}` : w;
            if (ctx.measureText(test).width > maxW && line) {
              lines.push(line);
              line = w;
            } else line = test;
          }
          if (line) lines.push(line);
          return lines.length ? lines : [''];
        };

        const paint = (ctx: CanvasRenderingContext2D) => {
          ctx.font = `900 ${fontSize}px Impact, 'Arial Black', system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = textColor;
          ctx.strokeStyle = outlineColor;
          ctx.lineWidth = Math.max(2, fontSize / 12);
          ctx.lineJoin = 'round';
        };

        let canvas: HTMLCanvasElement;
        if (style === 'inside') {
          canvas = drawScaled(f.img, f.width, f.height);
          const ctx = canvas.getContext('2d')!;
          paint(ctx);
          const maxW = canvas.width * 0.94;
          if (topText) {
            const lines = wrapLines(ctx, topText, maxW);
            lines.forEach((ln, i) => {
              const y = fontSize * 0.25 + i * fontSize * 1.15;
              ctx.strokeText(ln, canvas.width / 2, y);
              ctx.fillText(ln, canvas.width / 2, y);
            });
          }
          if (bottomText) {
            const lines = wrapLines(ctx, bottomText, maxW);
            const blockH = lines.length * fontSize * 1.15;
            lines.forEach((ln, i) => {
              const y = canvas.height - blockH - fontSize * 0.25 + i * fontSize * 1.15;
              ctx.strokeText(ln, canvas.width / 2, y);
              ctx.fillText(ln, canvas.width / 2, y);
            });
          }
        } else {
          // Text outside: white bands above/below the image
          const meas = document.createElement('canvas').getContext('2d')!;
          paint(meas);
          const maxW = f.width * 0.94;
          const topLines = topText ? wrapLines(meas, topText, maxW) : [];
          const bottomLines = bottomText ? wrapLines(meas, bottomText, maxW) : [];
          const bandH = (lines: string[]) =>
            lines.length ? Math.ceil(lines.length * fontSize * 1.15 + fontSize * 0.5) : 0;
          const topH = bandH(topLines);
          const botH = bandH(bottomLines);
          canvas = createCanvas(f.width, topH + f.height + botH);
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(f.img, 0, topH, f.width, f.height);
          paint(ctx);
          topLines.forEach((ln, i) => {
            const y = fontSize * 0.25 + i * fontSize * 1.15;
            ctx.strokeText(ln, canvas.width / 2, y);
            ctx.fillText(ln, canvas.width / 2, y);
          });
          bottomLines.forEach((ln, i) => {
            const y = topH + f.height + fontSize * 0.25 + i * fontSize * 1.15;
            ctx.strokeText(ln, canvas.width / 2, y);
            ctx.fillText(ln, canvas.width / 2, y);
          });
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
  const colorRow = (label: string, value: string, set: (v: string) => void) => (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">{label}</p>
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2">
        <input
          type="color"
          value={value}
          onChange={(e) => set(e.target.value)}
          className="h-8 w-12 cursor-pointer rounded border border-line bg-white p-0.5"
        />
        <span className="text-sm font-medium text-ink">{value.toUpperCase()}</span>
      </label>
    </div>
  );

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-2xl">
          <p className="mb-2 text-sm font-medium text-ink">{t.textStyle}</p>
          <div className="mb-5 inline-flex rounded-full border border-line p-1">
            {(['inside', 'outside'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setStyle(m)}
                className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                  style === m ? 'bg-brand text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {m === 'inside' ? t.textInside : t.textOutside}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink">{t.top}</span>
              <input value={top} onChange={(e) => setTop(e.target.value)} placeholder={t.topPh} className={inp} maxLength={80} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink">{t.bottom}</span>
              <input value={bottom} onChange={(e) => setBottom(e.target.value)} placeholder={t.bottomPh} className={inp} maxLength={80} />
            </label>
            {colorRow(t.textColor, textColor, setTextColor)}
            {colorRow(t.outlineColor, outlineColor, setOutlineColor)}
            <div className="sm:col-span-2">
              <label className="mb-1 flex justify-between text-sm font-medium text-ink">
                <span>{t.textSize}</span>
                <span className="text-brand">{fontScale}%</span>
              </label>
              <input
                type="range"
                min={50}
                max={200}
                value={fontScale}
                onChange={(e) => setFontScale(Number(e.target.value))}
                className="slider w-full"
              />
            </div>
          </div>
        </div>
      }
    />
  );
}
