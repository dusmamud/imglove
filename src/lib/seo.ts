import { SITE_ORIGIN, l } from '../i18n/index';

export function toolJsonLd(locale: string, toolSlug: string, name: string, desc: string) {
  const url = `${SITE_ORIGIN}${l('/' + toolSlug, locale)}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `${name} — Image Quill`,
      description: desc,
      url,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Image Quill', item: `${SITE_ORIGIN}${l('/', locale)}` },
        { '@type': 'ListItem', position: 2, name, item: url },
      ],
    },
  ];
}

export function homeJsonLd(locale: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Image Quill',
      url: `${SITE_ORIGIN}${l('/', locale)}`,
    },
  ];
}
