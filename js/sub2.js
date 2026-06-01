/**
 * sub2.js — 사업분야 서브페이지
 * ─ 스크롤 인터랙션 (js-ready 방식)
 * ─ 탭 네비게이션 스크롤 활성화
 */

 window.qs  = window.qs  || (s => document.querySelector(s));
 window.qsa = window.qsa || (s => [...document.querySelectorAll(s)]);
 const qs = window.qs;
 const qsa = window.qsa;
 
 /* ──────────────────────────────────────────────
    1. 스크롤 인터랙션
    ────────────────────────────────────────────── */
 function initAnimations() {
 
   const targets = qsa('.s2-fade-up, .s2-fade-left, .s2-fade-right, .s2-scale');
 
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
 
   /* biz-hero: Ken Burns + 텍스트 순차 등장 */
   const heroes = qsa('.biz-hero');
   const heroIo = new IntersectionObserver(entries => {
     entries.forEach(e => {
       if (e.isIntersecting) {
         e.target.classList.add('is-entered');
         heroIo.unobserve(e.target);
       }
     });
   }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' });
 
   heroes.forEach(h => {
     const r = h.getBoundingClientRect();
     if (r.top < window.innerHeight && r.bottom > 0) h.classList.add('is-entered');
     else heroIo.observe(h);
   });
 }
 
 /* ──────────────────────────────────────────────
    2. 탭 네비게이션
    ────────────────────────────────────────────── */
 function initTabs() {
   const tabs     = qsa('.biz-inner-tab');
   const nav      = qs('.sub-tabs');
   const sections = qsa('#business, #education, #medical, #residence');
   if (!tabs.length || !sections.length) return;
 
   /* 슬라이딩 바 생성
      inner에 append → tab.offsetLeft 기준이 inner로 통일
      (nav에 append하면 inner의 padding/centering 오프셋만큼 어긋남) */
   const slider = document.createElement('div');
   slider.className = 'tab-slider';
   if (inner) inner.appendChild(slider);
 
   /* ── 슬라이더 위치 계산 ── */
   function moveSlider(tab) {
     if (!tab || !inner) return;
     slider.style.left  = tab.offsetLeft + 'px';
     slider.style.width = tab.offsetWidth + 'px';
   }
 
   function setActive(id) {
     tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === id));
     const active = tabs.find(t => t.dataset.tab === id);
     if (active) {
       moveSlider(active);
       /* 탭이 가로 스크롤 영역 밖이면 자동 스크롤 */
       scrollTabIntoView(active);
     }
   }
 
   /* 탭 가로 자동 스크롤 */
   function scrollTabIntoView(tab) {
     if (!nav) return;
     const navW    = nav.clientWidth;
     const tabLeft = tab.offsetLeft;
     const tabW    = tab.offsetWidth;
     const center  = tabLeft - (navW / 2) + (tabW / 2);
     nav.scrollTo({ left: center, behavior: 'smooth' });
   }
 
   /* 초기 슬라이더 위치: rAF + load 이중 폴백 */
   function initSlider() {
     const first = tabs.find(t => t.classList.contains('is-active')) || tabs[0];
     if (first) moveSlider(first);
   }
   requestAnimationFrame(initSlider);
   window.addEventListener('load', initSlider);
 
   /* ── 클릭 스크롤 잠금
      탭 클릭 후 smooth scroll 진행 중에 IO가 다른 섹션을 감지해
      active 탭을 덮어씌우는 문제 방지 ── */
   let scrollLock = false;
   let scrollLockTimer = null;
 
   function lockScroll(id) {
     scrollLock = true;
     clearTimeout(scrollLockTimer);
     /* smooth scroll 최대 소요 시간(1s) 후 잠금 해제 */
     scrollLockTimer = setTimeout(() => { scrollLock = false; }, 1000);
   }
 
   /* ── 스크롤 시 탭 + 슬라이더 이동
      잠금 중에는 IO 감지 무시 ── */
   const io = new IntersectionObserver(entries => {
     if (scrollLock) return;
     entries.forEach(e => {
       if (e.isIntersecting) setActive(e.target.id);
     });
   }, { rootMargin: '-124px 0px -60% 0px', threshold: 0 });
 
   sections.forEach(s => io.observe(s));
 
   /* ── 탭 클릭: 헤더 + 탭바 실측값으로 오프셋 계산 ── */
   tabs.forEach(tab => {
     tab.addEventListener('click', e => {
       e.preventDefault();
 
       const id = tab.dataset.tab;
       setActive(id);   /* 즉시 active 설정 */
       lockScroll(id);  /* IO 잠금 시작 */
 
       const target = qs(tab.getAttribute('href'));
       if (!target) return;
 
       const headerEl = qs('.site-header');
       const headerH  = headerEl ? headerEl.offsetHeight : 72;
       const navH     = nav      ? nav.offsetHeight      : 52;
 
       window.scrollTo({
         top: target.getBoundingClientRect().top + window.scrollY - (headerH + navH),
         behavior: 'smooth'
       });
     });
   });
 
   /* 리사이즈 대응 */
   window.addEventListener('resize', () => {
     const active = tabs.find(t => t.classList.contains('is-active'));
     if (active) moveSlider(active);
   });
 }
 
 /* ──────────────────────────────────────────────
    초기화
    ────────────────────────────────────────────── */
 document.addEventListener('DOMContentLoaded', () => {
   initAnimations();
   initTabs();
 });
 
 /* ==============================================
    모바일 패치
    ============================================== */
 
 /* ── biz-hero 모바일 진입 감지 보완 ── */
 (function () {
   if (window.innerWidth > 768) return;
   document.addEventListener('DOMContentLoaded', function () {
     var heroes = qsa('.biz-hero');
     if (!heroes.length) return;
     var io = new IntersectionObserver(function (entries) {
       entries.forEach(function (e) {
         if (e.isIntersecting) { e.target.classList.add('is-entered'); io.unobserve(e.target); }
       });
     }, { threshold: 0.05 });
     heroes.forEach(function (h) {
       var r = h.getBoundingClientRect();
       if (r.top < window.innerHeight && r.bottom > 0) h.classList.add('is-entered');
       else io.observe(h);
     });
   });
 }());
 
 /* ── overview-cards 애니메이션 폴백 ── */
 (function () {
   if (window.innerWidth > 768) return;
   document.addEventListener('DOMContentLoaded', function () {
     var cards = qsa('.ov-card');
     if (!cards.length) return;
     var needsPatch = cards.some(function (c) { return !c.classList.contains('s2-fade-up'); });
     if (!needsPatch) return;
 
     var io = new IntersectionObserver(function (entries) {
       entries.forEach(function (e) {
         if (e.isIntersecting) {
           e.target.style.opacity   = '1';
           e.target.style.transform = 'none';
           io.unobserve(e.target);
         }
       });
     }, { threshold: 0.05 });
 
     cards.forEach(function (card, i) {
       card.style.opacity    = '0';
       card.style.transform  = 'translateY(16px)';
       card.style.transition = 'opacity .5s ease ' + (i * 80) + 'ms, transform .5s ease ' + (i * 80) + 'ms';
       io.observe(card);
     });
   });
 }());