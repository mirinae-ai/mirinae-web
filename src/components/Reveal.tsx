import type { ReactNode } from 'react';
import { motion } from 'motion/react';

import { ENTER, RISE, VIEWPORT } from './motion';

/**
 * 스크롤로 화면에 들어올 때 한 번 올라오며 나타난다.
 * 같은 동작을 페이지 곳곳에서 쓰기 때문에 한 곳에 둔다.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'section';
}) {
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={RISE}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      transition={{ ...ENTER, delay }}>
      {children}
    </Tag>
  );
}

export default Reveal;
