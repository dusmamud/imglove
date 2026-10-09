import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { createCanvas, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['split'];
  common: Dict['common'];
}

export default function SplitApp({ t, common }: Props) {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    const out: ProcessedImage[] = [];
    for (const f of files) {
      const tw = Math.floor(f.width / cols);
      const th = Math.floor(f.height / rows);
      for (let r = 0; r < rows; r++) {
        for (let cIdx = 0; cIdx < cols; cIdx++) {
          const w = cIdx === cols - 1 ? f.width - tw * (cols - 1) : tw;
          const h = r === rows - 1 ? f.height - th * (rows - 1) : th;
          const c = createCanvas(w, h);
          const ctx = c.getContext('2d')!;
          ctx.drawImage(f.img, cIdx * tw, r * th, w, h, 0, 0, w, h);
          const blob = await canvasToBlob(c, 'png');
          out.push({
            blob,
            name: withExtension(f.name, 'png', `-tile-r${r + 1}c${cIdx + 1}`),
            width: w,
            height: h,
            originalSize: f.size,
          });
        }
      }
    }
    return out;
  };

  const numCls =
    'w-24 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none';

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-lg">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              {t.rows}
              <input
                type="number"
                min={1}
                max={10}
                value={rows}
                onChange={(e) => setRows(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                className={numCls}
              />
            </label>
            <span className="text-lg font-bold text-muted">×</span>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              {t.cols}
              <input
                type="number"
                min={1}
                max={10}
                value={cols}
                onChange={(e) => setCols(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                className={numCls}
              />
            </label>
          </div>
          <p className="mt-3 text-xs text-muted">
            {rows} × {cols} = {rows * cols} tiles
          </p>
        </div>
      }
    />
  );
}
