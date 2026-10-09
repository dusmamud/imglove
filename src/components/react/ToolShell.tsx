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
  actionLabel: string;
  process: (files: LoadedImage[]) => Promise<ProcessedImage[]>;
}

function Thumb({ img }: { img: HTMLImageElement }) {
  const url = useMemo(() => {
    const c = drawScaled(img, Math.min(160, img.naturalWidth), (Math.min(160, img.naturalWidth) / img.naturalWidth) * img.naturalHeight);
    return c.toDataURL('image/jpeg', 0.7);
  }, [img]);
  return <img src={url} alt="" className="h-20 w-20 rounded-lg border border-line object-cover" />;
}

function ResultThumb({ blob }: { blob: Blob }) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);
  return <img src={url} alt="" className="h-20 w-20 rounded-lg border border-line object-cover" />;
}

export default function ToolShell({ t, settings, actionLabel, process }: Props) {
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
        <div>
          <div className="rounded-card border border-line bg-white p-4 sm:p-6">
            <div className="flex flex-wrap gap-3">
              {files.map((f, i) => (
                <div key={i} className="relative">
                  <Thumb img={f.img} />
                  <button
                    type="button"
                    aria-label="remove"
                    onClick={() => {
                      const next = files.filter((_, j) => j !== i);
                      setFiles(next);
                      if (!next.length) setPhase('idle');
                    }}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line text-muted transition-colors hover:border-brand hover:text-brand"
              >
                <Plus size={20} />
                <span className="text-[10px]">{t.addMore}</span>
              </button>
            </div>
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

            <div className="mt-6 border-t border-line pt-6">
              {typeof settings === 'function' ? settings(files) : settings}
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                disabled={phase === 'working' || !files.length}
                onClick={run}
                className="w-full rounded-lg bg-brand px-12 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
              >
                {phase === 'working' ? t.processing : `${actionLabel} ${files.length > 1 ? `(${files.length})` : ''}`}
              </button>
              <div>
                <button type="button" onClick={reset} className="mt-3 text-sm text-muted underline hover:text-ink">
                  {t.startOver}
                </button>
              </div>
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
