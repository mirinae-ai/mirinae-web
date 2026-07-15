"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import "./i18n";

const easeOut = [0.16, 1, 0.3, 1] as const;
const fadeTransition = { type: "tween" as const, duration: 0.45, ease: easeOut };
const scaleTransition = { type: "tween" as const, duration: 0.55, ease: easeOut };

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.18 });
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={reduceMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={fadeTransition}
    >
      {children}
    </motion.div>
  );
}

function ScaleIn({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.18 });
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={reduceMotion || isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ ...scaleTransition, delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

function AppleLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.47-2.09-.5-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35-.07 2.29.74 3.08.74 1.18 0 2.3-.89 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.14ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25Z"
      />
    </svg>
  );
}

function GooglePlayLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path fill="#00d6ff" d="M3.2 2.4 13.9 12 3.2 21.6c-.4-.4-.6-1-.6-1.7V4.1c0-.7.2-1.3.6-1.7Z" />
      <path fill="#ffcf43" d="m13.9 12 3.1-2.8 3.7 2.1c1 .6 1 1.5 0 2.1L17 15.5 13.9 12Z" />
      <path fill="#ff5864" d="m3.2 21.6 10.7-9.6 3.1 3.5-11.5 6.6c-.9.5-1.7.3-2.3-.5Z" />
      <path fill="#63e06f" d="M3.2 2.4c.6-.8 1.4-1 2.3-.5L17 8.5 13.9 12 3.2 2.4Z" />
    </svg>
  );
}

