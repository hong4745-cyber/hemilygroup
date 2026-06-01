/* ================================================
   sub5.js — 뉴스룸 필터 탭
   ================================================ */

(function () {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const cards      = document.querySelectorAll('.news-card');

  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      // 활성 탭 교체
      filterTabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');

      var filter = tab.dataset.filter;

      // 카드 표시/숨김
      cards.forEach(function (card) {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // sub-page-nav 탭 클릭 시 필터 동기화
  var subTabs = document.querySelectorAll('.sub-page-tab');
  subTabs.forEach(function (subTab) {
    subTab.addEventListener('click', function (e) {
      var section = subTab.dataset.section;
      var map = { magazine: 'magazine', press: 'press', 'main-content': 'all' };
      var target = map[section];
      if (!target) return;

      filterTabs.forEach(function (tab) {
        if (tab.dataset.filter === target) tab.click();
      });
    });
  });
})();
