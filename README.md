# 해밀리그룹 홈페이지 클론코딩

> CSS 학습 후 실전 퍼블리싱 역량을 기르기 위해 실제 기업 사이트를 선택하여 클론코딩한 프로젝트입니다.

---

## 프로젝트 소개

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 해밀리그룹 홈페이지 클론코딩 |
| 원본 사이트 | [hemilygroup.com](https://hemilygroup.com) |
| 제작 목적 | HTML/CSS/javaScript 학습 이후 실무 수준의 퍼블리싱 경험을 쌓기 위해 실제 기업 사이트를 선택하여 구조 분석 → 설계 → 반응형 구현까지 직접 수행 |
| 제작 기간 | 3일 |

---

## 사용 기술

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

- **HTML5** — 시맨틱 마크업, 접근성 속성(aria-label, role 등)
- **CSS3** — CSS Variables, Flexbox, Grid, 미디어쿼리, 트랜지션/애니메이션
- **JavaScript** — 바닐라 JS, IntersectionObserver API, 터치/드래그 이벤트

---

## 주요 기능

**Hero 슬라이더**
- 자동 재생(3.8초 간격), 이전/다음 화살표 버튼
- 터치 스와이프 및 마우스 드래그 지원
- 탭 비활성 시 자동 재생 일시정지
- Ken Burns 효과 (is-active 클래스 기반)

**메가 메뉴 / 모바일 GNB**
- PC: 풀스크린 오버레이 메가 메뉴
- 모바일: 아코디언 방식 드로어 메뉴
- 스크롤 시 헤더 is-scrolled 클래스 전환

**서브 페이지 탭 네비게이션**
- 스크롤 위치 기반 활성 탭 자동 전환 (IntersectionObserver)
- 탭 클릭 시 scrollLock으로 오감지 방지
- 슬라이딩 인디케이터 바 (offsetLeft 기반 위치 계산)

**타임라인 + Sticky 사진 패널 (sub1)**
- 스크롤 구간별 사진 자동 교체 (data-photo 속성 기반)
- CSS position: sticky 활용
- 모바일 rootMargin 별도 보정

**브랜드 카드 스크롤 인터랙션**
- 이미지: 스프링 스케일 애니메이션 (is-visible 클래스)
- 텍스트: CSS transition-delay 스태거 효과

**뉴스룸 필터 탭 (sub5)**
- 카테고리별 카드 표시/숨김 (전체 / 매거진 / 보도자료)
- 서브 탭과 필터 탭 동기화

**반응형 레이아웃**
- 브레이크포인트: 1024px / 768px / 480px / 375px
- PC → 태블릿 → 모바일 전 페이지 대응

---

## 폴더 구조

```
hemily-group-clone/
├── index.html
├── contact.html
├── sub1.html
├── sub1_story.html
├── sub2.html
├── sub3.html
├── sub4.html
├── sub5.html
├── sub6.html
│
├── css/
│   ├── reset.css            # 브라우저 기본 스타일 초기화
│   ├── variables.css        # 디자인 토큰 (색상, 폰트, 간격 등)
│   ├── common.css           # 헤더, 푸터, GNB, 공통 컴포넌트
│   ├── main.css             # 메인 페이지 전용 스타일
│   ├── main_responsive.css  # 메인 페이지 반응형 패치
│   ├── sub1.css
│   ├── sub1_story.css
│   ├── sub2.css
│   ├── sub3.css
│   ├── sub4.css
│   ├── sub5.css
│   ├── sub6.css
│   └── contact.css
│
├── js/
│   ├── common.js            # 헤더 스크롤, 메가메뉴, TOP 버튼 공통
│   ├── main.js              # Hero 슬라이더, 브랜드 카드 인터랙션
│   ├── sub1.js              # 타임라인, LNB, Sticky 사진 패널
│   ├── sub2.js              # 탭 네비게이션, 스크롤 애니메이션
│   ├── sub3.js
│   ├── sub4.js
│   ├── sub5.js              # 뉴스룸 필터 탭
│   └── sub6.js
│
└── images/
    └── (배너, 로고, 상품 이미지 등)
```

---

## 문제 해결 과정

### 반응형 레이아웃 틀어짐

**문제**
서브 페이지 탭바(`.sub-page-nav`)의 슬라이더 인디케이터 위치가 모바일에서 어긋나는 현상이 발생했습니다. `getBoundingClientRect()`를 사용해 위치를 계산했을 때 부모 요소의 padding과 스크롤 오프셋이 함께 더해져 슬라이더가 탭 위치와 맞지 않았습니다.

**해결**
`getBoundingClientRect()` 대신 `offsetLeft`를 사용하는 방식으로 변경했습니다. `offsetLeft`는 부모 기준 상대 좌표를 반환하기 때문에 inner 컨테이너의 padding 영향을 받지 않아 정확한 위치 계산이 가능했습니다.

```js
// 수정 전
slider.style.left = tab.getBoundingClientRect().left + 'px';

// 수정 후
slider.style.left = tab.offsetLeft + 'px';
```

### 탭 클릭 시 활성 탭이 덮어씌워지는 문제

**문제**
탭을 클릭해 해당 섹션으로 스크롤하는 동안 `IntersectionObserver`가 중간에 지나치는 다른 섹션을 감지하면서 활성 탭이 의도와 다르게 바뀌는 현상이 발생했습니다.

**해결**
탭 클릭 시 `scrollLock` 플래그를 `true`로 설정하고, smooth scroll 예상 소요 시간(1초) 이후 자동 해제하는 방식으로 IO 오감지를 차단했습니다.

### `메디컬 기반` 탭 클릭 시 `공간&레지던스`가 활성화되는 현상

**문제**
sub2.js에서 탭 선택자로 `.biz-inner-tab`과 `data-tab`을 사용했으나 실제 HTML에는 `.sub-page-tab`과 `data-section`이 적용되어 있어 탭 연동 자체가 동작하지 않았고, 스크롤 감지 로직이 어긋나 엉뚱한 탭이 활성화되었습니다.

**해결**
JS 선택자를 HTML 실제 클래스명에 맞게 수정하고, IntersectionObserver 방식의 탭 감지를 스크롤 위치 기반 감지로 교체했습니다.

---

## 회고

처음 클론코딩을 시작했을 때 HTML 구조를 대략적으로 잡고 CSS를 붙이는 방식으로 진행했는데, 중반부터 반응형 작업 시 예상치 못한 레이아웃 틀어짐이 반복해서 발생했습니다.

돌아보면 원인은 하나였습니다. **구조를 먼저 정하지 않고 시각적인 결과물을 보면서 코드를 쌓아나갔기 때문**입니다. 컴포넌트 단위로 구조를 먼저 설계하고, 변수(variables.css)와 공통 스타일(common.css)의 역할을 명확히 분리한 뒤 작업했더라면 훨씬 적은 수정으로 같은 결과를 낼 수 있었을 것입니다.

또한 JavaScript 작업에서 선택자 불일치로 인해 기능이 아예 동작하지 않는 상황을 겪으며, 마크업과 스크립트가 같은 클래스명을 기준으로 연결된다는 점을 체감했습니다. HTML 구조를 먼저 확정하고 JS를 작성하는 순서가 왜 중요한지 알게 된 경험이었습니다.

---

## 라이선스

본 프로젝트는 학습 목적으로 제작되었습니다. 원본 사이트의 디자인 및 콘텐츠 저작권은 해밀리그룹에 있습니다.
