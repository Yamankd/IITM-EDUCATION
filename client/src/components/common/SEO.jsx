import React from "react";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  schema,
  noindex = false,
}) => {
  const siteTitle = "Digital IITM";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  // --- CANONICAL URL LOGIC ---
  const PREFERRED_DOMAIN = "https://www.digitaliitm.com";

  // 1. Get current path without query string and remove trailing slash
  let pathname = window.location.pathname;
  if (pathname.endsWith("/") && pathname !== "/") {
    pathname = pathname.slice(0, -1);
  }

  // 2. Handle Query Params: Only allow 'page' for pagination
  const searchParams = new URLSearchParams(window.location.search);
  const allowedParams = ["page"];
  const newSearchParams = new URLSearchParams();
  allowedParams.forEach((param) => {
    if (searchParams.has(param)) {
      newSearchParams.set(param, searchParams.get(param));
    }
  });
  const queryString = newSearchParams.toString()
    ? `?${newSearchParams.toString()}`
    : "";

  // 3. Construct Final Canonical URL
  const generatedCanonical = `${PREFERRED_DOMAIN}${pathname}${queryString}`;
  const currentUrl = url || generatedCanonical;

  const defaultImage = "https://digitaliitm.com/assets/logo.png"; // Fallback image

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots Tag: Control Indexing */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image || defaultImage} />

      {/* JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  schema: PropTypes.object,
  noindex: PropTypes.bool,
};

export default SEO;
