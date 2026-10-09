import { useState } from 'react';
import { ArrowCounterClockwise, ArrowClockwise, FlipHorizontal, FlipVertical } from '@phosphor-icons/react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { createCanvas, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['rotate'];
  common: Dict['common'];
}

export default function RotateApp({ t, common }: Props) {
  const [deg, setDeg] = useState(0); // 0 | 90 | 180 | 270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        const swap = deg === 90 || deg === 270;
        const c = createCanvas(swap ? f.height : f.width, swap ? f.width : f.height);
        const ctx = c.getContext('2d')!;
        ctx.translate(c.width / 2, c.height / 2);
        ctx.rotate((deg * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(f.img, -f.width / 2, -f.height / 2);
        const blob = await canvasToBlob(c, 'png');
        return {
          blob,
          name: withExtension(f.name, 'png', '-rotated'),
          width: c.width,
          height: c.height,
          originalSize: f.size,
        };
      }),
    );
  };

  const btn =
    'flex flex-col items-center gap-1.5 rounded-card border border-line px-4 py-3 text-xs font-medium text-ink transition-colors hover:border-brand hover:text-brand';

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-lg">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button type="button" className={btn} onClick={() => setDeg((d) => (d + 270) % 360)}>
              <ArrowCounterClockwise size={26} />
              {t.left}
            </button>
            <button type="button" className={btn} onClick={() => setDeg((d) => (d + 90) % 360)}>
              <ArrowClockwise size={26} />
              {t.right}
            </button>
            <button
              type="button"
              className={`${btn} ${flipH ? 'border-brand bg-brand-soft text-brand' : ''}`}
              onClick={() => setFlipH((v) => !v)}
            >
              <FlipHorizontal size={26} />
              {t.flipH}
            </button>
            <button
              type="button"
              className={`${btn} ${flipV ? 'border-brand bg-brand-soft text-brand' : ''}`}
              onClick={() => setFlipV((v) => !v)}
            >
              <FlipVertical size={26} />
              {t.flipV}
            </button>
          </div>
          {(deg !== 0 || flipH || flipV) && (
            <button
              type="button"
              onClick={() => {
                setDeg(0);
                setFlipH(false);
                setFlipV(false);
              }}
              className="mt-3 text-sm text-muted underline hover:text-ink"
            >
              {common.reset}
            </button>
          )}
        </div>
      }
    />
  );
}
