/**
 * Measurement and lead capture for the www.dijitally.com build, matching what every other page
 * on that site carries (its _site-tools/tracking.py checks for these exact IDs):
 *   - Google Tag Manager GTM-W4ZHP7S (GA4 and Google Ads are configured inside it)
 *   - HubSpot portal 149177450 (EU1), which sets the hubspotutk cookie used for attribution
 *   - the OpenAI ads pixel
 * Only rendered when ON_DIJITALLY (see site.ts), so local dev and the preview report nothing.
 */

export const OPENAI_PIXEL_SNIPPET = `!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"Qgctr3JzWMLnR99enzfztW",debug:false});`;

export const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W4ZHP7S');`;

export const HUBSPOT_SRC = "//js-eu1.hs-scripts.com/149177450.js";

/**
 * window.dijiSendLead(fields, source): the site's lead contract, as in its own forms.
 *   - pushes generate_lead to the dataLayer when the visitor sends (GA4 + the Google Ads conversion)
 *   - posts to /api/lead, which delivers to HubSpot and Slack
 *   - fires the OpenAI lead_created conversion only once the server has accepted the lead
 * Resolves true if the lead was accepted. Inline in the page rather than in a bundle so the
 * site's tracking check can see it in the served HTML.
 */
export const LEAD_SNIPPET = `window.dijiSendLead=function(f,source){
var dl=window.dataLayer=window.dataLayer||[];
dl.push({event:'generate_lead',form_location:source,page_path:location.pathname});
return fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
email:(f.email||'').trim(),name:(f.name||'').trim(),notes:(f.notes||'').trim(),source:source,
page:location.pathname,referrer:document.referrer,search:location.search,
hutk:(document.cookie.match(/hubspotutk=([^;]+)/)||[])[1]||''})})
.then(function(r){if(r.ok){try{if(window.oaiq)oaiq("measure","lead_created",{type:"customer_action"})}catch(e){}}return r.ok})
.catch(function(){return false});};`;

/** Organization and WebSite, as the rest of the site states them; true of every page. */
export const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.dijitally.com/#organisation",
      name: "Dijitally",
      url: "https://www.dijitally.com/",
      logo: "https://www.dijitally.com/dijitally-heading.svg",
      description:
        "Dijitally is a global digital agency that works like your in-house team. Embedded creative, media, technology and performance talent, without the headcount.",
      sameAs: ["https://www.linkedin.com/company/dijitallyau/"],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.dijitally.com/#website",
      name: "Dijitally",
      url: "https://www.dijitally.com/",
      publisher: { "@id": "https://www.dijitally.com/#organisation" },
    },
  ],
};

declare global {
  interface Window {
    dijiSendLead?: (fields: Record<string, string>, source: string) => Promise<boolean>;
  }
}
