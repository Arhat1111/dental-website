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
document.querySelectorAll('#modalForm').forEach(form=>form.addEventListener('submit',async e=>{e.preventDefault();const d=new FormData(form);const msg=`Appointment enquiry — Image Dental Care & Implant Centre\nName: ${d.get('name')}\nContact: ${d.get('phone')}\nService: ${d.get('service')}\nPreferred date: ${d.get('date')}\nPlease contact me about availability.`;const status=form.querySelector('.form-status');try{await navigator.clipboard.writeText(msg);status.textContent='Enquiry copied. Please paste and send it to the clinic.';}catch{status.textContent=msg.replaceAll('\n',' | ');}}));
document.querySelector('#year').textContent=new Date().getFullYear();


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
