import { MotionConfig, motion } from 'motion/react';

import { ENTER, RISE, STAGGER } from './motion';
import Miru from './Miru';
import StoreButtons from './StoreButtons';

/**
 * 히어로 — 산 위의 Miru.
 *
 * 산등성이는 Miru 몸통의 그라디언트 네 정거장을 뒤에서 앞으로 늘어놓은 것이다.
 * 멀리 있는 능선일수록 옅고(#aabcf4), 앞으로 올수록 짙어져(#3d347e) 다음 섹션의
 * 배경색과 정확히 같은 값으로 끝난다 — 스크롤이 산 안으로 이어져 보이게 하는 이음매다.
 *
 * SVG 는 `preserveAspectRatio="none"` 이라 가로세로가 따로 늘어난다. 능선은 직선이라
 * 늘어나도 직선으로 남고, 대신 뷰박스 좌표 -> 백분율 변환이 정확해져서 Miru 를
 * 봉우리에 %로 세울 수 있다. 마스코트 자체는 왜곡되면 안 되므로 SVG 안이 아니라
 * 그 위에 HTML 로 얹는다.
 */

/** 능선 SVG 의 좌표계. Miru 의 좌표도 이 값을 기준으로 백분율이 된다. */
const RIDGE = { w: 1200, h: 520 };

/** 앞 능선의 정상 — 큰 Miru 가 서는 자리 */
const SUMMIT = { x: 600, y: 150 };
/** 가운데 능선의 두 봉우리 — 작은 Miru 둘. 앞 능선보다 위라 가려지지 않는다. */
const LOOKOUT_LEFT = { x: 470, y: 215 };
const LOOKOUT_RIGHT = { x: 980, y: 280 };

/**
 * 별.
 *
 * 좌표를 난수로 뽑으면 서버에서 그린 것과 브라우저가 다시 그린 것이 어긋나
 * 하이드레이션이 깨진다. 그래서 손으로 흩뿌린 값을 그대로 둔다.
 */
const STARS = [
  { x: 8, y: 16, r: 1.6, d: 0.0 },
  { x: 16, y: 32, r: 1.1, d: 0.8 },
  { x: 23, y: 9, r: 2.1, d: 1.5 },
  { x: 31, y: 24, r: 1.2, d: 0.4 },
  { x: 42, y: 13, r: 1.5, d: 1.1 },
  { x: 55, y: 7, r: 1.1, d: 1.9 },
  { x: 63, y: 21, r: 1.8, d: 0.6 },
  { x: 71, y: 11, r: 1.3, d: 1.3 },
  { x: 78, y: 29, r: 2.2, d: 0.2 },
  { x: 87, y: 17, r: 1.4, d: 1.7 },
  { x: 93, y: 34, r: 1.2, d: 0.9 },
  { x: 12, y: 44, r: 1.3, d: 2.1 },
  { x: 36, y: 40, r: 1.0, d: 1.4 },
  { x: 68, y: 42, r: 1.1, d: 0.5 },
  { x: 96, y: 12, r: 1.6, d: 2.4 },
];

