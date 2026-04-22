import { useEffect, useRef, useState } from "react";

const ADSENSE_SCRIPT_ID = "motormandi-adsense-script";
const DEFAULT_ADSENSE_CLIENT = "ca-pub-6858918029295433";
let adsenseScriptPromise = null;

const isConfiguredClient = (client) => {
  if (typeof client !== "string") return false;
  return /^ca-pub-\d{10,}$/.test(client.trim());
};

const loadAdSenseScript = (client) => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (!isConfiguredClient(client)) return Promise.resolve(false);
  if (window.adsbygoogle) return Promise.resolve(true);

  if (adsenseScriptPromise) {
    return adsenseScriptPromise;
  }

  const existingScript = document.getElementById(ADSENSE_SCRIPT_ID);
  if (existingScript) {
    adsenseScriptPromise = Promise.resolve(true);
    return adsenseScriptPromise;
  }

  adsenseScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return adsenseScriptPromise;
};

export default function AdSenseSlot({
  slot,
  format = "auto",
  className = "",
  minHeight = 90,
  fullWidthResponsive = true,
  style,
}) {
  const adRef = useRef(null);
  const [isVisible, setIsVisible] = useState(
    typeof window !== "undefined" && typeof IntersectionObserver === "undefined"
  );
  const [hasFailed, setHasFailed] = useState(false);

  const enabled = import.meta.env.VITE_ADSENSE_ENABLED !== "false";
  const client = (import.meta.env.VITE_ADSENSE_CLIENT || DEFAULT_ADSENSE_CLIENT).trim();
  const normalizedSlot = String(slot || "").trim();
  const testMode = import.meta.env.VITE_ADSENSE_TEST_MODE === "true";

  const canRender = enabled && isConfiguredClient(client) && normalizedSlot.length > 0;

  useEffect(() => {
    if (!canRender || isVisible || !adRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, [canRender, isVisible]);

  useEffect(() => {
    if (!canRender || !isVisible || hasFailed || !adRef.current) return;
    if (adRef.current.dataset.loaded === "true") return;

    let cancelled = false;

    loadAdSenseScript(client).then((loaded) => {
      if (cancelled || !adRef.current) return;

      if (!loaded) {
        setHasFailed(true);
        return;
      }

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adRef.current.dataset.loaded = "true";
      } catch (error) {
        const message = String(error?.message || "");
        if (!message.includes("already have ads in them")) {
          setHasFailed(true);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [canRender, client, hasFailed, isVisible]);

  if (!canRender || hasFailed) return null;

  return (
    <div className={className} style={{ minHeight, ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={client}
        data-ad-slot={normalizedSlot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
        data-adtest={testMode ? "on" : undefined}
        aria-label="Advertisement"
      />
    </div>
  );
}
