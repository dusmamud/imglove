import { useMemo, useRef, useState } from 'react';
import { DownloadSimple, ArrowCounterClockwise, Plus, CheckCircle } from '@phosphor-icons/react';
import type { Dict } from '../../i18n/dicts';
import { loadImage, isImageFile, formatBytes, drawScaled, downloadBlob, type LoadedImage } from '../../engine/image';
import Dropzone from './Dropzone';

export interface ProcessedImage {
  blob: Blob;
  name: string;
  width: number;
  height: number;
  originalSize: number;
  note?: string;
}

interface Props {
  t: Dict['common'];
  settings: React.ReactNode | ((files: LoadedImage[]) => React.ReactNode);
  settingsInfo?: string;
  actionLabel: string;
  process: (files: LoadedImage[]) => Promise<ProcessedImage[]>;
}

function Thumb({ img, size = 'h-20 w-20' }: { img: HTMLImageElement; size?: string }) {
  const url = useMemo(() => {
    const c = drawScaled(img, Math.min(160, img.naturalWidth), (Math.min(160, img.naturalWidth) / img.naturalWidth) * img.naturalHeight);
    return c.toDataURL('image/jpeg', 0.7);
  }, [img]);
  return <img src={url} alt="" className={`${size} shrink-0 rounded-lg border border-line object-cover`} />;
}

function ResultThumb({ blob }: { blob: Blob }) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);
  return <img src={url} alt="" className="h-20 w-20 rounded-lg border border-line object-cover" />;
}

export default function ToolShell({ t, settings, settingsInfo, actionLabel, process }: Props) {
  const [files, setFiles] = useState<LoadedImage[]>([]);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [phase, setPhase] = useState<'idle' | 'ready' | 'working' | 'done'>('idle');
  const [error, setError] = useState('');
  const [busyNote, setBusyNote] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (incoming: File[]) => {
    setError('');
    const valid = incoming.filter(isImageFile);
    if (!valid.length) {
      setError(t.errorType);
      return;
    }
    setBusyNote(t.processing);
    try {
      const loaded = await Promise.all(valid.map(loadImage));
      setFiles((prev) => [...prev, ...loaded]);
      setPhase('ready');
      setResults([]);
    } catch {
      setError(t.errorGeneric);
    } finally {
      setBusyNote('');
    }
  };

  const run = async () => {
    if (!files.length) return;
    setPhase('working');
    setError('');
    try {
      const out = await process(files);
      setResults(out);
      setPhase('done');
    } catch {
      setError(t.errorGeneric);
      setPhase('ready');
    }
  };

  const reset = () => {
    setFiles([]);
    setResults([]);
    setPhase('idle');
    setError('');
  };

  const downloadAll = async () => {
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    results.forEach((r, i) => zip.file(r.name || `image-${i + 1}`, r.blob));
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, 'imglove-results.zip');
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {error && (
        <div className="mb-4 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {phase === 'idle' && !busyNote && <Dropzone t={t} onFiles={addFiles} />}
      {busyNote && phase === 'idle' && (
        <div className="rounded-card border border-line bg-white px-6 py-16 text-center text-muted">{busyNote}</div>
      )}

      {(phase === 'ready' || phase === 'working') && (
        <div className="space-y-4">
          {/* Files card — filename, dimensions and real size per file */}
          <section className="rounded-card border border-line bg-white p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-ink">
                {files.length} {files.length === 1 ? t.image : t.images}
                <span className="ml-2 text-sm font-normal text-muted">
                  {formatBytes(files.reduce((s, f) => s + f.size, 0))}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                title={t.addMore}
                className="flex items-center gap-1.5 rounded-btn border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
              >
                <Plus size={16} weight="bold" />
                {t.addMore}
              </button>
            </div>
            <ul className="space-y-3">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center gap-4 rounded-xl border border-line bg-soft/60 p-3"
                >
                  <Thumb img={f.img} size="h-20 w-20" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink" title={f.name}>
                      {f.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {f.width} × {f.height} {t.pixels} · {formatBytes(f.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="remove"
                    title={t.remove}
                    onClick={() => {
                      const next = files.filter((_, j) => j !== i);
                      setFiles(next);
                      if (!next.length) setPhase('idle');
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white hover:text-red-600"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,.heic,.heif"
              multiple
              className="hidden"
              onChange={(e) => {
                const fl = Array.from(e.target.files || []);
                if (fl.length) addFiles(fl);
                e.target.value = '';
              }}
            />
          </section>

          {/* Settings card */}
          <section className="rounded-card border border-line bg-white p-4 sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-ink">{t.settings}</h2>
            {settingsInfo && (
              <p className="mb-5 rounded-lg bg-brand-soft px-4 py-3 text-sm leading-relaxed text-ink">
                {settingsInfo}
              </p>
            )}
            {typeof settings === 'function' ? settings(files) : settings}
          </section>

          {/* Action */}
          <div className="text-center">
            <button
              type="button"
              disabled={phase === 'working' || !files.length}
              onClick={run}
              className="w-full rounded-lg bg-brand px-12 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto sm:min-w-72"
            >
              {phase === 'working' ? t.processing : `${actionLabel}${files.length > 1 ? ` (${files.length})` : ''}`}
            </button>
            <div>
              <button type="button" onClick={reset} className="mt-3 text-sm text-muted underline hover:text-ink">
                {t.startOver}
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="rounded-card border border-line bg-white p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">
            <CheckCircle size={24} className="text-green-600" weight="fill" />
            {results.length} {results.length === 1 ? t.image : t.images}
          </div>
          <ul className="divide-y divide-line">
            {results.map((r, i) => (
              <li key={i} className="flex items-center gap-4 py-3">
                <ResultThumb blob={r.blob} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{r.name}</p>
                  <p className="text-xs text-muted">
                    {r.width} × {r.height} px · {formatBytes(r.originalSize)} → {formatBytes(r.blob.size)}
                    {r.note ? ` · ${r.note}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadBlob(r.blob, r.name)}
                  className="flex items-center gap-1.5 rounded-btn bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  <DownloadSimple size={16} weight="bold" />
                  {t.download}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {results.length > 1 && (
              <button
                type="button"
                onClick={downloadAll}
                className="rounded-btn bg-ink px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                {t.downloadAll} (.zip)
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 rounded-btn border border-line px-8 py-3 text-sm font-semibold text-ink hover:bg-soft"
            >
              <ArrowCounterClockwise size={16} />
              {t.startOver}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
