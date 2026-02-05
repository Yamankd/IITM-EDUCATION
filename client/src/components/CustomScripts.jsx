import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/api";

const CustomScripts = () => {
  const [scripts, setScripts] = useState("");
  const [gtmId, setGtmId] = useState("");
  const [seo, setSeo] = useState(null);

  useEffect(() => {
    // Load custom scripts from API
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (data.success) {
          const settings = data.data;
          setSeo(settings);
          if (settings.customHeadScripts) {
            setScripts(settings.customHeadScripts);
          }
          if (settings.googleTagManagerId) {
            setGtmId(settings.googleTagManagerId);
          }
        }
      } catch (error) {
        console.error("Error loading custom scripts:", error);
      }
    };

    fetchSettings();
  }, []);

  // Inject GTM noscript in body
  useEffect(() => {
    if (gtmId) {
      // Check if noscript already exists
      const existingNoscript = document.querySelector("noscript[data-gtm]");
      if (!existingNoscript) {
        const noscript = document.createElement("noscript");
        noscript.setAttribute("data-gtm", "true");
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
        iframe.height = "0";
        iframe.width = "0";
        iframe.style.display = "none";
        iframe.style.visibility = "hidden";
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);
      }
    }
  }, [gtmId]);

  return (
    <Helmet>
      {/* Global SEO Meta Tags */}
      {seo && seo.metaTitle && <title>{seo.metaTitle}</title>}
      {seo && seo.metaDescription && (
        <meta name="description" content={seo.metaDescription} />
      )}
      {seo && seo.keywords && <meta name="keywords" content={seo.keywords} />}
      {seo && seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      {seo && seo.faviconUrl && (
        <link rel="icon" type="image/png" href={seo.faviconUrl} />
      )}

      {/* Google Tag Manager Head Script */}
      {gtmId && (
        <script>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </script>
      )}

      {/* Custom Head Scripts */}
      {scripts && (
        <script type="text/javascript">
          {`
            // Inject custom scripts
            (function() {
              const customScripts = ${JSON.stringify(scripts)};
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = customScripts;
              
              // Extract and execute scripts
              const scriptElements = tempDiv.querySelectorAll('script');
              scriptElements.forEach(function(oldScript) {
                const newScript = document.createElement('script');
                
                // Copy attributes
                Array.from(oldScript.attributes).forEach(function(attr) {
                  newScript.setAttribute(attr.name, attr.value);
                });
                
                // Copy content
                if (oldScript.innerHTML) {
                  newScript.innerHTML = oldScript.innerHTML;
                }
                
                // Append to head
                document.head.appendChild(newScript);
              });
            })();
          `}
        </script>
      )}
    </Helmet>
  );
};

export default CustomScripts;
