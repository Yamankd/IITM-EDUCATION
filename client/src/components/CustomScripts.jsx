import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const CustomScripts = () => {
  const [scripts, setScripts] = useState("");
  const [gtmId, setGtmId] = useState("");

  useEffect(() => {
    // Load custom scripts from localStorage
    const savedSettings = localStorage.getItem("seoSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.customHeadScripts) {
          setScripts(parsed.customHeadScripts);
        }
        if (parsed.googleTagManagerId) {
          setGtmId(parsed.googleTagManagerId);
        }
      } catch (e) {
        console.error("Error loading custom scripts:", e);
      }
    }
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
