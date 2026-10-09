import { useRef, useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import Dropzone from '../../components/react/Dropzone';
import { loadImage, isImageFile, formatBytes, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['ocr'];
  common: Dict['common'];
}

const LANGS = [
  { code: 'eng', label: 'English' },
  { code: 'hin', label: 'हिन्दी' },
  { code: 'eng+hin', label: 'English + हिन्दी' },
  { code: 'spa', label: 'Español' },
  { code: 'fra', label: 'Français' },
  { code: 'deu', label: 'Deutsch' },
  { code: 'ara', label: 'العربية' },
  { code: 'chi_sim', label: '中文' },
];

export default function OcrApp({ t, common }: Props) {
  const [file, setFile] = useState<LoadedImage | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const [lang, setLang] = useState('eng');
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFile = async (incoming: File[]) => {
    setError('');
    const valid = incoming.filter(isImageFile);
    if (!valid.length) {
      setError(common.errorType);
      return;
    }
    try {
      const loaded = await loadImage(valid[0]);
      setFile(loaded);
      setThumb(URL.createObjectURL(loaded.blob));
      setText(null);
    } catch {
      setError(common.errorGeneric);
    }
  };

  const extract = async () => {
    if (!file) return;
    setWorking(true);
    setError('');
    setText(null);
    setProgress(0);
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker(lang, undefined, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100));
        },
      });
      const { data } = await worker.recognize(file.blob);
      await worker.terminate();
      const out = data.text.trim();
      setText(out || t.noText);
    } catch {
      setError(common.errorGeneric);
    } finally {
      setWorking(false);
    }
  };

  const copy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be unavailable; ignore
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {error && (
        <div className="mb-4 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {!file && <Dropzone t={common} onFiles={addFile} />}

      {file && (
        <div className="space-y-4">
          <section className="rounded-card border border-line bg-white p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-ink">
                {file.name}
                <span className="ml-2 text-sm font-normal text-muted">
                  {file.width}×{file.height} · {formatBytes(file.size)}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setThumb(null);
                  setText(null);
                }}
                className="rounded-btn border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink"
              >
                {common.reset}
              </button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addFile(Array.from(e.target.files));
                e.target.value = '';
              }}
            />
            {thumb && (
              <img src={thumb} alt={file.name} className="mx-auto max-h-64 rounded-lg border border-line object-contain" />
            )}
          </section>

          <section className="rounded-card border border-line bg-white p-4 sm:p-6">
            <h2 className="mb-1 text-base font-semibold text-ink">{common.settings}</h2>
            <p className="mb-4 rounded-lg bg-brand-soft/50 px-3 py-2 text-xs text-muted">{t.info}</p>
            <label className="mb-2 block text-sm font-semibold text-ink">{t.language}</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </section>

          <div className="text-center">
            <button
              type="button"
              onClick={extract}
              disabled={working}
              className="rounded-btn bg-brand px-10 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              {working ? `${common.processing} ${progress}%` : t.extractBtn}
            </button>
            {working && (
              <div className="mx-auto mt-3 h-2 max-w-md overflow-hidden rounded-full bg-line">
                <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>

          {text !== null && (
            <section className="rounded-card border border-line bg-white p-4 sm:p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-ink">{t.extractBtn}</h2>
                <button
                  type="button"
                  onClick={copy}
                  className="rounded-btn border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
                >
                  {copied ? '✓' : t.copyText}
                </button>
              </div>
              <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 font-mono text-sm text-ink">
                {text}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
