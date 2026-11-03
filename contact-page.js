// Contact page form: opens a WhatsApp draft; user must tap Send to submit.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactPageForm');
  if (!form) return;
  const dateInput = form.querySelector('input[type="date"]');
  const now = new Date();
  dateInput.min = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const msg = [
      'Hello Image Dental Care & Implant Centre,',
      'I would like to enquire about an appointment.',
      `Name: ${String(values.get('name') || '').trim()}`,
      `Phone: ${String(values.get('phone') || '').trim()}`,
      `Treatment: ${String(values.get('service') || '').trim()}`,
      `Preferred date: ${String(values.get('date') || '').trim()}`,
      'Please confirm availability. Thank you.'
    ].join('\n');
    const url = `https://wa.me/919662165644?text=${encodeURIComponent(msg)}`;
    const status = document.getElementById('contactPageStatus');
    status.replaceChildren();
    status.append(document.createTextNode('WhatsApp is ready. Please tap Send there to submit your enquiry. Our team can then follow up. '));
    const retry = document.createElement('a');
    retry.href=url; retry.target='_blank'; retry.rel='noopener noreferrer';
    retry.textContent='Open WhatsApp ↗';
    retry.style.cssText='display:inline-block;color:#176f57;text-decoration:underline';
    status.append(retry);
    window.open(url,'_blank','noopener,noreferrer');
  });
});
