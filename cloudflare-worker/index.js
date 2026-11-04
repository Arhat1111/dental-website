/**
 * Image Dental Care Google Reviews proxy. Deploy as Cloudflare Worker.
 * Required secret: GOOGLE_PLACES_API_KEY
 * Optional variable: GOOGLE_PLACE_ID (recommended to avoid lookup charges)
 * Optional variable: ALLOWED_ORIGINS (comma-separated full origins)
 * API requests are made server-side, and review content is not fabricated.
 */
const QUERY = 'Image Dental Care & Implant Centre 53 54 Aakash Business Centre Piplod Surat Gujarat';
const BASE = 'https://places.googleapis.com/v1';

function cors(origin, allowed) {
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : 'null',
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8'
  };
}
async function fromGoogle(url, key, mask, options={}) {
  const response=await fetch(url,{
    ...options,
    headers:{...(options.headers||{}),'X-Goog-Api-Key':key,'X-Goog-FieldMask':mask,'Accept':'application/json'},
    cf:{cacheTtl:0,cacheEverything:false}
  });
  if (!response.ok) {
    const body=await response.text();
    console.error('Google Places error',response.status,body.slice(0,500));
    throw new Error(`Google Places returned ${response.status}`);
  }
  return response.json();
}
async function resolveId(env) {
  if (env.GOOGLE_PLACE_ID) return env.GOOGLE_PLACE_ID.trim();
  const data=await fromGoogle(BASE+'/places:searchText',env.GOOGLE_PLACES_API_KEY,
    'places.id,places.displayName,places.formattedAddress',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({textQuery:QUERY,regionCode:'IN',maxResultCount:5})
    });
  const candidate=(data.places || []).find(p =>
    /image dental care/i.test(p.displayName?.text||'') &&
    /surat/i.test(p.formattedAddress||'') && /piplod|akash|aakash/i.test(p.formattedAddress||''));
  if (!candidate) throw new Error('Clinic could not be matched with confidence; configure GOOGLE_PLACE_ID');
  return candidate.id;
}
export default {
  async fetch(request,env) {
    const origin=request.headers.get('Origin')||'';
    const configured=String(env.ALLOWED_ORIGINS||'https://imagedentalcaree.com,https://www.imagedentalcaree.com');
    const allowed=configured.split(',').map(x=>x.trim()).filter(Boolean);
    // requests without Origin are allowed for inspection; cross-origin browser access requires a match
    const headers=cors(origin,allowed);
    if (request.method==='OPTIONS') return new Response(null,{status:204,headers});
    if (request.method!=='GET') return new Response(JSON.stringify({error:'Method not allowed'}),{status:405,headers});
    if (!allowed.includes(origin) && origin) return new Response(JSON.stringify({error:'Origin not allowed'}),{status:403,headers});
    if (!env.GOOGLE_PLACES_API_KEY) return new Response(JSON.stringify({error:'Server is missing Google Places API key'}),{status:503,headers});
    try {
      const placeId=await resolveId(env);
      const place=await fromGoogle(`${BASE}/places/${encodeURIComponent(placeId)}`,env.GOOGLE_PLACES_API_KEY,
        'id,displayName,formattedAddress,rating,userRatingCount,reviews,googleMapsUri');
      if (!/image dental care/i.test(place.displayName?.text||'') || !/surat/i.test(place.formattedAddress||''))
        throw new Error('Google returned a different business; check GOOGLE_PLACE_ID');
      const reviews=(place.reviews||[]).slice(0,5).map(r=>({
        author:r.authorAttribution?.displayName||'Google reviewer',
        authorUrl:r.authorAttribution?.uri||'',
        authorPhoto:r.authorAttribution?.photoUri||'',
        rating:r.rating||0,
        text:r.text?.text||r.originalText?.text||'',
        date:r.publishTime||'',
        url:r.googleMapsUri||place.googleMapsUri||''
      }));
      return new Response(JSON.stringify({
        placeName:place.displayName?.text||'',rating:place.rating??null,
        totalRatings:place.userRatingCount??null,googleMapsUrl:place.googleMapsUri||'',
        reviews,source:'Google Places API (New)'
      }),{status:200,headers});
    } catch(e) {
      console.error('Google reviews could not load',e.message);
      return new Response(JSON.stringify({error:'Live Google reviews are currently unavailable'}),{status:502,headers});
    }
  }
};
