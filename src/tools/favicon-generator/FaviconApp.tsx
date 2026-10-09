import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { createCanvas, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['favicon'];
  common: Dict['common'];
}

const SIZES = [16, 32, 48, 180, 192, 512];

export default function FaviconApp({ t, common }: Props) {
  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    const out: ProcessedImage[] = [];
    for (const f of files) {
      // Use the largest square crop centered on the image
      const side = Math.min(f.width, f.height);
      const sx = Math.floor((f.width - side) / 2);
      const sy = Math.floor((f.height - side) / 2);
      for (const size of SIZES) {
        const c = createCanvas(size, size);
        const ctx = c.getContext('2d')!;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(f.img, sx, sy, side, side, 0, 0, size, size);
        const blob = await canvasToBlob(c, 'png');
        out.push({
          blob,
          name: withExtension(f.name, 'png', `-${size}x${size}`),
          width: size,
          height: size,
          originalSize: f.size,
        });
      }
    }
    return out;
  };

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-lg text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SIZES.map((s) => (
              <span key={s} className="rounded-lg bg-brand-soft px-3 py-1.5 text-sm font-bold text-brand">
                {s}×{s}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">PNG</p>
        </div>
      }
    />
  );
}
