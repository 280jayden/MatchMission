
import { useEffect } from 'react';
import { useState } from 'react';


type DonateButtonProps = {
  slug: string;
};

function DonateButton({ slug }: DonateButtonProps) {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const widgetId = `every-donate-widget-${slug}`;
    
    useEffect(() => {
        const existing = document.getElementById('every-donate-btn-js') as HTMLScriptElement | null;

        if (existing) {
            if ((window as any).everyDotOrgDonateButton) {
              setScriptLoaded(true);
            } else {
              existing.addEventListener('load', () => setScriptLoaded(true));
            }
            return;
          }

        const script = document.createElement('script');
        script.src = 'https://embeds.every.org/0.4/button.js?explicit=1';
        script.id = 'every-donate-btn-js';
        script.async = true;
        script.defer = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        const w = window as any;
      
        if (!slug || !scriptLoaded || !w.everyDotOrgDonateButton) {
          return;
        }

        w.everyDotOrgDonateButton.createButton({
            selector: `#${widgetId}`,
            nonprofitSlug: slug,
            label: "DONATE HERE",
            withLogo: true,
            bgColor: "var(--secondary2)",
            borderRadius: "30px",
            fontSize: "20px",
            padding: "25px 50px",
        });
      
        w.everyDotOrgDonateButton.createWidget({
          selector: `#${widgetId}`,
          nonprofitSlug: slug,
        });
      }, [slug, scriptLoaded, widgetId]);


    return (
        <>
            <div id={widgetId}> </div>
        </>
    );
}

export default DonateButton;
