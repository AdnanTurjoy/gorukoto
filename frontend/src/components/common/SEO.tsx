import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'গরুকই';
const SITE_URL = 'https://gorukoi.com';
const DEFAULT_DESCRIPTION =
  'কোরবানির ঈদে বাংলাদেশের গরুর হাট খুঁজুন — লাইভ দাম, ভিড়ের অবস্থা ও কমিউনিটি আপডেট। GoruKoi — Bangladesh cattle market finder.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: object | object[];
}

export function SEO({ title, description, canonical, ogImage, noIndex, jsonLd }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — বাংলাদেশের গরুর হাট`;
  const desc = description ?? DEFAULT_DESCRIPTION;
  const image = ogImage ?? DEFAULT_IMAGE;
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="bn_BD" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {/* Structured data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
}
