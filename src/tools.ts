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
];

export function toolBySlug(slug: string): ToolDef | undefined {
  return tools.find((t) => t.slug === slug);
}
