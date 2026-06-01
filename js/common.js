/**
 * common.js  ★ 실제 헤밀리그룹 기준 재작성
 * ─ 헤더 스크롤 (흰 배경 고정, 스크롤 시 그림자)
 * ─ 모바일 메뉴
 * ─ 스크롤 탑 (민트 TOP 버튼)
 * ─ Intersection Observer 스크롤 애니메이션
 * ─ 카운트업
 */

/* ── 유틸 ── */
const qs  = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

function debounce(fn, ms = 80) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}


/* ── 1. 헤더 스크롤 그림자 ── */
function initHeader() {
  const header = qs('.site-header');
  if (!header) return;

  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  update();
  window.addEventListener('scroll', debounce(update, 10), { passive: true });
}


/* ── 2. 모바일 메뉴 ── */
function initMobileMenu() {
  const toggle = qs('.menu-toggle');
  const menu   = qs('#mobile-menu');
  if (!toggle || !menu) return;

  /* 햄버거 버튼 */
  toggle.addEventListener('click', () => {
    if (window.innerWidth > 768) return;
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* 큰 제목(mob-link) 클릭 → 서브메뉴 슬라이드 토글 */
  qsa('.mob-link', menu).forEach(link => {
    const item = link.closest('.mob-item');
    const sub  = item?.querySelector('.mob-sub');
    const btn  = item?.querySelector('.mob-toggle');
    if (!sub) return;   /* 서브 없으면 바로 이동 */

    link.addEventListener('click', e => {
      e.preventDefault();  /* 기본 이동 막고 서브 토글 */
      const isOpen = sub.classList.toggle('is-open');
      btn?.classList.toggle('is-open', isOpen);
      btn?.setAttribute('aria-expanded', String(isOpen));
    });
  });

  /* › 버튼도 동일 */
  qsa('.mob-toggle', menu).forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.closest('.mob-item').querySelector('.mob-sub');
      if (!sub) return;
      const isOpen = sub.classList.toggle('is-open');
      btn.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  /* 서브 링크 클릭 → 메뉴 닫고 이동 */
  qsa('.mob-sub__link', menu).forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* 서브 없는 최상위 링크(해밀리人) */
  qsa('.mob-item', menu).forEach(item => {
    if (!item.querySelector('.mob-sub')) {
      item.querySelector('.mob-link')?.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }
  });

  /* 외부 클릭 닫기 */
  document.addEventListener('click', e => {
    if (window.innerWidth > 768) return;
    if (!e.target.closest('#mobile-menu') && !e.target.closest('.menu-toggle')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}


/* ── 3. 스크롤 탑 ── */
function initScrollTop() {
  const btn = qs('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll',
    debounce(() => btn.classList.toggle('is-visible', window.scrollY > 400), 80),
    { passive: true }
  );
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* ── 4. 스크롤 인 애니메이션 ── */
function initScrollReveal() {
  document.body.classList.add('js-ready');
  const targets = qsa('.reveal, .reveal-scale, .reveal-top, .reveal-scale-icon, .s-fade-up, .s-fade-left, .s-fade-right, .s-scale, .s2-fade-up, .s2-fade-left, .s2-fade-right, .s2-scale, .s6-up');
  if (!targets.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible', 'is-on');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px' });

  targets.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.classList.add('is-visible', 'is-on');
    } else {
      io.observe(el);
    }
  });
}


/* ── 5. 숫자 카운트업 (data-count-target) ── */
function initCountUp() {
  const counters = qsa('[data-count-target]');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);

      const el      = e.target;
      const target  = parseFloat(el.dataset.countTarget);
      const dur     = parseInt(el.dataset.countDuration ?? 1800);
      const suffix  = el.dataset.countSuffix ?? '';
      const dec     = parseInt(el.dataset.countDecimals ?? 0);
      const start   = performance.now();

      const step = now => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(2, -10 * p);
        el.textContent = (target * ease).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(dec) + suffix;
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.3 });

  counters.forEach(el => io.observe(el));
}


