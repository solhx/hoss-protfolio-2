import {
	IconApi,
	IconBrandAngular,
	IconBrandBootstrap,
	IconBrandCss3,
	IconBrandGithub,
	IconBrandHtml5,
	IconBrandJavascript,
	IconBrandNextjs,
	IconBrandReact,
	IconBrandTailwind,
	IconBrandTypescript,
	IconBrandVscode,
	IconDatabase,
	IconForms,
	IconLanguage,
	IconSettings,
	TablerIcon,
	IconBrandNodejs,
	IconLock,
	IconPlug,
	IconBrandDocker,
	IconCloud,
} from '@tabler/icons-react';

interface SkillsItem {
	name: string;
	Icon: TablerIcon;
}

export const SkillsItems: SkillsItem[] = [
	{ name: 'TypeScript', Icon: IconBrandTypescript },
	{ name: 'JavaScript', Icon: IconBrandJavascript },
	{ name: 'Next.js', Icon: IconBrandNextjs },
	{ name: 'React.js', Icon: IconBrandReact },
	{ name: 'Angular', Icon: IconBrandAngular },
	{ name: 'React Native', Icon: IconBrandReact },
	{ name: 'React Hook Form', Icon: IconForms },
	{ name: 'Zod', Icon: IconDatabase },
	{ name: 'Axios', Icon: IconApi },
	{ name: 'React Query', Icon: IconApi },
	{ name: 'Zustand', Icon: IconSettings },
	{ name: 'i18next', Icon: IconLanguage },
	{ name: 'Tailwind', Icon: IconBrandTailwind },
	{ name: 'Material UI', Icon: IconBrandVscode },
	{ name: 'Bootstrap', Icon: IconBrandBootstrap },
	{ name: 'React Admin', Icon: IconBrandVscode },
	{ name: 'HTML5', Icon: IconBrandHtml5 },
	{ name: 'CSS3 / SCSS', Icon: IconBrandCss3 },
	{ name: 'Supabase', Icon: IconDatabase },
	{ name: 'Git & GitHub', Icon: IconBrandGithub },
	{ name: 'Node.js', Icon: IconBrandNodejs },
	{ name: 'Express.js', Icon: IconBrandNodejs },
	{ name: 'MongoDB', Icon: IconDatabase },
	{ name: 'Mongoose', Icon: IconDatabase },
	{ name: 'REST API', Icon: IconApi },
	{ name: 'JWT Authentication', Icon: IconLock },
	{ name: 'Bcrypt', Icon: IconLock },
	{ name: 'Socket.io', Icon: IconPlug },

	{ name: 'Postman', Icon: IconApi },

	{ name: 'Netlify', Icon: IconCloud },
];
