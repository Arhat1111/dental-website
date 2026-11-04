/* Real Google reviews. No fabricated sample data and no API key in browser. */
(() => {
  'use strict';
  const panel = document.querySelector('.reviews-panel');
  const list = document.getElementById('googleReviewsLive');
  const summary = document.getElementById('googleRatingSummary');
  if (!panel || !list || !summary) return;

  const endpoint = String(window.IMAGE_DENTAL_REVIEWS_ENDPOINT || '').trim();
  const status = document.getElementById('googleReviewsStatus');
  const sourceLink = panel.querySelector('a[href*="google.com"]');

  function setStatus(message) {
    if (status) { status.textContent = message; status.hidden = !message; }
  }
  function safeHttps(value) {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; }
    catch { return ''; }
  }
  function node(tag, cls, value) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (value !== undefined) el.textContent = String(value);
    return el;
  }
  function renderStars(rating) {
    const value = Number.isFinite(Number(rating)) ? Math.max(0,Math.min(5,Number(rating))) : 0;
    const wrap = node('span','review-stars','');
    wrap.textContent = `${'★'.repeat(Math.round(value))}${'☆'.repeat(5-Math.round(value))}`;
    wrap.setAttribute('aria-label',`${value} out of 5 stars`);
    return wrap;
  }
  function renderReview(review) {
    const card = node('article','google-review-card');
    const head = node('div','google-review-top');
    const author = node('div','google-review-author');
    const imageUrl = safeHttps(review.authorPhoto);
    if (imageUrl) {
      const photo = node('img'); photo.src=imageUrl; photo.alt=''; photo.loading='lazy';
      photo.referrerPolicy='no-referrer'; author.append(photo);
    }
    const authorName = node('span','review-author-name',review.author || 'Google reviewer');
    const authorUrl = safeHttps(review.authorUrl);
    if (authorUrl) {
      const authorAnchor=node('a','review-author-link',review.author || 'Google reviewer');
      authorAnchor.href=authorUrl; authorAnchor.target='_blank'; authorAnchor.rel='noopener noreferrer';
      author.append(authorAnchor);
    } else author.append(authorName);
    head.append(author,renderStars(review.rating));card.append(head);
    if (review.text) card.append(node('p','review-quote',review.text));
    const foot=node('div','review-foot');
    if (review.date) {
      const date=node('time','review-date',new Date(review.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}));
      date.dateTime=review.date;foot.append(date);
    }
    const reviewUrl=safeHttps(review.url);
    if(reviewUrl){
      const link=node('a','review-original','View on Google Maps ↗');
      link.href=reviewUrl;link.target='_blank';link.rel='noopener noreferrer';foot.append(link);
    }
    card.append(foot);
    return card;
  }
  async function load() {
    if (!endpoint) {
      setStatus('Google reviews are not connected yet. View the clinic’s latest reviews on Google Maps.');
      return;
    }
    const url=safeHttps(endpoint);
    // localhost testing can use http://localhost:8787 only
    const local=/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?.*$/.test(endpoint);
    if (!url && !local) {setStatus('Reviews configuration needs a valid HTTPS endpoint.');return;}
    setStatus('Loading Google reviews…');
    try {
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),12000);
      let response;
      try {response=await fetch(url || endpoint,{headers:{'Accept':'application/json'},signal:controller.signal,cache:'no-store'});}
      finally {clearTimeout(timer);}
      if (!response.ok) throw new Error(`Reviews service unavailable (${response.status})`);
      const data=await response.json();
      if (!Array.isArray(data.reviews)) throw new Error('Reviews service returned invalid data');
      const rating=Number(data.rating);
      const count=Number(data.totalRatings);
      if(Number.isFinite(rating) && rating>=0 && rating<=5) {
        summary.textContent=`${rating.toFixed(1)} / 5 on Google Maps${Number.isFinite(count) ? ` · ${count.toLocaleString('en-IN')} ratings` : ''}`;
        summary.hidden=false;
      }
      if (data.reviews.length) {
        list.replaceChildren(...data.reviews.slice(0,5).map(renderReview));
        list.append(node('p','google-review-attribution','Reviews provided by Google Maps · A selection of up to five reviews'));
        list.hidden=false;
        setStatus('');
      } else setStatus('No review excerpts are available from Google right now.');
      const placeLink=safeHttps(data.googleMapsUrl);
      if(placeLink && sourceLink) sourceLink.href=placeLink;
    } catch(e) {
      console.warn('Google reviews unavailable:',e);
      setStatus('Google reviews are temporarily unavailable. Read current reviews on Google Maps.');
    }
  }
  load();
})();