function StoreButtons({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const stores = [
    { label: "App Store", detail: t("store.appDetail"), logo: <AppleLogo /> },
    { label: "Google Play", detail: t("store.playDetail"), logo: <GooglePlayLogo /> },
  ];

  return (
    <div className={`store-buttons${compact ? " compact" : ""}`}>
      {stores.map((store) => (
        <motion.a
          className="store-badge"
          href="#"
          key={store.label}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="store-mark">{store.logo}</span>
          <span><small>{store.detail}</small><strong>{store.label}</strong></span>
        </motion.a>
      ))}
    </div>
  );
}

function TodayScreen({ preview = false }: { preview?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className={`app-screen today-screen${preview ? " preview" : ""}`}>
      <div className="mobile-status"><span>9:41</span><span>Mirinae</span></div>
      <div className="screen-content">
        <div className="moon-glance"><span className="moon" aria-hidden="true" /><span>{t("today.date")}</span></div>
        <article className="insight-card">
          <p className="product-overline">{t("today.strongest")}</p>
          <h3>{t("today.insightTitle")}</h3>
          <p>{t("today.insightBody")}</p>
          <div className="planet-line"><span className="planet mars">♂</span><span className="aspect">{t("today.tension")}</span><span className="planet venus">♀</span></div>
        </article>
        {!preview && (
          <div className="reading-list">
            <p className="product-overline">{t("today.areas")}</p>
            <div><span>♡</span><strong>{t("today.love")}</strong><small>{t("today.loveReading")}</small></div>
            <div><span>◇</span><strong>{t("today.career")}</strong><small>{t("today.careerReading")}</small></div>
            <div><span>○</span><strong>{t("today.emotion")}</strong><small>{t("today.emotionReading")}</small></div>
          </div>
        )}
      </div>
    </div>
  );
}

function AskScreen({ preview = false }: { preview?: boolean }) {
  const { t } = useTranslation();
  const questions = [1, 2, 3].slice(0, preview ? 2 : 3);
  return (
    <div className={`app-screen ask-screen${preview ? " preview" : ""}`}>
      <div className="mobile-status"><span>9:41</span><span>Ask</span></div>
      <div className="screen-content">
        <div className="ask-heading"><h3>{t("ask.heading")}</h3><p>{t("ask.subheading")}</p></div>
        <div className="topic-pills"><span>{t("ask.topics.love")}</span><span>{t("ask.topics.career")}</span><span>{t("ask.topics.emotion")}</span><span>{t("ask.topics.growth")}</span></div>
        <div className="question-list">
          <p className="product-overline">{t("ask.start")}</p>
          {questions.map((number) => (
            <article className="question-card" key={number}>
              <span className="question-icon">{t(`ask.q${number}.category`).slice(0, 1)}</span>
              <div><strong>{t(`ask.q${number}.title`)}</strong><p>{t(`ask.q${number}.prompt`)}</p></div>
              <span className="chevron">›</span>
            </article>
          ))}
        </div>
        {!preview && <div className="composer">{t("ask.composer")}<span>↑</span></div>}
      </div>
    </div>
  );
}

function ChatScreen({ preview = false }: { preview?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className={`app-screen chat-screen${preview ? " preview" : ""}`}>
      <div className="mobile-status"><span>‹</span><span>{t("conversation.header")}</span></div>
      <div className="screen-content chat-content">
        <p className="chat-date">{t("conversation.date")}</p>
        <ScaleIn className="message user-message">{t("conversation.user")}</ScaleIn>
        <ScaleIn className="message ai-message" delay={0.12}>{t("conversation.answer")}</ScaleIn>
        {!preview && <div className="quick-replies"><span>{t("conversation.reply1")}</span><span>{t("conversation.reply2")}</span></div>}
        <div className="composer">{t("conversation.composer")}<span>↑</span></div>
      </div>
    </div>
  );
}

function BirthChart() {
  return <div className="chart-visual" aria-hidden="true"><span className="chart-ring ring-one" /><span className="chart-ring ring-two" /><span className="chart-axis axis-one" /><span className="chart-axis axis-two" /><span className="chart-glyph glyph-one">☉</span><span className="chart-glyph glyph-two">☽</span><span className="chart-glyph glyph-three">♀</span><span className="chart-glyph glyph-four">♂</span></div>;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "en" ? "en" : "ko";

  useEffect(() => {
    const saved = window.localStorage.getItem("mirinae-language");
    if (saved === "en") void i18n.changeLanguage("en");
  }, [i18n]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (next: "ko" | "en") => {
    window.localStorage.setItem("mirinae-language", next);
    void i18n.changeLanguage(next);
  };

  return (
    <main>
      <nav className="topbar page-width">
        <a className="brand" href="#top" aria-label="Mirinae home"><span className="brand-symbol">✦</span><span>Mirinae</span></a>
        <div className="nav-actions">
          <div className="language-switch" aria-label={t("nav.language")}>
            <button className={language === "ko" ? "active" : ""} onClick={() => changeLanguage("ko")} type="button">KR</button>
            <button className={language === "en" ? "active" : ""} onClick={() => changeLanguage("en")} type="button">EN</button>
          </div>
          <a className="nav-download" href="#top">{t("nav.download")}</a>
        </div>
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}>
          <section className="hero page-width" id="top">
            <Reveal className="hero-copy">
              <p className="eyebrow">{t("hero.eyebrow")}</p>
              <h1>{t("hero.title1")}<br />{t("hero.title2")}</h1>
              <p className="hero-description">{t("hero.description")}</p>
              <StoreButtons />
            </Reveal>
            <div className="hero-product" aria-label="Mirinae app preview">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="hero-phone phone-left"><ScaleIn className="screen-scale" delay={0.12}><AskScreen preview /></ScaleIn></div>
              <div className="hero-phone phone-center"><ScaleIn className="screen-scale"><TodayScreen preview /></ScaleIn></div>
              <div className="hero-phone phone-right"><ScaleIn className="screen-scale" delay={0.2}><ChatScreen preview /></ScaleIn></div>
            </div>
          </section>

          <section className="product-section today-feature page-width">
            <Reveal className="feature-copy">
              <p className="eyebrow">{t("today.eyebrow")}</p><h2>{t("today.title")}</h2><p>{t("today.description")}</p>
              <ul className="feature-points"><li>{t("today.point1")}</li><li>{t("today.point2")}</li><li>{t("today.point3")}</li></ul>
            </Reveal>
            <div className="feature-visual today-visual">
              <ScaleIn className="screen-motion"><TodayScreen /></ScaleIn>
              <ScaleIn className="visual-note note-top" delay={0.16}>{t("today.noteTop")}</ScaleIn>
              <ScaleIn className="visual-note note-bottom" delay={0.24}>{t("today.noteBottom")}</ScaleIn>
            </div>
          </section>

          <section className="product-section ask-feature page-width">
            <Reveal className="feature-copy">
              <p className="eyebrow">{t("ask.eyebrow")}</p><h2>{t("ask.title")}</h2><p>{t("ask.description")}</p>
              <div className="sample-questions"><span>{t("ask.samples.one")}</span><span>{t("ask.samples.two")}</span><span>{t("ask.samples.three")}</span></div>
            </Reveal>
            <div className="feature-visual ask-visual"><ScaleIn className="screen-motion"><AskScreen /></ScaleIn></div>
          </section>

          <section className="conversation-section">
            <div className="page-width conversation-inner">
              <Reveal className="conversation-heading"><p className="eyebrow">{t("conversation.eyebrow")}</p><h2>{t("conversation.title1")}<br />{t("conversation.title2")}</h2><p>{t("conversation.description")}</p></Reveal>
              <div className="conversation-demo">
                <ScaleIn className="chat-side-note left-note" delay={0.12}>{t("conversation.noteLeft")}</ScaleIn>
                <ScaleIn className="conversation-phone"><ChatScreen /></ScaleIn>
                <ScaleIn className="chat-side-note right-note" delay={0.22}>{t("conversation.noteRight")}</ScaleIn>
              </div>
            </div>
          </section>

          <section className="profile-section page-width">
            <ScaleIn className="profile-visual">
              <BirthChart />
              <div className="profile-cards">
                <ScaleIn className="profile-card-motion"><article className="profile-card sun-card"><span>☉ SUN</span><strong>{t("profile.sun")}</strong><p>{t("profile.sunBody")}</p></article></ScaleIn>
                <ScaleIn className="profile-card-motion" delay={0.12}><article className="profile-card moon-card"><span>☽ MOON</span><strong>{t("profile.moon")}</strong><p>{t("profile.moonBody")}</p></article></ScaleIn>
              </div>
            </ScaleIn>
            <Reveal className="feature-copy profile-copy"><p className="eyebrow">{t("profile.eyebrow")}</p><h2>{t("profile.title")}</h2><p>{t("profile.description")}</p><StoreButtons compact /></Reveal>
          </section>

          <footer className="footer page-width"><a className="brand" href="#top"><span className="brand-symbol">✦</span><span>Mirinae</span></a><p>{t("footer.tagline")}</p><div><a href="#">{t("footer.privacy")}</a><a href="#">{t("footer.terms")}</a></div></footer>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
