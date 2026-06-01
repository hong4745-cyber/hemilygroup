document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-ready');

  const targets = [...document.querySelectorAll('.s6-up')];
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-on');
      io.unobserve(e.target);
    });
  }, { threshold: 0, rootMargin: '0px' });

  targets.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-on');
    else io.observe(el);
  });
});
