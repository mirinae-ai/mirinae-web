import { useRef } from 'react';
import { MotionConfig, motion, useScroll, useSpring, useTransform } from 'motion/react';

import {
  BriefcaseIcon,
  EmotionIcon,
  HealthIcon,
  HeartIcon,
  LeafIcon,
  MoneyIcon,
} from './AreaIcons';
import { ENTER, RISE, STAGGER, VIEWPORT } from './motion';

/**
 * 산 안쪽 — 앱이 무엇인지 말하는 자리.
 *
 * 히어로의 앞 능선이 #3d347e 로 끝나고 이 섹션이 같은 색에서 시작한다. 스크롤이
 * 능선을 넘어 산 안으로 내려가는 것처럼 이어지고, 아래로 갈수록 색이 깊어진다.
 * 문구는 한 번에 하나씩만 올라온다 — 한꺼번에 나타나면 목록으로 읽히고,
 * 이 섹션은 목록이 아니라 내려가는 길이다.
 */

/** 이름과 글리프는 앱의 `AREA_PRESENTATION` 과 같은 짝이다. */
const AREAS = [
  { label: 'Love', Icon: HeartIcon },
  { label: 'Emotion', Icon: EmotionIcon },
  { label: 'Career', Icon: BriefcaseIcon },
  { label: 'Health', Icon: HealthIcon },
  { label: 'Money', Icon: MoneyIcon },
  { label: 'Growth', Icon: LeafIcon },
];

const BLOCKS = [
  {
    eyebrow: 'Every morning',
    title: 'Today’s sky, read against your chart.',
    body: 'Mirinae computes your natal chart once, from your birth date, time and place. After that, each day’s transits are read against it — one reading a day, free.',
  },
  {
    eyebrow: 'Six areas',
    title: 'You see where the weather actually is.',
    body: 'Love, Emotion, Career, Health, Money and Growth, ordered by what is strongest for you today — so you know where to look first.',
    areas: true,
  },
  {
    eyebrow: 'Chat',
    title: 'A conversation that already knows your chart.',
    body: 'No re-explaining yourself. Ask what is on your mind and the answer is read against your own placements, not a sun sign.',
  },
  {
    eyebrow: 'Reports',
    title: 'One question, answered in writing.',
    body: 'Pick a question, answer a few prompts, and Mirinae writes a reading built from your chart and what you told it. It lands in your library and stays there.',
  },
  {
    eyebrow: 'No black box',
    title: 'Every reading names what it came from.',
    body: 'The transits behind a reading are listed next to it. You can see the basis instead of taking it on faith.',
  },
];

/** 블록 사이를 잇는 짧은 실. 내려가는 길이라는 것을 말없이 알려 준다. */
function Thread() {
  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-2 py-14 sm:py-20">
      <span className="h-16 w-px bg-gradient-to-b from-white/0 via-white/25 to-white/0" />
      <span className="h-1.5 w-1.5 rotate-45 bg-white/35" />
      <span className="h-16 w-px bg-gradient-to-b from-white/0 via-white/25 to-white/0" />
    </div>
  );
}

function AreaChips() {
  return (
    <motion.ul
      /*
       * 여섯 개가 한 줄에 들어가야 "여섯 영역"으로 읽힌다. 5 + 1 로 접히면 마지막
       * 하나가 덤처럼 보인다. 글 단(max-w-2xl)보다 조금 넓게 빼서 한 줄을 지킨다.
       */
      className="-mx-4 mt-8 flex flex-wrap justify-center gap-2.5 sm:-mx-14"
      variants={STAGGER}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}>
      {AREAS.map((area) => (
        <motion.li
          key={area.label}
          variants={RISE}
          transition={ENTER}
          className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/6 py-1.5 pl-2 pr-4 text-sm font-medium text-white/85">
          <area.Icon className="h-7 w-7" />
          {area.label}
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function MountainStory() {
  const scope = useRef<HTMLElement>(null);

  /*
   * 산 안의 먼지가 스크롤보다 조금 느리게 따라온다. 스프링을 한 겹 끼우는 것은
   * 스크롤 값을 그대로 쓰면 손가락에 붙어 움직여 배경이 아니라 또 하나의 전경이 되기 때문이다.
   */
  const { scrollYProgress } = useScroll({ target: scope, offset: ['start end', 'end start'] });
  const drift = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), {
    stiffness: 60,
    damping: 20,
    mass: 0.4,
  });

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={scope}
        id="what-it-is"
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #3d347e 0%, #2f275c 42%, #221c2b 100%)' }}>
        {/* 산 안의 결. 색이 아니라 아주 옅은 밝기 차이로만 층을 만든다 */}
        <motion.div
          aria-hidden="true"
          style={{ y: drift }}
          className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-70">
          <div className="absolute left-[12%] top-[14%] h-64 w-64 rounded-full bg-[#eab4d7]/10 blur-3xl" />
          <div className="absolute right-[8%] top-[46%] h-72 w-72 rounded-full bg-[#9dbef1]/10 blur-3xl" />
          <div className="absolute left-[38%] bottom-[10%] h-56 w-56 rounded-full bg-[#7c5dfa]/12 blur-3xl" />
        </motion.div>

        <div className="relative mx-auto max-w-2xl px-6 py-28 sm:py-36">
          {BLOCKS.map((block, index) => (
            <div key={block.eyebrow}>
              {index > 0 ? <Thread /> : null}

              <motion.div
                className="text-center"
                variants={STAGGER}
                initial="hidden"
                whileInView="shown"
                viewport={VIEWPORT}>
                <motion.p
                  variants={RISE}
                  transition={ENTER}
                  className="text-[12px] font-semibold uppercase tracking-[0.2em] text-area-emotion">
                  {block.eyebrow}
                </motion.p>
                <motion.h2
                  variants={RISE}
                  transition={ENTER}
                  className="mt-4 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {block.title}
                </motion.h2>
                <motion.p
                  variants={RISE}
                  transition={ENTER}
                  className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
                  {block.body}
                </motion.p>
              </motion.div>

              {block.areas ? <AreaChips /> : null}
            </div>
          ))}

          <Thread />

          {/* 경계를 분명히 해 두는 한 문장. 앱이 하지 않는 것을 말한다 */}
          <motion.blockquote
            variants={RISE}
            initial="hidden"
            whileInView="shown"
            viewport={VIEWPORT}
            transition={ENTER}
            className="mx-auto max-w-xl text-balance text-center text-2xl font-semibold leading-snug sm:text-[28px]">
            <span className="block text-white/90">“It doesn’t tell you what will happen.</span>
            <span className="mt-2 block text-white/55">It gives you something to think with.”</span>
          </motion.blockquote>
        </div>

        {/* 산에서 다시 밖으로 — 밝은 봉우리가 어둠을 뚫고 올라온다 */}
        <svg
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
          className="block h-[80px] w-full sm:h-[130px]"
          aria-hidden="true">
          <path
            d="M0 122 L118 96 L264 44 L358 108 L522 18 L648 96 L806 56 L938 114 L1082 38 L1200 88 V160 H0 Z"
            fill="#fcfcfc"
          />
        </svg>
      </section>
    </MotionConfig>
  );
}

export default MountainStory;
