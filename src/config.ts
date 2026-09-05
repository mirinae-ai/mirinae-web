/**
 * 랜딩이 바깥으로 내보내는 값들.
 *
 * 스토어 링크는 아직 심사 전이라 자리만 잡아 두었다. 실제 URL 이 나오면 여기만 고치면
 * 히어로 · 푸터 · 다운로드 섹션이 함께 바뀐다. 값이 `null` 인 동안 버튼은 "Coming soon"
 * 상태로 그려지고 클릭되지 않는다 — 죽은 링크를 눌러 보게 하는 것보다 낫다.
 */

export const SITE = {
  name: 'Mirinae',
  tagline: 'Astrology counseling that reads your birth chart.',
  description:
    'Mirinae computes your birth chart, reads today’s sky against it, and helps you think through what’s on your mind — a daily reading, written reports, and a conversation that already knows your chart.',
} as const;

/** App Store / Google Play. 심사가 끝나면 null 을 URL 로 바꾼다. */
export const STORE_LINKS = {
  appStore: null as string | null,
  googlePlay: null as string | null,
} as const;

/*
 * 사이트의 절대 주소는 여기 없다 — `astro.config.mjs` 의 `site` 가 정본이고
 * 페이지에서는 `Astro.site` 로 읽는다. 배포 환경마다 달라지는 값이라 손으로 적지 않는다.
 */

/**
 * 문의처. 문의 · 개인정보 요청 · 약관 관련 연락을 한 주소로 받는다 —
 * 스토어 심사도, 개인정보처리방침도, 이용약관도 모두 이 값을 가리킨다.
 */
export const SUPPORT_EMAIL = 'support@peach.technology';

/** 운영 주체. 개인정보처리방침 · 이용약관에 그대로 적히는 법적 표기다. */
export const COMPANY = {
  legalName: 'Peach Technology, Inc.',
  jurisdiction: 'a Delaware corporation',
  address: '169 Madison Ave STE 15544, New York, NY 10016, US',
} as const;

/** 법적 문서의 최종 개정일. 내용을 고치면 같이 올린다. */
export const PRIVACY_UPDATED = 'September 5, 2026';
export const TERMS_UPDATED = 'September 5, 2026';