function Sky() {
  return (
    <>
      {/* 새벽 하늘 — 위는 옅은 보라, 아래로 갈수록 종이색 */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-brand-wash via-brand-soft to-paper" />
      {/* 오른쪽 위 홍조. Miru 의 큰 반짝임과 같은 색이라 캐릭터가 하늘에서 떨어져 나오지 않는다 */}
      <div
        aria-hidden="true"
        className="absolute -top-24 right-[-10%] -z-20 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(234,180,215,0.5), rgba(234,180,215,0) 68%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -left-32 top-32 -z-20 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(157,190,241,0.42), rgba(157,190,241,0) 70%)' }}
      />
    </>
  );
}

function Stars() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {STARS.map((star) => (
        <motion.span
          key={`${star.x}-${star.y}`}
          className="absolute rounded-full bg-brand"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.r * 2,
            height: star.r * 2,
          }}
          initial={{ opacity: 0.18 }}
          animate={{ opacity: [0.18, 0.75] }}
          transition={{
            duration: 2.4,
            delay: star.d,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/**
 * 봉우리 위의 Miru.
 *
 * 아트보드에서 그림자가 지는 선은 y=104 — 발이 닿는 자리다. 상자 높이의 81.25%
 * 지점이지만 그만큼을 그대로 올리면 뾰족한 꼭짓점 위에 걸터앉은 것처럼 떠 보인다.
 * 몇 %만 덜 올려서 그림자가 능선 안쪽에 잠기게 하면 비로소 얹혀 있는 것으로 읽힌다.
 */
function OnPeak({
  at,
  className,
  arm = true,
  delay = 0,
}: {
  at: { x: number; y: number };
  className: string;
  arm?: boolean;
  delay?: number;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: `${(at.x / RIDGE.w) * 100}%`,
        top: `${(at.y / RIDGE.h) * 100}%`,
        transform: 'translate(-50%, -72%)',
      }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ENTER, delay }}>
        <Miru arm={arm} className="h-auto w-full" />
      </motion.div>
    </div>
  );
}

function Ridges() {
  return (
    <svg
      viewBox={`0 0 ${RIDGE.w} ${RIDGE.h}`}
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true">
      <defs>
        <linearGradient id="ridge-front" x1="0" y1="150" x2="0" y2="520" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5b4fc8" />
          <stop offset="1" stopColor="#3d347e" />
        </linearGradient>
        <linearGradient id="ridge-haze" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fcfcfc" stopOpacity="0" />
          <stop offset="0.55" stopColor="#fcfcfc" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fcfcfc" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 가장 먼 능선 */}
      <path
        d="M0 318 L120 236 L232 292 L360 196 L470 268 L600 192 L742 286 L864 224 L1000 300 L1104 252 L1200 302 V520 H0 Z"
        fill="#aabcf4"
        fillOpacity="0.45"
      />
      {/* 능선 사이에 낀 안개. 층이 겹쳐 보이지 않게 한 겹 끊어 준다 */}
      <rect x="0" y="238" width="1200" height="130" fill="url(#ridge-haze)" />

      <path
        d="M0 372 L150 300 L286 352 L470 215 L590 318 L700 262 L846 348 L980 280 L1108 356 L1200 322 V520 H0 Z"
        fill="#8882e6"
        fillOpacity="0.62"
      />
      <rect x="0" y="300" width="1200" height="120" fill="url(#ridge-haze)" opacity="0.7" />

      {/* 앞 능선. 아래 끝이 다음 섹션의 배경색(#3d347e)과 같은 값으로 끝난다 */}
      <path
        d="M0 428 L150 362 L320 404 L600 150 L772 336 L900 292 L1064 386 L1200 350 V520 H0 Z"
        fill="url(#ridge-front)"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        className="relative isolate overflow-hidden"
        style={{ ['--ridge-h' as string]: 'clamp(240px, 46vh, 520px)' }}>
        <Sky />
        <Stars />

        <div className="mx-auto flex min-h-[100svh] max-w-3xl flex-col justify-center px-6 pt-28 pb-[var(--ridge-h)] sm:pt-32">
          <motion.div
            className="flex flex-col items-center text-center"
            variants={STAGGER}
            initial="hidden"
            animate="shown">
            <motion.p
              variants={RISE}
              transition={ENTER}
              className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
              Astrology counseling
            </motion.p>

            <motion.h1
              variants={RISE}
              transition={ENTER}
              className="wordmark mt-4 text-6xl font-bold text-ink sm:text-7xl">
              Mirinae
            </motion.h1>

            <motion.p
              variants={RISE}
              transition={ENTER}
              className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              Personalized astrology counseling that helps you think through what’s on your mind,
              using your birth chart.
            </motion.p>

            <motion.div variants={RISE} transition={ENTER} className="mt-9">
              <StoreButtons />
            </motion.div>

            <motion.p variants={RISE} transition={ENTER} className="mt-5 text-sm text-ink-soft">
              Sign in with Apple or Google. No payment screen before your first reading.
            </motion.p>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[var(--ridge-h)]">
          <Ridges />

          <OnPeak
            at={LOOKOUT_LEFT}
            arm={false}
            delay={0.34}
            className="hidden w-[clamp(38px,4.4vw,60px)] sm:block"
          />
          <OnPeak
            at={LOOKOUT_RIGHT}
            arm={false}
            delay={0.42}
            className="hidden w-[clamp(30px,3.4vw,48px)] sm:block"
          />
          <OnPeak at={SUMMIT} delay={0.22} className="w-[clamp(84px,10vw,132px)]" />
        </div>
      </section>
    </MotionConfig>
  );
}

export default Hero;
