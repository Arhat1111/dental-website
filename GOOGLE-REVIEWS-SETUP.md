# Authentic, automatically refreshed Google reviews — activation guide

The website's `reviews.js` now requests actual Google reviews, rating, and rating count from a Cloudflare Worker; it never contains invented sample testimonials. On every homepage load it fetches fresh results. Google Places API (New) currently provides only **up to five** review excerpts (selected by relevance), not all reviews. New reviews may not instantly appear in Google's selected five. API usage incurs billed Google Places requests.

**Important:** This download does **not** show actual review cards until you connect a Google API key and deploy the Worker. We cannot activate the external service without access to your Google Cloud billing/project. Do not paste a secret key into the HTML, public GitHub repo, or `reviews-config.js`.

## Google setup

1. In Google Cloud Console, select your clinic's project or create one. Enable billing and **Places API (New)**.
2. Create an API key for the server-side Worker. Restrict that key to the Places API (New). For the standard Cloudflare workers.dev endpoint a static source IP is not provided, so application restrictions for IP addresses are generally unsuitable; monitor quotas and keep the key a Worker secret.
3. Confirm the **Google Place ID** for Image Dental Care & Implant Centre, Piplod, Surat, and set the Worker's `GOOGLE_PLACE_ID` variable. Without this variable the Worker attempts a verified text search, which adds API costs. Do not confuse Google Maps URL CID or geocode with Place ID.

## Cloudflare Worker setup

1. Open Cloudflare Dashboard → Workers & Pages → create/deploy Worker, using the supplied `cloudflare-worker/index.js`. Alternatively, from the `cloudflare-worker` directory run `npx wrangler deploy` after authenticating.
2. Set secret `GOOGLE_PLACES_API_KEY` (`npx wrangler secret put GOOGLE_PLACES_API_KEY`), never in the source file.
3. Set `GOOGLE_PLACE_ID` to the confirmed place ID (optional if text lookup succeeds). Set `ALLOWED_ORIGINS` if your domain differs from `https://imagedentalcaree.com` or `https://www.imagedentalcaree.com`.
4. Copy the deployed HTTPS Worker endpoint, e.g. `https://YOUR-WORKER.YOUR-ACCOUNT.workers.dev/` into `reviews-config.js` as `window.IMAGE_DENTAL_REVIEWS_ENDPOINT = '...';`.
5. Upload the website, hard-refresh, and check browser Developer Tools → Network. The Worker should return JSON containing `reviews` and `rating`.
6. Check actual reviewer names and review links against the clinic's own Google Maps listing. Enable Cloudflare request throttling/Google Cloud budget alerts because requests are billable.

The Google reviews panel shows an explicit message (and the original link to Google Maps) if the API is unconfigured, empty, or unavailable. It does not display static fabricated reviews. The page does not silently hide errors.

### What is and is not real-time

Reviews are fetched anew on each page load, subject to Google API updates and Google selection. They are not a push feed, and the public API does not guarantee the newest or every review appears. For more extensive reviews, the clinic owner can authorize access to their verified Google Business Profile Reviews API, but that requires OAuth and a backend.

### Test endpoint

After setup, visit the Worker endpoint. It should return fields `placeName`, `rating`, `totalRatings`, `googleMapsUrl` and `reviews`. When not configured it returns an error status, rather than made-up data.
