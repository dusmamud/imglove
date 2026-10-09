import { useRef, useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import Dropzone from '../../components/react/Dropzone';
import { loadImage, isImageFile, formatBytes, downloadBlob, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['pdf'];
  common: Dict['common'];
}

type PageSize = 'a4' | 'letter' | 'fit';
type Orientation = 'auto' | 'portrait' | 'landscape';

const PAGE_DIMS: Record<'a4' | 'letter', [number, number]> = {
  a4: [210, 297],
  letter: [216, 279],
};

export default function PdfApp({ t, common }: Props) {
  const [files, setFiles] = useState<LoadedImage[]>([]);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('auto');
  const [working, setWorking] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (incoming: File[]) => {
    setError('');
    const valid = incoming.filter(isImageFile);
    if (!valid.length) {
      setError(common.errorType);
      return;
    }
    try {
      const loaded = await Promise.all(valid.map(loadImage));
      setFiles((prev) => [...prev, ...loaded]);
      setThumbs((prev) => [...prev, ...loaded.map((f) => URL.createObjectURL(f.blob))]);
      setPdfUrl(null);
      setPdfBlob(null);
    } catch {
      setError(common.errorGeneric);
    }
  };

  const createPdf = async () => {
    if (!files.length) return;
    setWorking(true);
    setError('');
    try {
      const { jsPDF } = await import('jspdf');
      let doc: any = null;
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const img = f.img;
        let pw: number;
        let ph: number;
        let orient: 'p' | 'l';
        if (pageSize === 'fit') {
          // Page matches image aspect ratio (in mm, scaled)
          const scale = 1;
          pw = (img.width / 96) * 25.4 * scale;
          ph = (img.height / 96) * 25.4 * scale;
          orient = pw >= ph ? 'l' : 'p';
        } else {
          const [w, h] = PAGE_DIMS[pageSize];
          const wantLandscape =
            orientation === 'landscape' || (orientation === 'auto' && img.width > img.height);
          orient = wantLandscape ? 'l' : 'p';
          pw = orient === 'l' ? Math.max(w, h) : Math.min(w, h);
          ph = orient === 'l' ? Math.min(w, h) : Math.max(w, h);
        }
        if (i === 0) {
          doc = new jsPDF({ orientation: orient, unit: 'mm', format: pageSize === 'fit' ? [pw, ph] : pageSize });
        } else {
          doc.addPage(pageSize === 'fit' ? [pw, ph] : pageSize, orient);
        }
        // Draw image centered, fit within page with small margin
        const margin = pageSize === 'fit' ? 0 : 10;
        const availW = pw - margin * 2;
        const availH = ph - margin * 2;
        const imgRatio = img.width / img.height;
        let dw = availW;
        let dh = dw / imgRatio;
        if (dh > availH) {
          dh = availH;
          dw = dh * imgRatio;
        }
        const dx = (pw - dw) / 2;
        const dy = (ph - dh) / 2;
        // Convert image to data URL
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        c.getContext('2d')!.drawImage(img, 0, 0);
        const dataUrl = c.toDataURL('image/jpeg', 0.92);
        doc.addImage(dataUrl, 'JPEG', dx, dy, dw, dh);
      }
      const blob = doc.output('blob');
      setPdfBlob(blob);
      setPdfUrl(URL.createObjectURL(blob));
    } catch {
      setError(common.errorGeneric);
    } finally {
      setWorking(false);
    }
  };

  const download = () => {
    if (pdfBlob) downloadBlob(pdfBlob, 'imglove-images.pdf');
  };

  const radio =
    'flex cursor-pointer items-center gap-2 rounded-card border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors has-checked:border-brand has-checked:bg-brand-soft has-checked:text-brand';

  return (
    <div className="mx-auto w-full max-w-4xl">
      {error && (
        <div className="mb-4 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {files.length === 0 && <Dropzone t={common} onFiles={addFiles} />}

      {files.length > 0 && (
        <div className="space-y-4">
          <section className="rounded-card border border-line bg-white p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-ink">
                {files.length} {files.length === 1 ? common.image : common.images}
                <span className="ml-2 text-sm font-normal text-muted">
                  {formatBytes(files.reduce((s, f) => s + f.size, 0))}
                </span>
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-btn border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
                >
                  {common.addMore}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFiles([]);
                    setThumbs([]);
                    setPdfUrl(null);
                    setPdfBlob(null);
                  }}
                  className="rounded-btn border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink"
                >
                  {common.reset}
                </button>
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addFiles(Array.from(e.target.files));
                e.target.value = '';
              }}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {files.map((f, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-line">
                  <img src={thumbs[i]} alt={f.name} className="h-24 w-full object-cover" />
                  <p className="truncate px-2 py-1 text-xs text-muted">{f.name}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-card border border-line bg-white p-4 sm:p-6">
            <h2 className="mb-1 text-base font-semibold text-ink">{common.settings}</h2>
            <p className="mb-4 rounded-lg bg-brand-soft/50 px-3 py-2 text-xs text-muted">{t.info}</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-ink">{t.pageSize}</p>
                <div className="flex flex-wrap gap-2">
                  {(['a4', 'letter', 'fit'] as PageSize[]).map((ps) => (
                    <label key={ps} className={radio}>
                      <input
                        type="radio"
                        name="pagesize"
                        checked={pageSize === ps}
                        onChange={() => setPageSize(ps)}
                        className="accent-brand"
                      />
                      {ps.toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-ink">{t.orientation}</p>
                <div className="flex flex-wrap gap-2">
                  {(['auto', 'portrait', 'landscape'] as Orientation[]).map((o) => (
                    <label key={o} className={radio}>
                      <input
                        type="radio"
                        name="orient"
                        checked={orientation === o}
                        onChange={() => setOrientation(o)}
                        className="accent-brand"
                      />
                      {o === 'auto' ? t.auto : o === 'portrait' ? t.portrait : t.landscape}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
              <input type="checkbox" checked disabled className="h-5 w-5 accent-brand" />
              {t.fitPage}
            </label>
          </section>

          <div className="text-center">
            {!pdfUrl ? (
              <button
                type="button"
                onClick={createPdf}
                disabled={working}
                className="rounded-btn bg-brand px-10 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
              >
                {working ? common.processing : t.createBtn}
              </button>
            ) : (
              <button
                type="button"
                onClick={download}
                className="rounded-btn bg-brand px-10 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-dark"
              >
                {t.downloadPdf}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
