import {
	IconBriefcase,
	IconCertificate,
	IconDeviceLaptop,
	IconMapPin,
	IconTool,
} from '@tabler/icons-react';
import Image from 'next/image';
import { TimelineEntry } from 'src/components';

export const ExperienceItems: TimelineEntry[] = [
	{
		title: 'Freelance Frontend Engineer',
		content: (
			<div className='space-y-3'>
				<div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
					<IconDeviceLaptop className='h-4 w-4 text-emerald-700' />
					<span>Remote • 06/2023 – Present</span>
				</div>
				<p className='text-sm text-neutral-800 dark:text-neutral-200'>
					Collaborating with multiple international clients to deliver
					<strong> high-performance </strong> web and mobile experiences.
					Specialized in <strong>Next.js</strong> and{' '}
					<strong>React Native</strong> with strong state management using{' '}
					<strong>Zustand</strong>. Building reusable UI systems with{' '}
					<strong>shadcn/ui</strong>, <strong>Tailwind CSS</strong>, and{' '}
					<strong>React Hook Form</strong>.
				</p>
				<div className='flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400'>
					<IconTool className='h-3 w-3' />
					<span>Next.js</span>
					<span>React Native</span>
					<span>Zustand</span>
					<span>React Hook Form</span>
					<span>Tailwind</span>
					<span>TypeScript</span>
					<span>React Query</span>
					<span>Zod</span>
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'>
					<Image
						src='/freelance1.webp'
						alt='Freelance Project 1'
						width={600}
						height={250}
						className='h-full w-full rounded-lg object-cover object-top shadow-sm'
					/>
					<Image
						src='/freelance2.webp'
						alt='Freelance Project 2'
						width={600}
						height={250}
						className='h-full w-full rounded-lg object-cover object-top shadow-sm'
					/>
					<Image
						src='/freelance3.webp'
						alt='Freelance Project 3'
						width={600}
						height={250}
						className='h-full w-full rounded-lg object-cover object-top shadow-sm'
					/>
					<Image
						src='/freelance4.webp'
						alt='Freelance Project 4'
						width={600}
						height={250}
						className='h-full w-full rounded-lg object-cover object-top shadow-sm'
					/>
				</div>
			</div>
		),
	},
	{
  title: 'FRONT-END INTERN',
  content: (
    <div className='space-y-3'>
      <div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
        <IconBriefcase className='h-4 w-4 text-emerald-700' />
        <span>Part-Time • 02/2026 – 03/2026</span>
      </div>
      <div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
        <IconMapPin className='h-4 w-4 text-emerald-700' />
        <span>Elevvo – Alexandria, Egypt</span>
      </div>
      <p className='text-sm text-neutral-800 dark:text-neutral-200'>
        Developed responsive user interfaces and advanced travel booking features 
        using <strong>React.js</strong> and <strong>Material UI</strong>. Implemented 
        reusable components, complex forms with <strong>React Hook Form</strong> and 
        <strong>Zod</strong>, integrated APIs via <strong>Axios</strong>, and optimized 
        application performance. Collaborated with the team using <strong>Git</strong> and 
        Agile workflow, fixing bugs and ensuring consistent UI/UX across pages.
      </p>
      <div className='flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400'>
        <IconTool className='h-3 w-3' />
        <span>React.js</span>
        <span>TypeScript</span>
        <span>Material UI</span>
        <span>React Hook Form</span>
        <span>Zod</span>
        <span>React Query</span>
        <span>Axios</span>
        <span>Git & GitHub</span>
        <span>Responsive Design</span>
      </div>
    </div>
  ),
},
	{
  title: 'WEB DEVELOPMENT INTERN',
  content: (
    <div className='space-y-3'>
      <div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
        <IconBriefcase className='h-4 w-4 text-emerald-700' />
        <span>Internship • 08/2025 – 09/2025</span>
      </div>
      <div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
        <IconMapPin className='h-4 w-4 text-emerald-700' />
        <span>Codveda Technologies</span>
      </div>
      <p className='text-sm text-neutral-800 dark:text-neutral-200'>
        Frontend Intern at Codveda, built and deployed an e-commerce web app
        using <strong>React.js</strong> and <strong>TypeScript</strong>. 
        Collaborated with cross-functional teams to implement project features, 
        integrated <strong>REST APIs</strong>, handled client-side form 
        validations, and participated in code reviews to improve application 
        performance using modern frontend technologies.
      </p>
      <div className='flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400'>
        <IconTool className='h-3 w-3' />
        <span>React.js</span>
        <span>TypeScript</span>
        <span>HTML5</span>
        <span>CSS3 / SCSS</span>
        <span>REST API</span>
        <span>Axios</span>
        <span>Material UI</span>
      </div>
    </div>
  ),
},
	{
  title: 'WEB DEVELOPMENT TRACK LEAD',
  content: (
    <div className='space-y-3'>
      <div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
        <IconBriefcase className='h-4 w-4 text-emerald-700' />
        <span>Part-Time • 01/2023 – 05/2023</span>
      </div>
      <div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
        <IconMapPin className='h-4 w-4 text-emerald-700' />
        <span>Google Developer Student Clubs (GDSC)</span>
      </div>
      <p className='text-sm text-neutral-800 dark:text-neutral-200'>
        Led the Web Development track for 50+ students, designing a curriculum
        covering <strong>HTML5</strong>, <strong>CSS3 / SCSS</strong>,{' '}
        <strong>TypeScript</strong>, <strong>Angular</strong>,{' '}
        <strong>Material UI</strong>, and <strong>Bootstrap</strong>. Conducted
        hands-on workshops, supervised real-world projects, and coordinated
        technical events to enhance practical learning.
      </p>
      <div className='flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400'>
        <IconTool className='h-3 w-3' />
        <span>Angular</span>
        <span>TypeScript</span>
        <span>HTML5</span>
        <span>CSS3 / SCSS</span>
        <span>Material UI</span>
        <span>Bootstrap</span>
        <span>Curriculum Design</span>
        <span>Workshops</span>
      </div>
    </div>
  ),
},
	{
		title: 'WEB DEVELOPMENT DIPLOMA (ANGULAR TRACK)',
		content: (
			<div className='space-y-3'>
				<div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
					<IconCertificate className='h-4 w-4 text-amber-600' />
					<span>Route Egypt Academy • 5/2022 – 11/2022</span>
				</div>
				<div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
					<IconMapPin className='h-4 w-4 text-emerald-700' />
					<span>Nasr-city Branch</span>
				</div>
				<p className='text-sm text-neutral-800 dark:text-neutral-200'>
  Completed a comprehensive program covering <strong>HTML5</strong>,{' '}
  <strong>CSS3</strong>, <strong>SCSS</strong>, <strong>TypeScript</strong>,{' '}
  <strong>Material UI</strong>, <strong>Bootstrap</strong>,{' '}
  <strong>JavaScript</strong>, and <strong>Angular</strong>. Gained
  practical experience building responsive UI layouts and dynamic web
  interfaces while following modern development best practices.
</p>
				<div className='pt-2'>
					<Image
						src='/hossroute.webp'
						alt='Front-End Diploma Certificate'
						width={500}
						height={300}
						className='w-full sm:w-1/2 rounded-lg object-contain shadow-sm'
					/>
				</div>
			</div>
		),
	},
	{
		title: 'Angular Framework',
		content: (
			<div className='space-y-3'>
				<div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
					<IconCertificate className='h-4 w-4 text-amber-600' />
					<span>Route Egypt Academy • 12/2025 – Present</span>
				</div>
				<div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
					<IconMapPin className='h-4 w-4 text-emerald-700' />
					<span>Alexandria Branch</span>
				</div>
				<p className='text-sm text-neutral-800 dark:text-neutral-200'>
					Completed a comprehensive program covering <strong>HTML5</strong>,{' '}
					<strong>Angular</strong>,<strong>typeScript</strong>,{' '}
					<strong>Angular Material</strong>, Gained practical experience
					building UI layouts and dynamic web interfaces with best practices.
				</p>
			</div>
		),
	},
];
