// src/app/page.tsx
// ═══════════════════════════════════════════════════════════
// UPGRADE NOTES:
// • Hero + AboutMe = static imports (above the fold)
// • Everything else = dynamic with ssr:true (code-split per chunk)
//   This cuts the initial JS bundle by ~30-40% for large sections.
// • Wrapped in PageTransition for smooth entrance animation.
// ═══════════════════════════════════════════════════════════

import dynamic from 'next/dynamic';
import { HomeHeroSection, HomeAboutMeSection } from 'src/components';
import PageTransition from 'src/components/common/page-transition';

// Below-fold: code-split into separate chunks
// ssr:true (default) means they still render on server — no CLS
const HomeBreakSection = dynamic(
  () => import('src/components/sections/home/break-section'),
);
const HomeSkillsSection = dynamic(
  () => import('src/components/sections/home/skills-section'),
);
const HomeExperienceSection = dynamic(
  () => import('src/components/sections/home/experience-section'),
);
const HomeCounterSection = dynamic(
  () => import('src/components/sections/home/counter-section'),
);
const HomeProjectsSection = dynamic(
  () => import('src/components/sections/home/projects-section'),
);
const HomeGetInTouchSection = dynamic(
  () => import('src/components/sections/home/get-in-touch-section'),
);
const HomeContactUsSection = dynamic(
  () => import('src/components/sections/home/contact-us-section'),
);

export default function Home() {
  return (
    <PageTransition>
      <main id='home-page'>
        {/* ── Above the fold (static imports) ── */}
        <HomeHeroSection />
        <HomeAboutMeSection />

        {/* ── Below the fold (dynamic chunks) ── */}
        <HomeBreakSection />
        <HomeSkillsSection />
        <HomeExperienceSection />
        <HomeCounterSection />
        <HomeProjectsSection />
        <HomeGetInTouchSection />
        <HomeContactUsSection />
      </main>
    </PageTransition>
  );
}