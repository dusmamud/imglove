/** Tool registry: slugs + Phosphor icon names. Names/descriptions live in i18n dicts. */

export interface ToolDef {
  slug: string;
  /** Phosphor icon name for astro-icon (ph set), e.g. "crop" */
  icon: string;
}

export const tools: ToolDef[] = [
  { slug: 'compress-image', icon: 'file-archive' },
  { slug: 'resize-image', icon: 'arrows-out' },
  { slug: 'crop-image', icon: 'crop' },
  { slug: 'convert-image', icon: 'arrows-left-right' },
  { slug: 'rotate-image', icon: 'arrow-clockwise' },
  { slug: 'watermark-image', icon: 'stamp' },
  { slug: 'meme-generator', icon: 'smiley' },
  { slug: 'photo-editor', icon: 'sliders-horizontal' },
  { slug: 'upscale-image', icon: 'magnifying-glass-plus' },
  { slug: 'blur-image', icon: 'eye-slash' },
  { slug: 'round-corners', icon: 'circle' },
  { slug: 'add-border', icon: 'square' },
  { slug: 'split-image', icon: 'grid-four' },
  { slug: 'background-remover', icon: 'eraser' },
  { slug: 'image-to-pdf', icon: 'file-pdf' },
  { slug: 'favicon-generator', icon: 'star' },
  { slug: 'image-to-text', icon: 'text-aa' },
  { slug: 'gif-maker', icon: 'film-strip' },
  { slug: 'html-to-image', icon: 'code' },
];

export function toolBySlug(slug: string): ToolDef | undefined {
  return tools.find((t) => t.slug === slug);
}
