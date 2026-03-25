// src/lib/mocks/sections/home/experience-data.ts
// Pure data — no JSX, no 'use client', safe to import anywhere

export interface ExperienceData {
  title: string;
  type: 'work' | 'education';
  period: string;
  location?: string;
  company?: string;
  description: string;
  techs: string[];
  images?: { src: string; alt: string }[];
}

export const ExperienceItemsData: ExperienceData[] = [
  {
    title: 'Freelance Frontend Engineer',
    type: 'work',
    period: '06/2023 – Present',
    company: 'Remote',
    description:
      'Collaborating with multiple international clients to deliver high-performance web and mobile experiences. Specialized in Next.js and React Native with strong state management using Zustand.',
    techs: [
      'Next.js',
      'React Native',
      'Zustand',
      'React Hook Form',
      'Tailwind',
      'TypeScript',
      'React Query',
      'Zod',
    ],
    images: [
      { src: '/freelance1.webp', alt: 'Freelance Project 1' },
      { src: '/freelance2.webp', alt: 'Freelance Project 2' },
      { src: '/freelance3.webp', alt: 'Freelance Project 3' },
      { src: '/freelance4.webp', alt: 'Freelance Project 4' },
    ],
  },
  {
    title: 'FRONT-END INTERN',
    type: 'work',
    period: '02/2026 – 03/2026',
    location: 'Alexandria, Egypt',
    company: 'Elevvo',
    description:
      'Developed responsive user interfaces and advanced travel booking features using React.js and Material UI. Implemented reusable components, complex forms with React Hook Form and Zod.',
    techs: [
      'React.js',
      'TypeScript',
      'Material UI',
      'React Hook Form',
      'Zod',
      'React Query',
      'Axios',
      'Git & GitHub',
    ],
  },
  {
    title: 'WEB DEVELOPMENT INTERN',
    type: 'work',
    period: '08/2025 – 09/2025',
    company: 'Codveda Technologies',
    description:
      'Built and deployed an e-commerce web app using React.js and TypeScript. Collaborated with cross-functional teams, integrated REST APIs, handled client-side form validations.',
    techs: [
      'React.js',
      'TypeScript',
      'HTML5',
      'CSS3 / SCSS',
      'REST API',
      'Axios',
      'Material UI',
    ],
  },
  {
    title: 'WEB DEVELOPMENT TRACK LEAD',
    type: 'work',
    period: '01/2023 – 05/2023',
    location: 'Google Developer Student Clubs (GDSC)',
    description:
      'Led the Web Development track for 50+ students, designing a curriculum covering modern web technologies. Conducted hands-on workshops and coordinated technical events.',
    techs: [
      'Angular',
      'TypeScript',
      'HTML5',
      'CSS3 / SCSS',
      'Material UI',
      'Bootstrap',
      'Curriculum Design',
      'Workshops',
    ],
  },
  {
    title: 'WEB DEVELOPMENT DIPLOMA (ANGULAR TRACK)',
    type: 'education',
    period: '5/2022 – 11/2022',
    location: 'Nasr-city Branch',
    company: 'Route Egypt Academy',
    description:
      'Completed a comprehensive program covering HTML5, CSS3, SCSS, TypeScript, Material UI, Bootstrap, JavaScript, and Angular.',
    techs: [
      'HTML5',
      'CSS3',
      'SCSS',
      'TypeScript',
      'JavaScript',
      'Angular',
      'Material UI',
      'Bootstrap',
    ],
    images: [{ src: '/hossroute.webp', alt: 'Front-End Diploma Certificate' }],
  },
  {
    title: 'Angular Framework',
    type: 'education',
    period: '12/2025 – Present',
    location: 'Nasr-city Branch',
    company: 'Route Egypt Academy',
    description:
      'Currently completing a focused program on Angular, TypeScript, and Angular Material.',
    techs: ['Angular', 'TypeScript', 'HTML5', 'Angular Material'],
  },
];