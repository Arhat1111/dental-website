/** Display real, current Google Place reviews when a valid Places API key is configured. */
(() => {
  const key = window.IMAGE_DENTAL_GOOGLE_MAPS_KEY;
  const container = document.getElementById('googleReviewsLive');
  const summary = document.getElementById('googleRatingSummary');
  if (!container || !key || key.trim().length < 12) return;

  function textElement(tag, content, className) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = content;
    return el;
  }
  function safeLink(url) {
    try {const u = new URL(url); return u.protocol === 'https:' ? u.href : null;}
    catch {return null;}
  }
  function displayReview(review) {
    const card = textElement('article','', 'google-review-card');
    const top = textElement('div','', 'google-review-top');
    const author = textElement('div','', 'google-review-author');
    const attr = review.authorAttribution || {};
    const authorURL = safeLink(attr.uri);
    const person = authorURL ? document.createElement('a') : document.createElement('span');
    person.textContent = attr.displayName || 'Google reviewer';
    if (authorURL) {person.href=authorURL; person.target='_blank'; person.rel='noopener noreferrer';}
    if (attr.photoURI && safeLink(attr.photoURI)) {
      const avatar = document.createElement('img');avatar.src=attr.photoURI;avatar.alt='';avatar.loading='lazy';
      author.append(avatar);
    }
    author.append(person);
    top.append(author,textElement('span','★'.repeat(Math.max(0,Math.min(5,Math.round(review.rating || 0)))),'google-review-stars'));
    card.append(top);
    const reviewText = typeof review.text==='string' ? review.text : (review.text?.text || '');
    if (reviewText) card.append(textElement('p',reviewText));
    if (review.relativePublishTimeDescription) card.append(textElement('small',review.relativePublishTimeDescription));
    const source = safeLink(review.googleMapsURI);
    if (source) {
      const link = textElement('a','View original review on Google Maps');
      link.href=source;link.target='_blank';link.rel='noopener noreferrer';card.append(link);
    }
    return card;
  }
  async function loadReviews() {
    const {Place} = await google.maps.importLibrary('places');
    const {places} = await Place.searchByText({
      textQuery:'Image Dental Care & Implant Centre 53 54 Aakash Business Centre Piplod Surat Gujarat',
      fields:['id','displayName','formattedAddress'],region:'in',maxResultCount:5
    });
    const place = places.find(p=>/image dental care/i.test(p.displayName||'') && /surat|piplod/i.test(p.formattedAddress||''));
    if (!place) return;
    await place.fetchFields({fields:['rating','userRatingCount','reviews','googleMapsURI']});
    if (!Array.isArray(place.reviews) || place.reviews.length===0) return;
    if (Number.isFinite(place.rating)) {
      summary.textContent = `${place.rating.toFixed(1)} / 5 on Google Maps${place.userRatingCount ? ` · ${place.userRatingCount} ratings` : ''}`;
      summary.hidden=false;
    }
    container.replaceChildren(...place.reviews.slice(0,5).map(displayReview));
    container.append(textElement('p','Google Maps reviews · selected by relevance · up to 5 available through Google Places API','google-review-attribution'));
    if (place.attributions) for (const attribution of place.attributions) {
      container.append(textElement('small',typeof attribution==='string'?attribution:String(attribution),'google-review-attribution'));
    }
    container.hidden = false;
  }
  window.__imageDentalMapsLoaded = () => {loadReviews().catch(()=>{});};
  const script = document.createElement('script');
  script.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(key)+'&loading=async&v=weekly&libraries=places&callback=__imageDentalMapsLoaded';
  script.async=true;script.onerror=()=>{};document.head.append(script);
})();
