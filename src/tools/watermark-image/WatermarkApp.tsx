import { useMemo, useRef, useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { drawScaled, canvasToBlob, withExtension, loadImage, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['watermark'];
  common: Dict['common'];
}

type Pos = 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br';

export default function WatermarkApp({ t, common }: Props) {
  const [wmMode, setWmMode] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('');
  const [pos, setPos] = useState<Pos>('br');
  const [opacity, setOpacity] = useState(60);
  const [size, setSize] = useState(5); // % of width
  const [color, setColor] = useState('#ffffff');
  const [logo, setLogo] = useState<LoadedImage | null>(null);
  const [logoSize, setLogoSize] = useState(20); // % of main image width
  const logoInput = useRef<HTMLInputElement>(null);

  const pickLogo = async (fl: FileList | null) => {
    const f = fl?.[0];
    if (!f) return;
    try {
      setLogo(await loadImage(f));
    } catch {
      /* ignore invalid files */
    }
  };

  const logoThumb = useMemo(() => {
    if (!logo) return '';
    const c = document.createElement('canvas');
    const s = Math.min(1, 96 / Math.max(logo.width, logo.height));
    c.width = Math.max(1, Math.round(logo.width * s));
    c.height = Math.max(1, Math.round(logo.height * s));
    c.getContext('2d')!.drawImage(logo.img, 0, 0, c.width, c.height);
    return c.toDataURL();
  }, [logo]);

  const place = (cw: number, ch: number, ww: number, wh: number, pad: number): [number, number] => {
    let x = pad;
    let y = pad;
    if (pos[1] === 'c') x = (cw - ww) / 2;
    if (pos[1] === 'r') x = cw - ww - pad;
    if (pos[0] === 'b') y = ch - wh - pad;
    return [x, y];
  };

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        const canvas = drawScaled(f.img, f.width, f.height);
        const ctx = canvas.getContext('2d')!;
        ctx.globalAlpha = opacity / 100;
        if (wmMode === 'image' && logo) {
          const lw = Math.max(8, Math.round((canvas.width * logoSize) / 100));
          const lh = Math.max(8, Math.round((lw / logo.width) * logo.height));
          const pad = Math.round(canvas.width * 0.03);
          const [x, y] = place(canvas.width, canvas.height, lw, lh, pad);
          ctx.drawImage(logo.img, x, y, lw, lh);
        } else {
          const label = text.trim() || t.textPh;
          const fontSize = Math.max(12, Math.round((canvas.width * size) / 100));
          ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
          const pad = fontSize * 0.8;
          const tw = ctx.measureText(label).width;
          const [x, y] = place(canvas.width, canvas.height, tw, fontSize, pad);
          ctx.fillStyle = color;
          ctx.strokeStyle = 'rgba(0,0,0,0.45)';
          ctx.lineWidth = Math.max(1, fontSize / 14);
          ctx.strokeText(label, x, y + fontSize * 0.8);
          ctx.fillText(label, x, y + fontSize * 0.8);
        }
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
      settingsInfo={t.info}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-2xl">
          <p className="mb-2 text-sm font-medium text-ink">{t.wmType}</p>
          <div className="mb-5 inline-flex rounded-full border border-line p-1">
            {(['text', 'image'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setWmMode(m)}
                className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                  wmMode === m ? 'bg-brand text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {m === 'text' ? t.wmText : t.wmImage}
              </button>
            ))}
          </div>

          {wmMode === 'text' ? (
            <div className="grid gap-5 sm:grid-cols-2">
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
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-8 w-12 cursor-pointer rounded border border-line bg-white p-0.5"
                  />
                  <span className="text-sm font-medium text-ink">{color.toUpperCase()}</span>
                </label>
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
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-medium text-ink">{t.uploadLogo}</p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => logoInput.current?.click()}
                    className="rounded-btn border-2 border-dashed border-line px-6 py-3 text-sm font-semibold text-muted transition-colors hover:border-brand hover:text-brand"
                  >
                    {t.uploadLogo}
                  </button>
                  {logo && (
                    <img
                      src={logoThumb}
                      alt=""
                      className="h-12 w-12 rounded-lg border border-line object-contain bg-white"
                    />
                  )}
                  <input
                    ref={logoInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      pickLogo(e.target.files);
                      e.target.value = '';
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted">{t.logoHint}</p>
              </div>
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
              <div className="space-y-5">
                <div>
                  <label className="mb-1 flex justify-between text-sm font-medium text-ink">
                    <span>{t.logoSize}</span>
                    <span className="text-brand">{logoSize}%</span>
                  </label>
                  <input type="range" min={5} max={50} value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} className="slider w-full" />
                </div>
                <div>
                  <label className="mb-1 flex justify-between text-sm font-medium text-ink">
                    <span>{t.opacity}</span>
                    <span className="text-brand">{opacity}%</span>
                  </label>
                  <input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="slider w-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
