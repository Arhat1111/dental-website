// Simple page navigation and booking interactions for treatment pages.
const menu=document.getElementById('menu'), nav=document.getElementById('navlinks');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰';});
document.querySelectorAll('.dropdown-toggle').forEach(button=>button.addEventListener('click',()=>{const panel=button.closest('.nav-dropdown');const open=panel.classList.toggle('expanded');button.setAttribute('aria-expanded',String(open));}));
const modal=document.getElementById('bookingModal');
function openBooking(service){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';const select=document.getElementById('modalService');if(service&&select){if(![...select.options].some(o=>o.value===service)){select.add(new Option(service,service));}select.value=service;}}
function closeBooking(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>openBooking(b.dataset.service)));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeBooking));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeBooking();});
const today=new Date();const localDate=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
document.querySelectorAll('input[type=date]').forEach(x=>x.min=localDate);
// Service-page booking form: visitor sends prepared details in WhatsApp.
document.querySelectorAll('#modalForm').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const message = [
    'Hello Image Dental Care & Implant Centre,',
    'I would like to enquire about an appointment.',
    'Name: ' + String(values.get('name') || '').trim(),
    'Contact number: ' + String(values.get('phone') || '').trim(),
    'Treatment: ' + String(values.get('service') || 'General consultation'),
    'Preferred date: ' + String(values.get('date') || 'Please advise'),
    'Please confirm availability. Thank you.'
  ].join('\n');
  const url = 'https://wa.me/919662165644?text=' + encodeURIComponent(message);
  const tab = window.open(url, '_blank', 'noopener,noreferrer');
  const status = form.querySelector('.form-status');
  if (status) {
    status.classList.add('whatsapp-ready');
    status.textContent = tab === null
      ? 'Please open WhatsApp using the link below and send your enquiry. Our team will update you soon.'
      : 'WhatsApp is ready with your booking details. Tap Send there. Our team will update you about your enquiry soon.';
    let retry = form.querySelector('.whatsapp-retry');
    if (!retry) {
      retry = document.createElement('a'); retry.className = 'whatsapp-retry';
      retry.target = '_blank'; retry.rel = 'noopener noreferrer';
      retry.textContent = 'Open WhatsApp to send enquiry ↗';
      retry.style.cssText = 'display:inline-block;color:#157c62;text-decoration:underline;font-weight:700;margin-top:6px';
      status.insertAdjacentElement('afterend', retry);
    }
    retry.href = url;
  }
}));

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
