/**
 * sub3.js — 헤밀리 브랜드 상품 페이지 v2
 * ─ js-ready 스크롤 애니메이션
 * ─ 상품 카드 순차 등장
 */

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-ready');

  const targets = [...document.querySelectorAll('.s3-up')];
  if (!targets.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-on');
      io.unobserve(e.target);
    });
  }, { threshold: 0, rootMargin: '0px' });

  targets.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.classList.add('is-on');
    } else {
      io.observe(el);
    }
  });
});