# mirinae-web

Mirinae 앱의 랜딩 페이지. Astro + React 아일랜드 + Tailwind v4, 정적 빌드.

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # dist/ 로 정적 출력
pnpm check     # astro check (타입)
```

## 배포

Vercel. 저장소가 private 이라 Git import 대신 CLI 로 올린다:

```bash
vercel --prod --yes
```

현재 운영 주소는 https://mirinae-web-beta.vercel.app 다.

정적 빌드라 어댑터는 필요 없다. 나중에 서버 렌더가 필요해지면 `npx astro add vercel` 로
`@astrojs/vercel` 을 붙이고 `output` 을 바꾸면 된다.

### 사이트 주소

`og:image` 와 `canonical` 은 절대 URL 이라 빌드가 자기 주소를 알아야 한다. 손으로 적어 두면
그 도메인이 없는 동안 공유 미리보기가 통째로 깨진다 — 실제로 한 번 깨졌다. 그래서
`astro.config.mjs` 의 `site` 가 환경에게 묻는다:

1. `PUBLIC_SITE_URL` — 직접 정할 때
2. `VERCEL_PROJECT_PRODUCTION_URL` — Vercel 이 빌드 때 넣어 주는 이 프로젝트의 운영 도메인
3. 그 밖(로컬 빌드) — 지금의 운영 주소

**mirinae.app 같은 커스텀 도메인을 붙인 뒤에는 배포본의 `og:image` 가 그 도메인으로
바뀌었는지 한 번 확인한다.** 안 바뀌면 Vercel 프로젝트 환경변수에 `PUBLIC_SITE_URL` 을
직접 넣으면 된다.

## 구조

```
src/
  components/
    Miru.tsx           마스코트. 앱의 src/components/ui/miru.tsx 를 옮긴 것
    AreaIcons.tsx      여섯 영역 글리프. 앱의 assets/icons/paint/*.svg 를 옮긴 것
    Hero.tsx           산등성이 + 봉우리 위의 Miru
    MountainStory.tsx  산 안쪽 — 앱이 무엇인지 말하는 섹션
    Faq.tsx            자주 묻는 질문 아코디언
    StoreButtons.tsx   App Store / Google Play
    Reveal.tsx         스크롤 등장 래퍼
    motion.ts          트랜지션 상수 (한곳에서만 조율한다)
  layouts/Layout.astro
  pages/index.astro · privacy.astro
  styles/global.css    @theme 브랜드 토큰
  config.ts            스토어 링크 · 도메인 · 문의처
public/
  favicon.svg          배경판 없는 Miru
  og.png               공유 미리보기 1200x630
  apple-touch-icon.png iOS 홈 화면 180x180
scripts/
  brand-images.mjs     og.png · apple-touch-icon.png 를 굽는다
```

## 이미지 다시 굽기

`public/og.png` 와 `public/apple-touch-icon.png` 는 커밋된 결과물이다. 브랜드가 바뀌면
다시 굽는다:

```bash
node scripts/brand-images.mjs
```

설치된 Chrome 을 헤드리스로 써서 SVG 를 PNG 로 굽는다. 경로가 다르면 `CHROME_PATH`
환경변수로 알려 주면 된다. SVG 로 두지 않는 것은 슬랙 · 카카오 · X 의 미리보기가 SVG 를
읽지 않고, iOS 홈 화면 아이콘도 PNG 만 받기 때문이다.

## 손대기 전에 알아 둘 것

- **색과 마스코트의 정본은 앱이다.** `../mirinae/src/theme/tokens.ts` 와
  `../mirinae/assets/icons/miru/*.svg` 에서 가져왔다. 브랜드를 고칠 일이 생기면 앱을 먼저
  고치고 그 결과를 `src/styles/global.css` 와 `src/components/Miru.tsx` 로 옮긴다.
- **스토어 링크는 아직 비어 있다.** `src/config.ts` 의 `STORE_LINKS` 가 `null` 인 동안
  버튼은 "Coming soon" 으로 그려진다. 심사가 끝나면 거기만 채운다.
- **개인정보처리방침은 초안이다.** 앱이 실제로 다루는 데이터를 기준으로 썼지만
  스토어 제출 전에 법무 검토가 필요하다.
- 애니메이션은 `motion/react` 를 쓴다. 트랜지션은 `src/components/motion.ts` 한 곳에 모여
  있고, 각 아일랜드는 `MotionConfig reducedMotion="user"` 로 감싸 두었다 —
  움직임을 줄이기로 한 사람에게는 이동이 빠지고 투명도만 남는다.
