import { useRef, useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import type { Dict } from '../../i18n/dicts';

interface Props {
  t: Dict['common'];
  onFiles: (files: File[]) => void;
}

export default function Dropzone({ t, onFiles }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) onFiles(files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className="relative px-4 py-10 text-center sm:py-14"
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-10 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-dark sm:w-auto"
      >
        <Plus size={22} weight="bold" />
        {t.selectImages}
      </button>
      <p className="mt-4 text-sm text-muted">{t.dropSub} {t.dropTitle.toLowerCase()}</p>
      <p className="mt-2 text-xs text-muted">{t.supported}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) onFiles(files);
          e.target.value = '';
        }}
      />
      {dragOver && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-brand/90 p-6">
          <p className="rounded-xl border-4 border-dashed border-white px-10 py-8 text-2xl font-semibold text-white">
            {t.dropTitle}
          </p>
        </div>
      )}
    </div>
  );
}
