import { useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';

import { ENTER, RESPOND, RISE, VIEWPORT } from './motion';

/**
 * 자주 묻는 질문.
 *
 * 한 번에 하나만 열린다 — 여러 개가 열려 있으면 답이 어디서 끝나는지 흐려진다.
 * 높이는 0 <-> auto 로 오간다. Motion 이 이 한 방향은 대신 재 주기 때문에
 * 내용이 고정된 이 목록에서는 따로 측정할 필요가 없다.
 */

const FAQS = [
  {
    id: 'what',
    q: 'What is Mirinae?',
    a: 'An astrology counseling app. It computes your natal chart from your birth date, time and place, reads each day’s sky against it, and gives you a daily reading, written reports, and a conversation that already knows your chart.',
  },
  {
    id: 'birth-time',
    q: 'I don’t know my birth time — does it matter?',
    a: 'It changes part of it, not all of it. Planets and signs are computed without a time; houses and your rising sign need one. You can start without it and add it later — your chart is recomputed when you do.',
  },
  {
    id: 'credits',
    q: 'How are credits used?',
    a: 'Your daily reading is free. Credits are spent on written reports and chat answers, and the price is shown before you spend anything. If a report fails to generate, nothing is charged.',
  },
  {
    id: 'generating',
    q: 'My report is still generating.',
    a: 'Reports are written after you answer a few questions, and usually land within a few minutes. You can leave the screen — it keeps writing, and it appears in your library when it is done.',
  },
  {
    id: 'predict',
    q: 'Does Mirinae predict the future?',
    a: 'No. It reads what is moving in your chart and helps you think it through. It is not a substitute for medical, legal, financial or mental-health advice.',
  },
  {
    id: 'data',
    q: 'Can I delete my data?',
    a: 'Yes. Settings → Account → Delete account removes your birth details, chart, daily readings and conversations for good. See the privacy policy for what is kept and for how long.',
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-brand"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      animate={{ rotate: open ? 180 : 0 }}
      transition={RESPOND}>
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  return (
    <MotionConfig reducedMotion="user">
      <ul className="mt-12 divide-y divide-line border-y border-line">
        {FAQS.map((faq, index) => {
          const open = openId === faq.id;

          return (
            <motion.li
              key={faq.id}
              variants={RISE}
              initial="hidden"
              whileInView="shown"
              viewport={VIEWPORT}
              transition={{ ...ENTER, delay: index * 0.04 }}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : faq.id)}
                  aria-expanded={open}
                  aria-controls={`faq-${faq.id}`}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left">
                  <span className="text-base font-semibold text-ink sm:text-lg">{faq.q}</span>
                  <Chevron open={open} />
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    key="answer"
                    id={`faq-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={RESPOND}
                    className="overflow-hidden">
                    {/* 여백은 안쪽에 둔다 — 바깥에 두면 닫힐 때 높이가 0 이어도 자리가 남는다 */}
                    <p className="max-w-2xl pb-6 pr-10 text-base leading-relaxed text-ink-soft">
                      {faq.a}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </MotionConfig>
  );
}

export default Faq;
