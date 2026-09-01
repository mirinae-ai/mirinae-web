import type { Transition, Variants } from 'motion/react';

/**
 * 랜딩 전체가 같은 물성으로 움직이도록 트랜지션을 한곳에 모았다.
 * 각 컴포넌트가 저마다 스프링을 조율하면 페이지가 여러 개의 부품처럼 읽힌다.
 */

/** 나타나기 · 사라지기. 오버슈트 없이 한 번에 자리를 잡는다. */
export const ENTER: Transition = { type: 'spring', duration: 0.6, bounce: 0 };

/** 손이 닿는 것(버튼 · 아코디언). 조금 더 짧고 살짝 튄다. */
export const RESPOND: Transition = { type: 'spring', duration: 0.4, bounce: 0.2 };

/**
 * 스크롤에 맞춰 올라오는 기본 등장.
 *
 * 움직임을 줄이기로 한 사람에게는 `MotionConfig reducedMotion="user"` 가
 * y 를 떼고 투명도만 남긴다 — 없애는 것이 아니라 순하게 만든다.
 */
export const RISE: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0 },
};

/** 한 덩어리 안의 줄들이 차례로 올라오게 한다. */
export const STAGGER: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** 화면에 얼마나 들어왔을 때 시작할지. 한 번만 재생한다 — 되돌아올 때마다 다시 뛰면 산만하다. */
export const VIEWPORT = { once: true, amount: 0.35 } as const;
