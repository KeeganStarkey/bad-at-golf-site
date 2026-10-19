// Page chrome shared by every page: header, mobile menu, mobile enquire bar,
// footer wordmark, hover-to-swap background footage, enquiry form.

const $ = (s: string) => document.querySelector<HTMLElement>(s);

/* Header goes solid once you scroll past the hero; mobile bar shows between hero and the form */
const hdr = $('#hdr')!, mBar = $('#m-bar'), hero = $('[data-hero]'), enq = $('#enquire');
function chrome() {
  const heroEnd = hero ? hero.getBoundingClientRect().bottom : 0;
  hdr.classList.toggle('solid', document.body.classList.contains('menu-open') || (hero ? heroEnd <= hdr.offsetHeight + 1 : scrollY > 8));
  if (mBar) {
    const er = enq?.getBoundingClientRect();
    const enqInView = !!er && er.top < innerHeight * 0.85 && er.bottom > 0;
    const show = (hero ? heroEnd < innerHeight * 0.4 : scrollY > innerHeight * 0.5) && !enqInView;
    mBar.classList.toggle('show', show);
    mBar.toggleAttribute('inert', !show);
  }
}
let ticking = false;
addEventListener('scroll', () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; chrome(); }); }, { passive: true });
chrome();

/* Mobile menu */
const menuBtn = $('#menu-btn'), mnav = $('#mnav');
function setMenu(open: boolean) {
  if (!menuBtn || !mnav) return;
  menuBtn.setAttribute('aria-expanded', String(open));
  mnav.classList.toggle('open', open);
  mnav.toggleAttribute('inert', !open);
  document.body.classList.toggle('menu-open', open);
  chrome();
}
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
mnav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); } });
addEventListener('resize', () => { if (innerWidth > 900) setMenu(false); });

/* Footer wordmark fitted to the page width */
const fw = $('.foot-word');
function fitFoot() {
  if (!fw) return;
  fw.style.fontSize = '100px';
  const box = fw.parentElement!, w = fw.getBoundingClientRect().width;
  if (w && box.clientWidth) fw.style.fontSize = (100 * box.clientWidth / w * 0.995) + 'px';
}
let rt: number | undefined;
addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(() => { fitFoot(); chrome(); }, 120); });
document.fonts?.ready.then(fitFoot);
fitFoot();

/* Rows that change the footage behind them on hover or focus ([data-swap-for="<video id>"]) */
document.querySelectorAll<HTMLElement>('[data-swap-for]').forEach((list) => {
  const v = document.getElementById(list.dataset.swapFor!) as HTMLVideoElement | null;
  if (!v) return;
  list.querySelectorAll<HTMLElement>('[data-key]').forEach((row) => {
    const go = () => window.BAG?.swap(v, row);
    row.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') go(); });
    row.addEventListener('focus', go);
  });
});

/* Enquiry form: posts to Netlify Forms without leaving the page; without JS it posts to /thanks/ */
document.querySelectorAll<HTMLFormElement>('form[data-netlify]').forEach((form) => {
  const msg = form.querySelector<HTMLElement>('.form-msg');
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      const first = String(data.get('name') || '').trim().split(/\s+/)[0];
      form.querySelectorAll('fieldset,.fields,.fld,.send').forEach((el) => ((el as HTMLElement).hidden = true));
      if (msg) {
        msg.hidden = false; msg.classList.add('ok');
        msg.textContent = `Cheers${first ? ', ' + first : ''}. That's landed with Keegan and Sam, and you'll hear back within one working day.`;
        msg.focus();
      }
    } catch {
      if (msg) {
        msg.hidden = false; msg.classList.remove('ok');
        msg.innerHTML = 'That didn\'t send. Try again, or message us on <a href="' + (form.dataset.wa || '#') + '">WhatsApp</a> or by <a href="' + (form.dataset.mail || '#') + '">email</a>.';
        msg.focus();
      }
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Send it'; }
    }
  });
});
