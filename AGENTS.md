## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## 이 저장소

Mirinae 앱(`../mirinae`, Expo)의 랜딩 페이지다. 영문 한 페이지 + 개인정보처리방침.

- 브랜드 토큰과 마스코트(Miru)의 정본은 앱이다. `README.md` 의 "손대기 전에 알아 둘 것" 참고.
- 애니메이션은 `motion/react`. 트랜지션 상수는 `src/components/motion.ts` 한 곳에 모은다.
- 아일랜드는 Hero(`client:load`) · MountainStory(`client:visible`) · Faq(`client:visible`) 셋뿐이다.
  나머지 React 컴포넌트는 지시어 없이 정적 HTML 로만 나간다.
