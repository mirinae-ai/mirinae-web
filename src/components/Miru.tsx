import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Miru — Mirinae의 마스코트.
 *
 * 앱의 `src/components/ui/miru.tsx` 를 웹으로 옮긴 것이다. 레이어 분리와 좌표,
 * 박자는 그쪽을 정본으로 삼는다 — 두 곳의 캐릭터가 다르게 움직이면 같은 캐릭터로
 * 읽히지 않는다. 앱은 레이어마다 SVG 파일을 하나씩 얹지만 여기서는 SVG 하나 안의
 * `<g>` 로 나눈다. `transform-box: view-box` 를 주면 회전축을 아트보드 좌표(0 0 128 128)
 * 그대로 적을 수 있어서, 앱의 상수를 숫자까지 그대로 가져올 수 있다.
 */

/** Figma 아트보드 한 변. 아래 좌표는 전부 이 좌표계다. */
const ART = 128;

/** 팔이 몸통에 붙는 지점 — 손을 흔들 때의 회전축 */
const ARM_PIVOT = { x: 12.19, y: 76.79 };
/** 두 눈의 세로 중심 — 눈을 감을 때 위아래로 모이는 선 */
const EYE_CENTER = { x: 57.64, y: 78.54 };
/** 오른쪽 위 점 두 개의 중심 */
const SPARK_LG_CENTER = { x: 110, y: 23.3 };
const SPARK_SM_CENTER = { x: 117.14, y: 39.13 };

/** 팔이 흔들리는 폭. 정지 상태를 기준으로 좌우 대칭이다. */
const WAVE_ANGLE = 13;
/** 좌 -> 우 한 번에 걸리는 시간 */
const WAVE_DURATION = 0.4;
const PULSE_DURATION = 0.9;

/**
 * 눈 깜빡임. 한 바퀴 = 뜬 채로 기다리는 시간 + 감기 + 뜨기.
 * 감는 것이 뜨는 것보다 빨라야 눈꺼풀처럼 읽힌다.
 */
const BLINK_CLOSE = 0.07;
const BLINK_OPEN = 0.09;
const BLINK_GAP = 3.2;
const BLINK_CYCLE = BLINK_GAP + BLINK_CLOSE + BLINK_OPEN;
/**
 * 나타나고 한 번 일찍 깜빡인 뒤 느긋한 박자로 넘어간다. 평소 간격을 그대로 쓰면
 * 스치듯 지나가는 화면에서는 한 번도 깜빡이지 않아 그림처럼 보인다.
 */
const BLINK_FIRST = 0.7;
/** 감았을 때 남기는 세로 비율. 0 까지 누르면 얼굴에 구멍이 난 것처럼 보인다. */
const BLINK_MIN = 0.1;

/** 회전·확대 축을 아트보드 좌표로 적기 위한 스타일. */
function pivot(point: { x: number; y: number }) {
  return {
    transformBox: 'view-box',
    transformOrigin: `${point.x}px ${point.y}px`,
  } as const;
}

export type MiruProps = {
  /** 손 흔들기 · 반짝임 · 깜빡임을 끄고 정지 상태로 그린다. */
  animated?: boolean;
  /** 팔을 그릴지. 작게 쓰면 덩어리로만 읽혀서 빼는 쪽이 또렷하다. */
  arm?: boolean;
  className?: string;
  /** 장식으로 쓸 때는 비운다. 화면 낭독기가 읽을 이름이 있으면 넣는다. */
  title?: string;
};

