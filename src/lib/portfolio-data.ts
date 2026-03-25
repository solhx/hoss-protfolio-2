// src/lib/portfolio-data.ts
import {
  AboutMeSectionData,
  ContactUsItems,
  ExperienceItemsData, // ✅ Use the pure data export, NOT ExperienceItems
  ProductsItems,
  SkillsItems,
} from './mocks';

export const portfolioData = {
  name: 'Hossam Hassan',
  role: 'MEARN Stack Developer',
  experience: '3+ years',
  phone: '+20 1022828316',
  email: 'hossamhassan112003@gmail.com',
  stack: SkillsItems.map((skill) => skill.name),
  projects: ProductsItems.map((p) => p.title).join(', '),
  detailedExperience: ExperienceItemsData.map((e) => e.title), // ✅ Now uses pure data
  socials: ContactUsItems.map((c) => ({ platform: c.text, link: c.link })),
  education: AboutMeSectionData.find((s) => s.title === 'Education')
    ?.details.map((d) => d.text)
    .filter(Boolean),
};