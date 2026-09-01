import { STORE_LINKS } from '../config';

/**
 * 스토어 버튼.
 *
 * 링크가 아직 없는 동안에는 `<a>` 대신 비활성 상태로 그린다 — 눌러도 아무 데도
 * 가지 않는 링크를 두느니 아직 안 열렸다고 말하는 편이 낫다. 실제 URL 은 `src/config.ts`
 * 한 곳에만 있으므로 심사가 끝나면 거기만 고치면 된다.
 */

type Tone = 'onLight' | 'onDark';

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
      <path d="M3.6 1.8a1 1 0 0 0-.35.77v18.86a1 1 0 0 0 .35.77l.06.06L14.2 11.6v-.25L3.66 1.74z" fill="#00A0FF" />
      <path d="M17.78 15.09l-3.58-3.59v-.25l3.58-3.59.08.05 4.24 2.41c1.21.69 1.21 1.81 0 2.5l-4.24 2.41z" fill="#FFBC00" />
      <path d="M17.86 15.04L14.2 11.5 3.6 22.2c.4.42 1.05.47 1.78.06l12.48-7.22" fill="#FF3A44" />
      <path d="M17.86 7.96L5.38.74C4.65.33 4 .38 3.6.8l10.6 10.7z" fill="#00C853" />
    </svg>
  );
}

function Button({
  href,
  tone,
  mark,
  lead,
  name,
}: {
  href: string | null;
  tone: Tone;
  mark: React.ReactNode;
  lead: string;
  name: string;
}) {
  const shell =
    'group inline-flex min-w-[188px] items-center gap-3 rounded-full px-5 py-3 transition-colors duration-200';
  const skin =
    tone === 'onDark'
      ? 'bg-paper text-ink hover:bg-white'
      : 'bg-ink text-paper hover:bg-abyss';
  const muted = href
    ? tone === 'onDark'
      ? 'text-ink-soft'
      : 'text-white/60'
    : 'opacity-70';

  const body = (
    <>
      {mark}
      <span className="text-left leading-tight">
        <span className={`block text-[11px] tracking-wide ${muted}`}>{href ? lead : 'Coming soon'}</span>
        <span className="block text-[15px] font-semibold">{name}</span>
      </span>
    </>
  );

  if (!href) {
    /*
     * 아직 열리지 않은 상태. 같은 알약을 흐리게만 그리면 눌리지 않는 버튼이 아니라
     * 잘못 그려진 버튼처럼 보인다. 채움을 빼고 테두리만 남겨 자리를 지키게 한다.
     */
    const outline =
      tone === 'onDark'
        ? 'border border-white/25 text-white/70'
        : 'border border-ink/15 text-ink-soft';

    return (
      <span aria-disabled="true" className={`${shell} ${outline} cursor-default`}>
        {body}
      </span>
    );
  }

  return (
    <a href={href} className={shell + ' ' + skin} target="_blank" rel="noreferrer">
      {body}
    </a>
  );
}

export function StoreButtons({ tone = 'onLight', className = '' }: { tone?: Tone; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <Button
        href={STORE_LINKS.appStore}
        tone={tone}
        mark={<AppleMark />}
        lead="Download on the"
        name="App Store"
      />
      <Button
        href={STORE_LINKS.googlePlay}
        tone={tone}
        mark={<PlayMark />}
        lead="Get it on"
        name="Google Play"
      />
    </div>
  );
}

export default StoreButtons;
