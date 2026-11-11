import Script from "next/script";
import { GA_ID } from "@/lib/analytics";

/**
 * gtag.js, loaded once the page is interactive — never in the way of the
 * opening. Renders nothing without a measurement id (see lib/analytics.ts).
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
