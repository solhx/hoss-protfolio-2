// Dynamic imports are unnecessary here since ssr:true is the default.
// These components all render above/near the fold on initial page load.
// Using direct imports reduces complexity and improves code clarity.
// If you want code-splitting, use ssr:false ONLY for heavy client components.

import {
  HomeHeroSection,
  HomeAboutMeSection,
  HomeBreakSection,
  HomeSkillsSection,
  HomeExperienceSection,
  HomeCounterSection,
  HomeProjectsSection,
  HomeGetInTouchSection,
  HomeContactUsSection,
} from 'src/components';

export default function Home() {
  return (
    <main id='home-page'>
      <HomeHeroSection />
      <HomeAboutMeSection />
      <HomeBreakSection />
      <HomeSkillsSection />
      <HomeExperienceSection />
      <HomeCounterSection />
      <HomeProjectsSection />
      <HomeGetInTouchSection />
      <HomeContactUsSection />
    </main>
  );
}