/* ── 6. 드롭다운 (hover + click + keyboard) ── */
function initDropdown() {
  qsa('.gnb__item').forEach(item => {
    const link     = qs('.gnb__link', item);
    const dropdown = qs('.gnb__dropdown', item);
    if (!link || !dropdown) return;

    /* 키보드 */
    link.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = link.getAttribute('aria-expanded') === 'true';
        link.setAttribute('aria-expanded', String(!isOpen));
        dropdown.style.opacity    = isOpen ? '' : '1';
        dropdown.style.visibility = isOpen ? '' : 'visible';
        dropdown.style.transform  = isOpen ? '' : 'translateY(0)';
      }
      if (e.key === 'Escape') {
        link.setAttribute('aria-expanded', 'false');
        dropdown.style.opacity = dropdown.style.visibility = dropdown.style.transform = '';
        link.focus();
      }
    });

    /* 터치/클릭: href가 있으면 첫 번째 탭은 이동, 두 번째는 드롭다운 토글 */
    let touchToggle = false;
    link.addEventListener('touchstart', () => { touchToggle = true; }, { passive:true });
    link.addEventListener('click', e => {
      if (!touchToggle) return;
      touchToggle = false;
      const isOpen = dropdown.style.visibility === 'visible';
      if (!isOpen) {
        e.preventDefault();
        // 다른 드롭다운 닫기
        qsa('.gnb__dropdown').forEach(d => {
          d.style.opacity = d.style.visibility = d.style.transform = '';
        });
        dropdown.style.opacity    = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform  = 'translateY(0)';
      }
    });
  });

  /* 외부 클릭 시 드롭다운 닫기 */
  document.addEventListener('click', e => {
    if (!e.target.closest('.gnb__item')) {
      qsa('.gnb__dropdown').forEach(d => {
        d.style.opacity = d.style.visibility = d.style.transform = '';
      });
    }
  });
}


/* ── 초기화 ── */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollTop();
  initScrollReveal();
  initCountUp();
  initDropdown();
  initMegaMenu();
  initSubPageNav();
});


/* ── 메가 메뉴 ── */
function initMegaMenu() {
  const btn  = document.querySelector('.menu-toggle');
  const mega = document.getElementById('megaMenu');
  if (!btn || !mega) return;

  function open() {
    mega.classList.add('is-open');
    document.body.classList.add('mega-open');   /* X 표시 */
    mega.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    mega.classList.remove('is-open');
    document.body.classList.remove('mega-open');  /* 햄버거 복귀 */
    mega.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* 햄버거/X 클릭 */
  btn.addEventListener('click', () => {
    if (window.innerWidth <= 768) return;
    mega.classList.contains('is-open') ? close() : open();
  });

  /* ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  /* 링크 클릭 시 닫기 */
  mega.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}



/* ── 서브/홈 고정 탭바 슬라이딩 인디케이터 ── */
function initSubPageNav() {
  const nav    = document.getElementById('subPageNav');
  const slider = document.getElementById('subNavSlider');
  if (!nav) return;

  const tabs  = [...nav.querySelectorAll('.sub-page-tab')];
  const inner = nav.querySelector('.sub-page-nav__inner');
  if (!tabs.length || !inner) return;

  /* 슬라이더 위치: tab.offsetLeft 는 inner 기준이므로 inner 안에 있어야 정확 */
  function moveSlider(tab) {
    if (!slider || !tab) return;
    slider.style.left  = tab.offsetLeft + 'px';
    slider.style.width = tab.offsetWidth + 'px';
  }

  /* 탭 활성화 */
  function setActive(id) {
    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.section === id));
    const active = tabs.find(t => t.dataset.section === id);
    if (!active) return;
    moveSlider(active);
    /* 탭이 가로 영역 밖이면 자동 스크롤 */
    inner.scrollTo({
      left: active.offsetLeft - inner.clientWidth / 2 + active.offsetWidth / 2,
      behavior: 'smooth'
    });
  }

  /* 초기 슬라이더 */
  function initSlider() {
    const first = tabs.find(t => t.classList.contains('is-active')) || tabs[0];
    if (first) moveSlider(first);
  }
  requestAnimationFrame(initSlider);
  window.addEventListener('load', initSlider);

  /* ──────────────────────────────────────────
     스크롤 위치 기반 활성 섹션 감지
     IntersectionObserver 제거:
     → 스크롤 중 경유 섹션이 active 되는 버그 원천 차단
     ────────────────────────────────────────── */
  const sections = tabs
    .map(t => document.getElementById(t.dataset.section))
    .filter(Boolean);

  function getScrollOffset() {
    const h = document.querySelector('.site-header');
    return (h ? h.offsetHeight : 72) + nav.offsetHeight + 4;
  }

  function detectActive() {
    const offset = getScrollOffset();
    let current = sections[0] ? sections[0].id : null;
    sections.forEach(s => {
      if (s.getBoundingClientRect().top <= offset) current = s.id;
    });
    return current;
  }

  /* 클릭 스크롤 중 scroll 이벤트 차단 */
  let scrollLock = false;
  let lockTimer  = null;

  function releaseLock() {
    scrollLock = false;
    clearTimeout(lockTimer);
  }

  /* 수동 스크롤 시 탭 업데이트 */
  window.addEventListener('scroll', function () {
    if (scrollLock) return;
    const id = detectActive();
    if (id) setActive(id);
  }, { passive: true });

  /* 탭 클릭 */
  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();

      const id     = tab.dataset.section;
      const target = document.getElementById(id);
      if (!target) return;

      /* 즉시 active 반영 후 스크롤 잠금 */
      setActive(id);
      scrollLock = true;
      clearTimeout(lockTimer);

      const offset = getScrollOffset();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });

      /* 스크롤 멈추면 잠금 해제 */
      let endTimer;
      const onScroll = function () {
        clearTimeout(endTimer);
        endTimer = setTimeout(function () {
          releaseLock();
          window.removeEventListener('scroll', onScroll);
        }, 150);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      lockTimer = setTimeout(releaseLock, 2000); /* 최대 2초 fallback */
    });
  });

  /* 페이지 로드 시 해시 처리 */
  window.addEventListener('load', function () {
    const hash = location.hash.replace('#', '');
    const matchTab = tabs.find(t => t.dataset.section === hash);
    if (matchTab) {
      setActive(hash);
      /* 해시 위치로 정확히 재스크롤 */
      const target = document.getElementById(hash);
      if (target) {
        setTimeout(function () {
          const offset = getScrollOffset();
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - offset,
            behavior: 'auto'
          });
        }, 50);
      }
    } else {
      const id = detectActive();
      if (id) setActive(id);
    }
  });

  /* 리사이즈 */
  window.addEventListener('resize', () => {
    const active = tabs.find(t => t.classList.contains('is-active'));
    if (active) moveSlider(active);
  });
}

