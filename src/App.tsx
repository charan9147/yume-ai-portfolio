import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { LanguageProvider, useI18n } from './i18n';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Mission from './components/Mission';
import Projects from './components/Projects';
import Robotics from './components/Robotics';
import Research from './components/Research';
import Budget from './components/Budget';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Robot from './components/Robot';
import Chat from './components/Chat';
import Sakura from './components/Sakura';

function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.3 });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-sun via-saffron to-gold"
    />
  );
}

function Site() {
  const { t, isRTL } = useI18n();
  const [chatOpen, setChatOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-[12px] focus:font-semibold focus:text-ink"
      >
        {t.nav.about}
      </a>

      <ScrollProgress />
      <Sakura density={isRTL ? 20 : 24} />
      <Nav />

      <main ref={mainRef}>
        <Hero />
        <About />
        <Mission />
        <Projects />
        <Robotics />
        <Research />
        <Budget />
        <Contact />
      </main>

      <Footer />
      <Robot chatOpen={chatOpen} />
      <Chat onOpenChange={setChatOpen} />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Site />
    </LanguageProvider>
  );
}
