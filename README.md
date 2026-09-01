# mirinae-web

Mirinae 앱의 랜딩 페이지. Astro + React 아일랜드 + Tailwind v4, 정적 빌드.

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # dist/ 로 정적 출력
pnpm check     # astro check (타입)
```

## 배포

Vercel 이 `astro build` -> `dist/` 를 그대로 감지한다. 저장소를 import 하면 설정 없이 붙고,
어댑터도 필요 없다 (SSR 이 없다). 나중에 서버 렌더가 필요해지면 `npx astro add vercel` 로
`@astrojs/vercel` 을 붙이고 `output` 을 바꾸면 된다.

## 구조

```
src/
  components/
    Miru.tsx           마스코트. 앱의 src/components/ui/miru.tsx 를 옮긴 것
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
```

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
