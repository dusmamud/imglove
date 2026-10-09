import { useMemo, useRef, useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { createCanvas, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['crop'];
  common: Dict['common'];
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const PRESETS: { key: 'free' | 'square' | 'wide' | 'classic' | 'portrait'; ratio: number | null }[] = [
  { key: 'free', ratio: null },
  { key: 'square', ratio: 1 },
  { key: 'wide', ratio: 16 / 9 },
  { key: 'classic', ratio: 4 / 3 },
  { key: 'portrait', ratio: 3 / 4 },
];

function CropSelector({
  img,
  t,
  common,
  onChange,
}: {
  img: HTMLImageElement;
  t: Dict['crop'];
  common: Dict['common'];
  onChange: (box: Box | null, dispW: number, dispH: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ sx: number; sy: number } | null>(null);
  const [box, setBoxState] = useState<Box | null>(null);
  const [preset, setPresetState] = useState<number | null>(null);
  const [disp, setDisp] = useState({ w: 1, h: 1 });

  const url = useMemo(() => {
    const c = document.createElement('canvas');
    const s = Math.min(1, 720 / Math.max(img.naturalWidth, img.naturalHeight));
    c.width = Math.max(1, Math.round(img.naturalWidth * s));
    c.height = Math.max(1, Math.round(img.naturalHeight * s));
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.8);
  }, [img]);

  const setBox = (b: Box | null) => {
    setBoxState(b);
    onChange(b, disp.w, disp.h);
  };

  const applyPreset = (ratio: number | null) => {
    setPresetState(ratio);
    if (ratio == null) {
      setBox(null);
      return;
    }
    let w = disp.w * 0.8;
    let h = w / ratio;
    if (h > disp.h * 0.8) {
      h = disp.h * 0.8;
      w = h * ratio;
    }
    setBox({ x: (disp.w - w) / 2, y: (disp.h - h) / 2, w, h });
  };

  const pos = (e: React.PointerEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(r.width, e.clientX - r.left)),
      y: Math.max(0, Math.min(r.height, e.clientY - r.top)),
    };
  };
  const onDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const p = pos(e);
    dragRef.current = { sx: p.x, sy: p.y };
    setBox({ x: p.x, y: p.y, w: 0, h: 0 });
  };
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const p = pos(e);
    let w = p.x - d.sx;
    let h = p.y - d.sy;
    if (preset) {
      if (Math.abs(w) / preset >= Math.abs(h)) h = (Math.abs(w) / preset) * Math.sign(h || w || 1);
      else w = Math.abs(h) * preset * Math.sign(w || h || 1);
    }
    setBox({ x: w < 0 ? d.sx + w : d.sx, y: h < 0 ? d.sy + h : d.sy, w: Math.abs(w), h: Math.abs(h) });
  };

  const labels: Record<string, string> = {
    free: t.free,
    square: t.square,
    wide: t.wide,
    classic: t.classic,
    portrait: t.portrait,
  };

  // Numeric crop options in real pixels (like iloveimg's Width/Height/Position X/Y)
  const scale = disp.w > 0 ? img.naturalWidth / disp.w : 1;
  const toReal = (v: number) => Math.max(0, Math.round(v * scale));
  const toDisp = (v: number) => v / scale;
  const numCls =
    'w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none';

  const setRealBox = (rx: number, ry: number, rw: number, rh: number) => {
    // typing exact numbers breaks any aspect preset -> free mode
    setPresetState(null);
    const dw = disp.w;
    const dh = disp.h;
    const w = Math.max(0, Math.min(dw, toDisp(rw)));
    const h = Math.max(0, Math.min(dh, toDisp(rh)));
    const x = Math.max(0, Math.min(dw - w, toDisp(rx)));
    const y = Math.max(0, Math.min(dh - h, toDisp(ry)));
    setBox({ x, y, w, h });
  };

  const real = box
    ? { x: toReal(box.x), y: toReal(box.y), w: toReal(box.w), h: toReal(box.h) }
    : { x: 0, y: 0, w: 0, h: 0 };

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-2 text-sm font-medium text-ink">{t.aspect}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => applyPreset(p.ratio)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              preset === p.ratio
                ? 'border-brand bg-brand-soft text-brand'
                : 'border-line text-muted hover:border-brand hover:text-brand'
            }`}
          >
            {labels[p.key]}
          </button>
        ))}
      </div>
      <div
        ref={wrapRef}
        className="relative mx-auto block w-fit touch-none select-none overflow-hidden rounded-lg border border-line bg-soft"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => (dragRef.current = null)}
      >
        <img
          src={url}
          alt=""
          draggable={false}
          className="block max-h-[420px] w-auto max-w-full"
          onLoad={(e) => {
            const el = e.currentTarget;
            const d = { w: el.clientWidth, h: el.clientHeight };
            setDisp(d);
          }}
        />
        {box && box.w > 4 && box.h > 4 && (
          <div
            className="pointer-events-none absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
            style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
          />
        )}
      </div>
      {(!box || box.w <= 4) && <p className="mt-2 text-center text-xs text-muted">{t.hint}</p>}
      {box && box.w > 4 && box.h > 4 && (
        <div className="mx-auto mt-4 grid max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-xs text-muted">
              {common.width} ({common.pixels})
            </span>
            <input
              type="number"
              min={1}
              max={img.naturalWidth}
              value={real.w}
              onChange={(e) => setRealBox(real.x, real.y, Number(e.target.value) || 1, real.h)}
              className={numCls}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-muted">
              {common.height} ({common.pixels})
            </span>
            <input
              type="number"
              min={1}
              max={img.naturalHeight}
              value={real.h}
              onChange={(e) => setRealBox(real.x, real.y, real.w, Number(e.target.value) || 1)}
              className={numCls}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-muted">{t.posX} ({common.pixels})</span>
            <input
              type="number"
              min={0}
              max={img.naturalWidth}
              value={real.x}
              onChange={(e) => setRealBox(Number(e.target.value) || 0, real.y, real.w, real.h)}
              className={numCls}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-muted">{t.posY} ({common.pixels})</span>
            <input
              type="number"
              min={0}
              max={img.naturalHeight}
              value={real.y}
              onChange={(e) => setRealBox(real.x, Number(e.target.value) || 0, real.w, real.h)}
              className={numCls}
            />
          </label>
        </div>
      )}
    </div>
  );
}

export default function CropApp({ t, common }: Props) {
  const cropRef = useRef<{ box: Box | null; dw: number; dh: number }>({ box: null, dw: 1, dh: 1 });

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    const { box, dw, dh } = cropRef.current;
    if (!box || box.w < 2 || box.h < 2) throw new Error('Draw a crop area first');
    return Promise.all(
      files.map(async (f) => {
        const sx = f.width / dw;
        const sy = f.height / dh;
        const sw = Math.max(1, Math.round(box.w * sx));
        const sh = Math.max(1, Math.round(box.h * sy));
        const ox = Math.min(f.width - 1, Math.round(box.x * sx));
        const oy = Math.min(f.height - 1, Math.round(box.y * sy));
        const c = createCanvas(sw, sh);
        c.getContext('2d')!.drawImage(f.img, ox, oy, sw, sh, 0, 0, sw, sh);
        const blob = await canvasToBlob(c, 'png');
        return {
          blob,
          name: withExtension(f.name, 'png', '-cropped'),
          width: sw,
          height: sh,
          originalSize: f.size,
        };
      }),
    );
  };

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.cropBtn}
      process={process}
      settings={(files) =>
        files.length > 0 ? (
          <CropSelector
            img={files[0].img}
            t={t}
            common={common}
            onChange={(b, dw, dh) => (cropRef.current = { box: b, dw, dh })}
          />
        ) : null
      }
    />
  );
}
