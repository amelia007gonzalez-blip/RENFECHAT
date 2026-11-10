import { useEffect } from 'react';

const AD_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT;
const AD_SLOT = import.meta.env.VITE_ADSENSE_SLOT;
const AD_SCRIPT_ID = 'adsense-script';

const AdBanner = () => {
  const adsEnabled = Boolean(AD_CLIENT && AD_SLOT);

  useEffect(() => {
    if (!adsEnabled) return;
    if (!document.getElementById(AD_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = AD_SCRIPT_ID;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;
      document.head.appendChild(script);
    }
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, [adsEnabled]);

  return (
    <aside aria-label="Publicidad" className="shrink-0 bg-zinc-950 border-t border-zinc-800 px-3 py-1.5">
      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest text-center mb-1">Publicidad</p>
      <div className="h-[50px] flex items-center justify-center overflow-hidden rounded-lg">
        {adsEnabled
          ? <ins className="adsbygoogle block w-full h-[50px]" style={{ display: 'block' }}
              data-ad-client={AD_CLIENT} data-ad-slot={AD_SLOT} data-ad-format="horizontal" data-full-width-responsive="true" />
          : <span className="text-[10px] text-zinc-600 font-bold">Espacio publicitario</span>}
      </div>
    </aside>
  );
};

export default AdBanner;
