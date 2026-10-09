import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import {
  drawScaled, canvasToBlob, withExtension, quantize, pngQualityToColors,
  type LoadedImage, type OutFormat, FORMAT_META,
} from '../../engine/image';

interface Props {
  t: Dict['compress'];
  common: Dict['common'];
}

function detectFormat(f: LoadedImage): OutFormat {
  const ty = f.type.toLowerCase();
  if (ty.includes('png')) return 'png';
  if (ty.includes('webp')) return 'webp';
  return 'jpeg';
}

export default function CompressApp({ t, common }: Props) {
  const [quality, setQuality] = useState(80);

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        const format = detectFormat(f);
        const canvas = drawScaled(f.img, f.width, f.height, {
          background: format === 'jpeg' ? '#ffffff' : undefined,
        });
        if (format === 'png') {
          // PNG ignores the encoder quality param — drive real compression via palette reduction
          const colors = pngQualityToColors(quality);
          if (colors > 0) {
            const ctx = canvas.getContext('2d')!;
            const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.putImageData(quantize(id, colors), 0, 0);
          }
        }
        const blob = await canvasToBlob(canvas, format, quality / 100);
        // Never emit a bigger file than the input: if compression didn't help,
        // return the original file instead of a larger "compressed" one.
        const useOriginal = blob.size >= f.size;
        const finalBlob = useOriginal ? f.blob : blob;
        const saved = Math.max(0, Math.round((1 - finalBlob.size / f.size) * 100));
        return {
          blob: finalBlob,
          name: useOriginal ? f.name : withExtension(f.name, FORMAT_META[format].ext),
          width: useOriginal ? f.width : canvas.width,
          height: useOriginal ? f.height : canvas.height,
          originalSize: f.size,
          note: `${saved}% ${t.saved}`,
        };
      }),
    );
  };

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.compressMore}
      process={process}
      settings={
        <div className="mx-auto max-w-md">
          <div className="mb-3 flex items-center justify-between">
            <label htmlFor="compress-quality" className="text-sm font-semibold text-ink">
              {t.qualityLabel}
            </label>
            <span className="rounded-full bg-brand px-3 py-1 text-sm font-bold text-white">{quality}%</span>
          </div>
          <input
            id="compress-quality"
            type="range"
            min={10}
            max={100}
            step={1}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="slider w-full"
            aria-label={t.qualityLabel}
          />
          <div className="mt-2 flex justify-between text-xs font-medium text-muted">
            <span>{t.qualityLow}</span>
            <span>{t.qualityHigh}</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">{t.qualityHint}</p>
        </div>
      }
    />
  );
}
