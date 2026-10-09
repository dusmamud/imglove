import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { drawScaled, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['watermark'];
  common: Dict['common'];
}

type Pos = 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br';

export default function WatermarkApp({ t, common }: Props) {
  const [text, setText] = useState('');
  const [pos, setPos] = useState<Pos>('br');
  const [opacity, setOpacity] = useState(60);
  const [size, setSize] = useState(5); // % of width
  const [color, setColor] = useState<'white' | 'black'>('white');

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    const label = text.trim() || t.textPh;
    return Promise.all(
      files.map(async (f) => {
        const canvas = drawScaled(f.img, f.width, f.height);
        const ctx = canvas.getContext('2d')!;
        const fontSize = Math.max(12, Math.round((canvas.width * size) / 100));
        ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
        ctx.globalAlpha = opacity / 100;
        const pad = fontSize * 0.8;
        const tw = ctx.measureText(label).width;
        let x = pad;
        let y = pad + fontSize;
        if (pos[1] === 'c') x = (canvas.width - tw) / 2;
        if (pos[1] === 'r') x = canvas.width - tw - pad;
        if (pos[0] === 'b') y = canvas.height - pad;
        ctx.fillStyle = color === 'white' ? '#ffffff' : '#000000';
        ctx.strokeStyle = color === 'white' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)';
        ctx.lineWidth = Math.max(1, fontSize / 14);
        ctx.strokeText(label, x, y);
        ctx.fillText(label, x, y);
        ctx.globalAlpha = 1;
        const blob = await canvasToBlob(canvas, 'png');
        return {
          blob,
          name: withExtension(f.name, 'png', '-watermarked'),
          width: canvas.width,
          height: canvas.height,
          originalSize: f.size,
        };
      }),
    );
  };

  const positions: { key: Pos; label: string }[] = [
    { key: 'tl', label: t.posTL },
    { key: 'tc', label: t.posTC },
    { key: 'tr', label: t.posTR },
    { key: 'bl', label: t.posBL },
    { key: 'bc', label: t.posBC },
    { key: 'br', label: t.posBR },
  ];
  const inp = 'w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none';

  return (
    <ToolShell
      t={common}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-ink">{t.text}</span>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t.textPh} className={inp} maxLength={80} />
          </label>
          <div>
            <p className="mb-2 text-sm font-medium text-ink">{t.position}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {positions.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPos(p.key)}
                  title={p.label}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                    pos === p.key ? 'border-brand bg-brand-soft text-brand' : 'border-line text-muted hover:border-brand'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-ink">{t.color}</p>
            <div className="flex gap-2">
              {(['white', 'black'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`flex-1 rounded-lg border-2 px-3 py-2 text-xs font-medium ${
                    color === c ? 'border-brand' : 'border-line'
                  } ${c === 'white' ? 'bg-white text-ink' : 'bg-black text-white'}`}
                >
                  {c === 'white' ? t.white : t.black}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 flex justify-between text-sm font-medium text-ink">
              <span>{t.opacity}</span>
              <span className="text-brand">{opacity}%</span>
            </label>
            <input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="slider w-full" />
          </div>
          <div>
            <label className="mb-1 flex justify-between text-sm font-medium text-ink">
              <span>{t.size}</span>
              <span className="text-brand">{size}%</span>
            </label>
            <input type="range" min={2} max={15} value={size} onChange={(e) => setSize(Number(e.target.value))} className="slider w-full" />
          </div>
        </div>
      }
    />
  );
}
