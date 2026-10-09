import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['bgremove'];
  common: Dict['common'];
}

export default function BgRemoveApp({ t, common }: Props) {
  const [modelLoading, setModelLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  const ensureModel = async () => {
    if (modelReady) return;
    setModelLoading(true);
    try {
      // Preload the model so the progress UI shows during ToolShell's run
      const { preload } = await import('@imgly/background-removal');
      await preload();
      setModelReady(true);
    } finally {
      setModelLoading(false);
    }
  };

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    await ensureModel();
    const { removeBackground } = await import('@imgly/background-removal');
    return Promise.all(
      files.map(async (f) => {
        const blob = await removeBackground(f.blob);
        return {
          blob,
          name: withExtension(f.name, 'png', '-no-bg'),
          width: f.width,
          height: f.height,
          originalSize: f.size,
        };
      }),
    );
  };

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-lg text-center">
          {modelLoading && <p className="text-sm font-medium text-brand">{t.loadingModel}</p>}
        </div>
      }
    />
  );
}