export function Miru({ animated = true, arm = true, className, title }: MiruProps) {
  const reducedMotion = useReducedMotion();
  // 장식용 모션이라 움직임을 줄이기로 한 사람에게는 아예 정지시킨다.
  const isAnimated = animated && !reducedMotion;

  // 한 페이지에 Miru 가 여럿 서 있다. id 가 겹치면 먼저 그려진 쪽의 그라디언트가
  // 나중 것에도 적용돼 색이 어긋난다.
  const uid = useId().replace(/:/g, '');
  const id = (name: string) => `miru-${name}-${uid}`;

  const loop = (duration: number, delay = 0) =>
    ({
      duration,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }) as const;

  return (
    <svg
      viewBox={`0 0 ${ART} ${ART}`}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg">
      {title ? <title>{title}</title> : null}

      <defs>
        <filter
          id={id('blur')}
          x="9.18113"
          y="93.8591"
          width="99.4189"
          height="21.089"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="2.00846" result="blur" />
        </filter>

        <linearGradient
          id={id('body')}
          x1="13.7002"
          y1="45.6558"
          x2="101.068"
          y2="94.8631"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#AABCF4" />
          <stop offset="0.34" stopColor="#8882E6" />
          <stop offset="0.7" stopColor="#5B4FC8" />
          <stop offset="1" stopColor="#3D347E" />
        </linearGradient>

        <radialGradient
          id={id('glow')}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(80.9836 45.6557) rotate(90) scale(36.1523 42.1777)">
          <stop stopColor="#ECB4D9" stopOpacity="0.86" />
          <stop offset="1" stopColor="#ECB4D9" stopOpacity="0" />
        </radialGradient>

        <mask id={id('clip')} style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="4" y="28" width="120" height="72">
          <path
            d="M11.6917 91.3483C-1.86542 81.306 3.65784 65.2383 19.2234 62.2256C14.2023 47.6643 25.7509 36.1156 40.8144 39.1283C48.3461 24.0648 72.4477 24.5669 78.9752 39.6304C94.0386 31.5966 111.613 41.6389 107.596 58.7108C123.663 60.2171 129.689 77.2891 117.638 88.8377C106.089 100.888 26.7552 103.399 11.6917 91.3483Z"
            fill="white"
          />
        </mask>
      </defs>

      {/* 바닥에 지는 그림자 */}
      <g filter={`url(#${id('blur')})`}>
        <path
          d="M58.8906 110.931C84.1258 110.931 104.583 108.009 104.583 104.403C104.583 100.798 84.1258 97.876 58.8906 97.876C33.6553 97.876 13.1981 100.798 13.1981 104.403C13.1981 108.009 33.6553 110.931 58.8906 110.931Z"
          fill="#4D438A"
          fillOpacity="0.15"
        />
      </g>

      {/* 몸통 */}
      <path
        d="M11.6917 91.3483C-1.86542 81.306 3.65784 65.2383 19.2234 62.2256C14.2023 47.6643 25.7509 36.1156 40.8144 39.1283C48.3461 24.0648 72.4477 24.5669 78.9752 39.6304C94.0386 31.5966 111.613 41.6389 107.596 58.7108C123.663 60.2171 129.689 77.2891 117.638 88.8377C106.089 100.888 26.7552 103.399 11.6917 91.3483Z"
        fill={`url(#${id('body')})`}
      />

      {/* 몸통 안에서만 보이는 홍조와 아래쪽 그늘 */}
      <g mask={`url(#${id('clip')})`}>
        <path
          d="M83.4942 84.3186C104.57 84.3186 121.655 67.2335 121.655 46.1578C121.655 25.0822 104.57 7.99707 83.4942 7.99707C62.4185 7.99707 45.3334 25.0822 45.3334 46.1578C45.3334 67.2335 62.4185 84.3186 83.4942 84.3186Z"
          fill={`url(#${id('glow')})`}
        />
        <path
          d="M6.6705 88.3358C31.7763 98.8802 96.5492 101.893 122.659 85.8252L126.174 109.927H2.65357L6.6705 88.3358Z"
          fill="#332A74"
          fillOpacity="0.18"
        />
      </g>

      {/* 입 */}
      <path
        d="M57.8863 86.7288C58.8569 86.7288 59.6437 86.0994 59.6437 85.3229C59.6437 84.5464 58.8569 83.917 57.8863 83.917C56.9157 83.917 56.1289 84.5464 56.1289 85.3229C56.1289 86.0994 56.9157 86.7288 57.8863 86.7288Z"
        fill="#2F275C"
      />

      {/*
       * 눈. 위아래로만 눌린다 — 두 눈의 중심선을 축으로 잡아야 눈꺼풀이 내려오는 것처럼 보인다.
       * 되감기(reverse)를 쓰지 않는 것은 감기와 뜨기의 빠르기가 달라야 하기 때문이다.
       */}
      <motion.g
        style={pivot(EYE_CENTER)}
        animate={isAnimated ? { scaleY: [1, BLINK_MIN, 1, 1] } : undefined}
        transition={
          isAnimated
            ? {
                duration: BLINK_CYCLE,
                delay: BLINK_FIRST,
                times: [0, BLINK_CLOSE / BLINK_CYCLE, (BLINK_CLOSE + BLINK_OPEN) / BLINK_CYCLE, 1],
                ease: ['easeIn', 'easeOut', 'linear'],
                repeat: Number.POSITIVE_INFINITY,
              }
            : undefined
        }>
        <path
          d="M52.8652 81.055C54.1131 81.055 55.1247 79.8186 55.1247 78.2934C55.1247 76.7682 54.1131 75.5317 52.8652 75.5317C51.6173 75.5317 50.6057 76.7682 50.6057 78.2934C50.6057 79.8186 51.6173 81.055 52.8652 81.055Z"
          fill="#2F275C"
        />
        <path
          d="M62.4054 81.3058C63.5146 81.3058 64.4138 80.1818 64.4138 78.7952C64.4138 77.4087 63.5146 76.2847 62.4054 76.2847C61.2961 76.2847 60.3969 77.4087 60.3969 78.7952C60.3969 80.1818 61.2961 81.3058 62.4054 81.3058Z"
          fill="#2F275C"
        />
      </motion.g>

      {/* 손 흔들기 */}
      {arm ? (
        <motion.g
          style={pivot(ARM_PIVOT)}
          animate={isAnimated ? { rotate: [-WAVE_ANGLE, WAVE_ANGLE] } : undefined}
          transition={isAnimated ? loop(WAVE_DURATION) : undefined}>
          <path
            d="M12.1938 76.7868C7.17267 75.2804 4.66209 71.2635 4.66209 67.2466"
            stroke="#463A8E"
            strokeWidth="3.01269"
            strokeLinecap="round"
          />
        </motion.g>
      ) : null}

      <motion.g
        style={pivot(SPARK_LG_CENTER)}
        animate={isAnimated ? { scale: [1, 1.14] } : undefined}
        transition={isAnimated ? loop(PULSE_DURATION) : undefined}>
        <path
          d="M102.072 23.0606C104.583 18.0394 110.106 16.5331 114.123 19.5458C118.14 23.0606 115.63 28.5839 109.604 30.0902C103.579 28.5839 100.064 26.5754 102.072 23.0606Z"
          fill="#EAB4D7"
        />
      </motion.g>

      {/* 두 점이 같은 박자로 뛰지 않도록 작은 쪽을 반 박자 늦추고, 진폭은 키운다 */}
      <motion.g
        style={pivot(SPARK_SM_CENTER)}
        animate={isAnimated ? { scale: [1, 1.22] } : undefined}
        transition={isAnimated ? loop(PULSE_DURATION, PULSE_DURATION / 2) : undefined}>
        <path
          d="M117.136 41.6388C118.522 41.6388 119.647 40.5148 119.647 39.1283C119.647 37.7417 118.522 36.6177 117.136 36.6177C115.749 36.6177 114.625 37.7417 114.625 39.1283C114.625 40.5148 115.749 41.6388 117.136 41.6388Z"
          fill="#9DBEF1"
        />
      </motion.g>
    </svg>
  );
}

export default Miru;
