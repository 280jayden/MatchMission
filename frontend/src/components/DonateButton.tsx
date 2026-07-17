import { useEffect } from 'react';
import { useState } from 'react';

/**
 * Donation button for an Every.org nonprofit.
 *
 * Loads the Every.org embed script, creates a donation button,
 * and connects it to the nonprofit's donation widget.
 *
 * Props:
 * - slug: Every.org slug of the nonprofit.
 */

type DonateButtonProps = {
    slug: string;
};

function DonateButton({ slug }: DonateButtonProps) {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const widgetId = `every-donate-widget-${slug}`;

    // Load the Every.org script once.
    // If it already exists, wait for it to finish loading (if necessary).
    useEffect(() => {
        const existing = document.getElementById(
            'every-donate-btn-js',
        ) as HTMLScriptElement | null;

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

    // After the script is available, create the button and
    // connect it to the donation widget for this nonprofit.
    useEffect(() => {
        const w = window as any;

        if (!slug || !scriptLoaded || !w.everyDotOrgDonateButton) {
            return;
        }

        // Creates the visible Every.org donate button.
        w.everyDotOrgDonateButton.createButton({
            selector: `#${widgetId}`,
            nonprofitSlug: slug,
            label: 'DONATE HERE',
            withLogo: true,
            bgColor: 'var(--secondary2)',
            borderRadius: '30px',
            fontSize: '20px',
            padding: '25px 50px',
        });

        // Associates this button with its donation widget.
        w.everyDotOrgDonateButton.createWidget({
            selector: `#${widgetId}`,
            nonprofitSlug: slug,
        });
    }, [slug, scriptLoaded, widgetId]);

    return (
        <>
            {/* old donate button just in case we need it */}
            {/* <button
                onClick={() => {
                const url = org.profileUrl.startsWith('http')
                    ? `${org.profileUrl}/donate`
                    : `https://${org.profileUrl}/donate`;
                window.open(url, '_blank');
                }}
                className="norm-button"
                disabled={!org.profileUrl}
            >
                {org.profileUrl ? 'DONATE HERE' : 'NO DONATION LINK'}
            </button> */}

            <div id={widgetId}> </div>
        </>
    );
}

export default DonateButton;
