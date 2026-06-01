/**
 * sub1.js v3
 * ─ LNB 스크롤 활성화
 * ─ 전체 섹션 스크롤 인터랙션 (s-fade-up/left/right/scale, tl-in)
 * ─ 타임라인 + 좌측 스티키 사진 패널 (settle 효과)
 * ─ 우측 틱 인디케이터 호버 인터랙션
 */

 const qs  = s => document.querySelector(s);
 const qsa = s => [...document.querySelectorAll(s)];
 
 /* ──────────────────────────────────────────────
    1. 전체 섹션 공통 스크롤 인터랙션
    ────────────────────────────────────────────── */
 function initScrollAnimations() {
   const SEL = '.s-fade-up, .s-fade-left, .s-fade-right, .s-scale, .reveal, .reveal-scale, .reveal-scale-icon, .vision-circle--dark, .vision-circle--light';
   const targets = qsa(SEL);
   if (!targets.length) return;
 
   function activate(el) {
     el.classList.add('is-on', 'is-visible');
   }
 
   const io = new IntersectionObserver(entries => {
     entries.forEach(e => {
       if (!e.isIntersecting) return;
       activate(e.target);
       io.unobserve(e.target);
     });
   }, { threshold: 0, rootMargin: '0px' });
 
   targets.forEach(el => {
     const r = el.getBoundingClientRect();
     if (r.top < window.innerHeight && r.bottom > 0) {
       // 이미 보이는 요소: 즉시 활성화 (딜레이 없음)
       requestAnimationFrame(() => activate(el));
     } else {
       io.observe(el);
     }
   });
 }
 
 
 /* ──────────────────────────────────────────────
    2. LNB 스크롤 활성화
    ────────────────────────────────────────────── */
 function initLnb() {
   const sections = qsa('.vision-section, .biz-section, .story-section, .history-section');
   const lnbLinks = qsa('.lnb__link[data-section]');
   if (!sections.length || !lnbLinks.length) return;
 
   const io = new IntersectionObserver(entries => {
     entries.forEach(e => {
       if (!e.isIntersecting) return;
       const id = e.target.id;
       lnbLinks.forEach(l => l.classList.toggle('is-active', l.dataset.section === id));
     });
   }, { rootMargin: '-120px 0px -60% 0px', threshold: 0 });
 
   sections.forEach(s => io.observe(s));
 
   lnbLinks.forEach(link => {
     link.addEventListener('click', e => {
       e.preventDefault();
       const target = qs(link.getAttribute('href'));
       if (!target) return;
       window.scrollTo({
         top: target.getBoundingClientRect().top + window.scrollY - 100,
         behavior: 'smooth'
       });
     });
   });
 }
 
 
 /* ──────────────────────────────────────────────
    3. History: 타임라인 + 사진 패널 + 틱 인디케이터
    ────────────────────────────────────────────── */
 function initHistory() {
   const rows = [...document.querySelectorAll('.tl-row')];
   if (!rows.length) return;
 
   /* 스크롤 시 가운데 근처 행 활성화 */
   const io = new IntersectionObserver(entries => {
     entries.forEach(e => {
       if (e.isIntersecting) {
         e.target.classList.add('tl-active');
       } else {
         e.target.classList.remove('tl-active');
       }
     });
   }, {
     rootMargin: '-30% 0px -55% 0px',
     threshold: 0
   });
 
   rows.forEach(row => io.observe(row));
 
   /* 첫 행 초기 활성화 */
   if (rows[0]) rows[0].classList.add('tl-active');
 }
 
 /* ── 초기화 ── */
 document.addEventListener('DOMContentLoaded', () => {
   initScrollAnimations();
   initLnb();
   initHistory();
   initTlStickyPhoto();
 });
 
 
 /* ==============================================
    모바일 패치
    ============================================== */
 
 /* ── 타임라인 모바일 rootMargin 보정 ── */
 function initHistoryMobile() {
   if (window.innerWidth > 768) return;
   var rows = qsa('.tl-row');
   if (!rows.length) return;
 
   var io = new IntersectionObserver(function (entries) {
     entries.forEach(function (e) {
       e.target.classList.toggle('tl-active', e.isIntersecting);
     });
   }, { rootMargin: '-15% 0px -40% 0px', threshold: 0 });
 
   rows.forEach(function (row) { io.observe(row); });
   if (rows[0]) rows[0].classList.add('tl-active');
 }
 
 /* ── Vision 원 모바일 진입 감지 보완 ── */
 function patchVisionCirclesMobile() {
   if (window.innerWidth > 768) return;
   var circles = qsa('.vision-circle--dark, .vision-circle--light');
   if (!circles.length) return;
 
   var io = new IntersectionObserver(function (entries) {
     entries.forEach(function (e) {
       if (e.isIntersecting) { e.target.classList.add('is-on'); io.unobserve(e.target); }
     });
   }, { threshold: 0.1 });
 
   circles.forEach(function (el) {
     var r = el.getBoundingClientRect();
     if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-on');
     else io.observe(el);
   });
 }
 
 document.addEventListener('DOMContentLoaded', function () {
   initHistoryMobile();
   patchVisionCirclesMobile();
 });
 
 /* ── tl-photo 스크롤 인터랙션 ── */
 function initTlPhotoScroll() {
   const photos = qsa('.tl-photo');
   if (!photos.length) return;
 
   const io = new IntersectionObserver(entries => {
     entries.forEach(e => {
       if (e.isIntersecting) {
         /* 애니메이션 실행 */
         e.target.classList.add('is-on');
         io.unobserve(e.target);
       }
     });
   }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
 
   photos.forEach(el => {
     const r = el.getBoundingClientRect();
     if (r.top < window.innerHeight && r.bottom > 0) {
       /* 이미 뷰포트 안 → 애니메이션 없이 즉시 표시 */
       /* will-animate 부여 안 함 */
     } else {
       /* 뷰포트 밖 → will-animate 부여 후 감시 */
       el.classList.add('will-animate');
       io.observe(el);
     }
   });
 }
 
 /* ── 타임라인 sticky 사진 교체 ── */
 function initTlStickyPhoto() {
   const rows   = qsa('.tl-row[data-photo]');
   const imgs   = qsa('.tl-sticky-img');
   if (!rows.length || !imgs.length) return;
 
   const header = qs('.site-header');
   const subNav = qs('.sub-page-nav');
 
   function getOffset() {
     return (header ? header.offsetHeight : 72)
          + (subNav  ? subNav.offsetHeight  : 52)
          + 20;
   }
 
   function showPhoto(id) {
     imgs.forEach(img => {
       const active = img.dataset.photoId === id;
       img.classList.toggle('is-active', active);
     });
   }
 
   /* 스크롤 위치 기반으로 현재 구간 판별 */
   function detectPhoto() {
     const offset = getOffset();
     let current = rows[0].dataset.photo;
 
     rows.forEach(row => {
       const rect = row.getBoundingClientRect();
       if (rect.top <= offset) {
         current = row.dataset.photo;
       }
     });
     return current;
   }
 
   /* 초기 */
   showPhoto(detectPhoto());
 
   /* 스크롤 감지 */
   let rafId;
   window.addEventListener('scroll', function () {
     if (rafId) return;
     rafId = requestAnimationFrame(function () {
       showPhoto(detectPhoto());
       rafId = null;
     });
   }, { passive: true });
 }

/* ══════════════════════════════════════════════
   HISTORY — hg 구조 (CSS sticky)
   JS 불필요 — sticky 동작은 CSS가 처리
   ══════════════════════════════════════════════ */