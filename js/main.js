/**
 * main.js  v3
 * ─ Hero: 화살표 + is-active + 인디케이터 + 빠른 자동재생
 */

 function initHeroSlider() {
  const track   = document.querySelector('.hero__track');
  const slides  = [...document.querySelectorAll('.hero__slide')];
  const numEl   = document.querySelector('.hero__indicator-num');
  const prevBtn = document.querySelector('.hero__ind-prev, .hero__arrow--prev');
  const nextBtn = document.querySelector('.hero__ind-next, .hero__arrow--next');
  if (!track || !slides.length) return;

  let current = 0;
  let timer   = null;
  const INTERVAL = 3800; // 빠르게

  /* 슬라이드 이동 */
  function goTo(idx) {
    // is-active 제거
    slides[current].classList.remove('is-active');

    current = (idx + slides.length) % slides.length;

    // 트랙 이동
    track.style.transform = `translateX(-${current * 100}%)`;

    // is-active 추가 (Ken Burns 트리거)
    slides[current].classList.add('is-active');

    // 인디케이터 숫자
    if (numEl) numEl.textContent = String(current + 1).padStart(2, '0');
  }

  const start = () => { timer = setInterval(() => goTo(current + 1), INTERVAL); };
  const stop  = () => clearInterval(timer);

  /* 화살표 클릭 */
  prevBtn?.addEventListener('click', () => { stop(); goTo(current - 1); start(); });
  nextBtn?.addEventListener('click', () => { stop(); goTo(current + 1); start(); });

  /* 터치 스와이프 */
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stop(); }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    start();
  });

  /* 마우스 드래그 */
  let mouseX = 0, isDragging = false;
  track.addEventListener('mousedown',  e => { mouseX = e.clientX; isDragging = true; stop(); });
  track.addEventListener('mouseup',    e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = mouseX - e.clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    start();
  });
  track.addEventListener('mouseleave', () => { if (isDragging) { isDragging = false; start(); } });

  /* 탭 비활성 시 일시정지 */
  document.addEventListener('visibilitychange', () =>
    document.hidden ? stop() : start()
  );

  /* 초기화 */
  goTo(0);
  start();
}

document.addEventListener('DOMContentLoaded', initHeroSlider);

/* ── 브랜드 카드 스크롤 인터랙션 ── */
function initBrandCards() {
  const images = [...document.querySelectorAll('.brand-row__image')];
  const texts  = [...document.querySelectorAll('.brand-row__text')];
  if (!images.length && !texts.length) return;

  const opts = { threshold: 0.18, rootMargin: '0px 0px -40px 0px' };

  /* 이미지: 즉시 스케일 스프링 */
  const imgIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        imgIo.unobserve(e.target);
      }
    });
  }, opts);

  /* 텍스트: CSS transition-delay 0.15s 로 자동 스태거 */
  const txtIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        txtIo.unobserve(e.target);
      }
    });
  }, opts);

  images.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-visible');
    else imgIo.observe(el);
  });

  texts.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-visible');
    else txtIo.observe(el);
  });
}
document.addEventListener('DOMContentLoaded', initBrandCards);