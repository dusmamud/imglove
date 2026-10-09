import { useRef, useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import { downloadBlob } from '../../engine/image';

interface Props {
  t: Dict['htmlimg'];
  common: Dict['common'];
}

export default function HtmlImgApp({ t, common }: Props) {
  const [html, setHtml] = useState(t.htmlPh);
  const [width, setWidth] = useState(800);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const renderRef = useRef<HTMLDivElement>(null);

  const render = async () => {
    if (!html.trim()) return;
    setWorking(true);
    setError('');
    setImgUrl(null);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const el = renderRef.current!;
      // Set the HTML content
      el.innerHTML = html;
      el.style.width = `${width}px`;
      // Wait a tick for layout
      await new Promise((r) => setTimeout(r, 100));
      const canvas = await html2canvas(el, {
        width,
        windowWidth: width,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
      if (!blob) throw new Error('render failed');
      setImgUrl(URL.createObjectURL(blob));
      (render as any)._blob = blob;
    } catch {
      setError(common.errorGeneric);
    } finally {
      setWorking(false);
    }
  };

  const download = async () => {
    const blob = (render as any)._blob as Blob | undefined;
    if (blob) downloadBlob(blob, 'imglove-html.png');
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {error && (
        <div className="mb-4 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="space-y-4">
        <section className="rounded-card border border-line bg-white p-4 sm:p-6">
          <h2 className="mb-1 text-base font-semibold text-ink">{common.settings}</h2>
          <p className="mb-4 rounded-lg bg-brand-soft/50 px-3 py-2 text-xs text-muted">{t.info}</p>

          <label className="mb-2 block text-sm font-semibold text-ink">HTML</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={8}
            spellCheck={false}
            className="w-full rounded-lg border border-line bg-gray-50 px-3 py-2 font-mono text-xs text-ink focus:border-brand focus:outline-none"
            placeholder={t.htmlPh}
          />

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-ink">{t.width}</label>
              <span className="rounded-lg bg-brand-soft px-3 py-1 text-sm font-bold text-brand">{width}px</span>
            </div>
            <input
              type="range"
              min={320}
              max={1920}
              step={10}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>
        </section>

        <div className="text-center">
          <button
            type="button"
            onClick={render}
            disabled={working || !html.trim()}
            className="rounded-btn bg-brand px-10 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {working ? common.processing : t.renderBtn}
          </button>
        </div>

        {imgUrl && (
          <section className="rounded-card border border-line bg-white p-4 sm:p-6">
            <div className="mb-4 overflow-hidden rounded-lg border border-line bg-gray-50">
              <img src={imgUrl} alt="Rendered HTML" className="mx-auto max-w-full" />
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={download}
                className="rounded-btn bg-brand px-10 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
              >
                {t.downloadImg}
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Hidden render target */}
      <div className="pointer-events-none absolute left-[-9999px] top-0" aria-hidden="true">
        <div ref={renderRef} />
      </div>
    </div>
  );
}