/* ==============================================
   모바일 패치
   ============================================== */

/* ── 1. 리사이즈 / 화면 회전 대응 ── */
function initResizeGuard() {
  window.addEventListener('resize', debounce(function () {
    var toggle     = qs('.menu-toggle');
    var mobileMenu = qs('#mobile-menu');
    var megaMenu   = document.getElementById('megaMenu');
    var isDesktop  = window.innerWidth > 768;

    if (isDesktop) {
      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
        toggle && toggle.setAttribute('aria-expanded', 'false');
      }
    } else {
      if (megaMenu && megaMenu.classList.contains('is-open')) {
        megaMenu.classList.remove('is-open');
        document.body.classList.remove('mega-open');
        megaMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  }, 200));
}

/* ── 2. 활성 탭 가로 자동 스크롤 ── */
function patchTabAutoScroll(navSelector, innerSelector, tabSelector) {
  var nav = document.querySelector(navSelector);
  if (!nav) return;
  var inner = nav.querySelector(innerSelector);
  if (!inner) return;

  function scrollActive(tab) {
    var iRect = inner.getBoundingClientRect();
    var tRect = tab.getBoundingClientRect();
    if (tRect.left >= iRect.left && tRect.right <= iRect.right) return;
    inner.scrollTo({ left: tab.offsetLeft + tab.offsetWidth / 2 - inner.clientWidth / 2, behavior: 'smooth' });
  }

  var mo = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.type === 'attributes' && m.attributeName === 'class' && m.target.classList.contains('is-active')) {
        scrollActive(m.target);
      }
    });
  });
  nav.querySelectorAll(tabSelector).forEach(function (t) { mo.observe(t, { attributes: true }); });
}

/* ── 3. 푸터 주소 모바일 줄바꿈 ── */
function fixFooterMobile() {
  if (window.innerWidth > 768) return;
  var p = document.querySelector('.footer-address p:first-child');
  if (!p) return;
  p.querySelectorAll('span').forEach(function (s) {
    s.style.display = 'block';
    s.style.marginRight = '0';
    s.style.marginBottom = '2px';
  });
}

/* ── 패치 초기화 (기존 DOMContentLoaded에 병합) ── */
document.addEventListener('DOMContentLoaded', function () {
  initResizeGuard();
  patchTabAutoScroll('#subPageNav', '.sub-page-nav__inner', '.sub-page-tab');
  patchTabAutoScroll('.sub-tabs',   '.sub-tabs__inner',     '.sub-tab, .biz-inner-tab');
  fixFooterMobile();
});