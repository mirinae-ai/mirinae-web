// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

/**
 * 사이트의 절대 주소.
 *
 * og:image 와 canonical 은 절대 URL 이어야 한다 — 미리보기를 만드는 쪽(슬랙 · 카카오 · X)은
 * 우리 페이지가 어디에 있는지 모른 채 이 값만 보고 가져간다. 여기에 손으로 적은 도메인을
 * 박아 두면 그 도메인이 아직 없는 동안 미리보기가 통째로 깨진다 — 실제로 그렇게 깨졌다.
 *
 * 그래서 빌드하는 환경에게 묻는다:
 *   1. `PUBLIC_SITE_URL` — 직접 정할 때 (스테이징 등)
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` — Vercel 이 빌드 때 넣어 주는 이 프로젝트의 운영 도메인.
 *      나중에 mirinae.app 을 커스텀 도메인으로 붙이면 이 값이 알아서 그것으로 바뀐다.
 *   3. 그 밖(로컬 빌드) — 지금의 운영 주소.
 */
const site =
  process.env.PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://mirinae-web-beta.vercel.app');

// https://astro.build/config
export default defineConfig({
  site,

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});
