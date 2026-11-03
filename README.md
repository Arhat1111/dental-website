# Image Dental Care & Implant Centre — Revised Website

Open `index.html` with VS Code Live Server. All assets are in `assets/images`.

## Files
- `index.html`: full-width homepage image slider, clinic sections and appointment form
- `styles.css`: responsive styles and clinic color palette
- `script.js`: homepage slider, treatments grid, navigation, FAQs and enquiry helpers
- `service.js`: navigation and modal behaviour on individual service pages
- Six individual treatment pages and a dental tourism page, named by service

## Important
Appointment forms **copy** the enquiry; they do not submit it to the clinic. Connect a verified phone, WhatsApp and secure form backend before launching. Update clinic opening hours and contact details only with confirmed information.


## Navigation repair
Corrected an extra closing `</div>` on every HTML page that caused the header links and appointment button to escape the navigation row. At narrower widths, the navigation collapses to a mobile menu to avoid wrapping.

## New About Us page
- `about.html` contains clinic story, mission & vision, founder, surgeon and support team profiles.
- The homepage retains a short About introduction; all About menu links lead to `about.html`.
- Team photographs `team-photo-01.png`, `team-photo-02.png`, and `team-reception.png` appear in an unlabelled photo gallery pending exact identity-to-photo confirmation. `dr-mrigya-khurana.png` is used on Dr. Mrigya’s card based on the name visible on her coat.
- The exact patient count was **not supplied**. The About page deliberately does not invent one; replace the patient milestone message once the clinic confirms the number.
- Please review team credentials and consent to publish photographs before launch.


## Clinical support photographs
The former Moments with our team gallery was removed, and three supplied photos now appear in the first three clinical support profile cards in their prior gallery order. **Photo-to-name assignments are provisional and must be verified with the clinic before publishing**. The fourth card retains initials until a verified image is supplied.


## November 2026 updates
- About portrait vertical alignment; four-card clinic support grid on desktop.
- Duplicate Braces & Aligners top-level navbar link removed.
- Local process illustration images on every service page (illustrative, not clinic case photography).
- Maps iframe and external Google Reviews link on homepage. Google's business review cards need an approved third-party widget or Google Business Profile / Places API keys for true live integration.
- Public contact information populated from imagedentalcare.in; confirm hours before adding.
- Enquiry modal uses WhatsApp deep link to +91 96621 65644. It does not collect or store submissions on a server.
- New file `lead.js` controls enquiry popup.


## WhatsApp appointment enquiries
All booking forms now open WhatsApp with the visitor's name, contact number, service and requested date prefilled. The visitor must tap **Send** within WhatsApp. The destination is `+91 96621 65644` (`919662165644`) as configured in `script.js`, `service.js` and `lead.js`. Confirm this is the clinic's correct WhatsApp-enabled number before launch.

## Founder portrait
The About-page founder image uses `assets/images/dr-pooja-portrait-crop.png` with an updated proportional portrait frame. The original image remains in assets.


## Enquiry popup
The enquiry popup automatically appears once per browser tab/session, on the first page visited. Visitors close it using the × button, backdrop, or Escape. The floating Enquire Now opener has been removed. Reloading or navigating to another page in the same tab will not reopen it; opening the site in a new tab starts a new session. The popup continues to prepare an enquiry in WhatsApp, where the visitor must press Send.

## Popup motion update
The enquiry popup now opens 1 second after the first page load in each browser tab. It fades/scales in and out over 320 ms. Change `OPEN_DELAY_MS` and `TRANSITION_MS` in `lead.js` to adjust timing. `prefers-reduced-motion` is respected.

## Latest visual fix
The full-width information strip now uses consistent dark green, white/ivory text, and muted gold icons. Previous pale-blue text colors were removed for this strip. No layout or functionality was changed.


## November 3 visual update
Primary appointment buttons now use solid mint-green (#8BCDBB), with a slightly darker green hover state (#77BEAA); the former two-color gradient has been removed.

## Contact information band color correction
The homepage information bar is now solid mint `#8BCDBB`, matching the appointment button. Its dark-green text, icons, and divider lines maintain readable contrast. The late `!important` CSS override that previously restored the dark green has been replaced.

## Contact page update
- Added `contact.html` with contact details, enquiry form, map and WhatsApp integration.
- Navbar Contact links now open the dedicated page on all pages.
- Restored the homepage three-column contact information band to forest green (#18594E), with white text and yellow icons.


## Google reviews setup (live Google Places)

Live Google reviews require a Google Maps Platform API key and a Google Cloud billing-enabled project. Google currently supplies up to five reviews for a place via the official Places API. Reviews are not hardcoded or fabricated.

1. Enable **Maps JavaScript API** and **Places API (New)** in Google Cloud.
2. Create a browser API key restricted by HTTP referrer to the deployed website domain, and restrict allowed APIs.
3. Add the restricted key to `reviews-config.js` (between the quotes).
4. Deploy and open the homepage on your hosted domain. The website will query Google and show the available reviews with reviewer attribution.
5. If the key is missing/invalid, the website retains the existing Google Reviews link without showing invented quotes.

Review content is fetched on visitor page-load and is not stored or cached. Google may change which reviews appear. Verify the Google Cloud billing settings and current Google attribution requirements.


## 3 November — heading and accent color correction
- Entire “Commitment to Care.” and “your needs.” phrases are gold (#E8C77C).
- Entire orthodontic treatment-help, FAQs, and patient-focused care headings are forest green (#193F36).
- Blue-looking treatment labels, step markers, and links have been explicitly set to matching green.
- Mobile heading sizes are bounded to minimize overflow.
- No layout, content, navigation, booking, or slideshow scripts were intentionally changed.


## Brand palette restoration (November 3)
About and Contact page heroes now use the same green-gradient visual direction as the homepage/service pages. Gold emphasis and white text are restored. The stylesheet URL is versioned to prevent browsers displaying a previously cached palette.

Replace the entire deployed directory with these files; do not mix files from earlier releases.
