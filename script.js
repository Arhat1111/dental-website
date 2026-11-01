/**
 * Dental website interactions
 * 1. Treatment cards + accordion content
 * 2. Hero carousel
 * 3. Responsive navigation + scroll reveals
 * 4. Appointment form (copy-only until clinic contact/backend is provided)
 */

const treatmentData=[['Root Canal Treatment','Comfort-focused assessment and treatment that may help preserve a natural tooth when clinically appropriate.','dental-examination'],['Cosmetic Dentistry & Smile Design','Explore personalised options for tooth colour, shape, spacing and smile appearance.','clear-aligners'],['Braces & Clear Aligners','Individual assessment for teeth alignment and selected bite concerns.','patient-consultation'],['Wisdom Tooth Surgery','Clinical assessment determines when wisdom teeth may be monitored or treated.','dental-examination'],['Dental Implants','Understand tooth replacement options and clinical suitability for dental implants.','modern-clinic'],['General & Preventive Care','Dental check-ups, oral health assessments and preventive guidance as appropriate.','patient-consultation']];
const treatmentPages=['root-canal-treatment.html','cosmetic-dentistry.html','braces-clear-aligners.html','wisdom-tooth-surgery.html','dental-implants.html','general-dentistry.html'];
const cards=document.getElementById('treatmentCards'); cards && treatmentData.forEach(([title,desc,photo],i)=>{const article=document.createElement('article');article.className='treatment-card reveal';article.innerHTML=`<img loading="lazy" src="assets/images/${photo}.webp" alt="Illustrative dental care photograph"><div class="card-body"><span>${String(i+1).padStart(2,'0')} / DENTAL CARE</span><h3>${title}</h3><p>${desc}</p><a href="${treatmentPages[i]}">Explore Treatment ↗</a></div>`;cards.append(article)});
const steps=[['Smile Assessment','Discuss your concerns and smile goals.'],['Dental Examination','Review teeth, gums, bite and any necessary records or imaging.'],['Treatment Plan','Discuss suitable options, treatment stages and estimated costs.'],['Active Treatment','Follow planned movements with monitoring and adjustments.'],['Retention & Follow-up','Retainers and reviews help maintain alignment after treatment.']];document.getElementById('smileSteps') && (document.getElementById('smileSteps').innerHTML=steps.map(([title,desc],i)=>`<article class="step reveal"><b>${String(i+1).padStart(2,'0')}</b><h3>${title}</h3><p>${desc}</p></article>`).join(''));
const questions=[['Are clear aligners better than braces?','Neither is best for everyone. The appropriate choice depends on your clinical needs, treatment complexity, lifestyle and compliance.'],['How long does smile correction take?','Treatment varies from several months to a few years. Your dentist can provide an estimate after assessment.'],['Can adults get braces or clear aligners?','Yes. Adults may have orthodontic treatment if their teeth and gums are suitable following assessment.'],['Will my teeth move back after treatment?','Teeth can shift after treatment. Retainers and follow-up care help maintain alignment.'],['Can I start treatment if I live outside Surat?','You can enquire, but orthodontics needs ongoing monitoring. Discuss visits and follow-up arrangements before starting.']];document.getElementById('smileFaq') && (document.getElementById('smileFaq').innerHTML=questions.map(([q,a],i)=>`<details ${i===0?'open':''}><summary>${q}</summary><p>${a}</p></details>`).join(''));
const slides=[...document.querySelectorAll('.slide')], slideTitles=['Thoughtful Dental Care.<br><em>Confident Smiles.</em>','Your Smile Deserves<br><em>Personalised Care.</em>','Explore Care for a<br><em>Healthier Smile.</em>'], slideDescriptions=['Your smile deserves care that feels personal. Explore appropriate dental treatments with clear communication and a patient-focused approach.','From root canal treatment to cosmetic dentistry, orthodontics and dental implants, we help you understand your options.','At Image Dental Care & Implant Centre, our aim is to support informed decisions, comfort and long-term oral health.'];let slide=0;const title=document.getElementById('heroTitle'),description=document.getElementById('heroDescription'),count=document.getElementById('slideIndex');function showSlide(n){slide=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===slide));title.innerHTML=slideTitles[slide];description.textContent=slideDescriptions[slide];count.textContent=`0${slide+1} / 0${slides.length}`}document.getElementById('prev')?.addEventListener('click',()=>showSlide(slide-1));document.getElementById('next')?.addEventListener('click',()=>showSlide(slide+1));const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;if(slides.length && !reducedMotion)setInterval(()=>{if(!document.hidden)showSlide(slide+1)},6500);
const menu=document.getElementById('menu'),nav=document.getElementById('navlinks');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.09});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));document.getElementById('year').textContent=new Date().getFullYear();const today=new Date();const iso=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;document.querySelectorAll('input[type=date]').forEach(e=>e.min=iso);
const modal=document.getElementById('bookingModal');let previousFocus=null;function openModal(service){previousFocus=document.activeElement;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';if(service)document.getElementById('modalService').value=service;modal.querySelector('[data-close]').focus()}function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';previousFocus?.focus()}document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.service)));document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeModal));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal();if(e.key==='Tab'&&modal.classList.contains('open')){let focusable=[...modal.querySelectorAll('button,input,select')];if(e.shiftKey&&document.activeElement===focusable[0]){e.preventDefault();focusable.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===focusable.at(-1)){e.preventDefault();focusable[0].focus()}}});
function inquiry(form){const data=new FormData(form);return `Appointment enquiry — Image Dental Care & Implant Centre\nName: ${data.get('name')}\nContact: ${data.get('phone')}\nService: ${data.get('service')}\nPreferred date: ${data.get('date')}\nPlease contact me to discuss availability.`}document.querySelectorAll('#contactForm,#modalForm').forEach(form=>form.addEventListener('submit',async e=>{e.preventDefault();const result=inquiry(form),status=form.querySelector('.form-status');try{await navigator.clipboard.writeText(result);status.textContent='Enquiry copied. Please paste and send it to the clinic.'}catch{status.textContent='Copy the enquiry below and share it with the clinic. '+result.replaceAll('\n',' | ')} }));document.querySelectorAll('[data-whatsapp]').forEach(b=>b.addEventListener('click',()=>{openModal('Braces & Clear Aligners');const status=document.querySelector('#modalForm .form-status');status.textContent='Complete the enquiry and copy it to share with the clinic.'}));




// Treatments menu: click/tap, outside click, Escape and keyboard support.
document.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
  const trigger = dropdown.querySelector('.dropdown-trigger');
  if (!trigger) return;

  function setOpen(open) {
    dropdown.classList.toggle('expanded', open);
    trigger.setAttribute('aria-expanded', String(open));
  }

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!dropdown.classList.contains('expanded'));
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) setOpen(false);
  });

  dropdown.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      trigger.focus();
    }
  });

  dropdown.querySelectorAll('.dropdown-items a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
});
