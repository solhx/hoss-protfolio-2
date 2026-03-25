import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import {
	ChatWidget,
	FloatingAppBar,
	Footer,
	SmoothScroll,
} from 'src/components';
import './globals.css';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter-sans',
});

export const metadata: Metadata = {
	publisher: 'Hossam Hassan',
	title: 'Hossam Hassan | MERN Stack Developer',
	description:
		'Frontend Developer specializing in React, Next.js, TypeScript, and modern UI frameworks. Explore my projects and experience.',
	keywords: [
		'Hossam',
		'Hossam Hassan',
		'hoss',
		'Hoss H.',
		'Frontend Developer',
		'Backend Developer',
		'React',
		'Next.js',
		'Portfolio',
		'Web Developer',
		'JavaScript',
		'TypeScript',
		'Cairo, Egypt',
		'Egypt',
		'Cairo Frontend Developer',
		'Cairo Web Developer',
		'Cairo JavaScript Developer',
		'Cairo TypeScript Developer',
		'Cairo React Developer',
		'Cairo Next.js Developer',
		'Cairo Frontend Developer',
		'Cairo Web Developer',
		'Cairo JavaScript Developer',
		'Cairo TypeScript Developer',
		'Cairo React Developer',
		'Cairo Next.js Developer',
	],
	authors: [{ name: 'Hossam Hassan' }],
	openGraph: {
		title: 'Hossam Hassan | MERN Stack Developer',
		description:
			'Explore my work in React, Next.js, and modern frontend development.',
		url: 'https://kerolos-magdy-portfolio.vercel.app/',
		siteName: 'Hossam Hassan Portfolio',
		locale: 'en_US',
		type: 'website',
		images: [
			{
				url: 'https://kerolos-magdy-portfolio.vercel.app/fav.webp',
				width: 1200,
				height: 630,
				alt: 'Hossam Hassan Portfolio',
				type: 'image/webp',
			},
		],
	},
	icons: { icon: '/fav.webp' },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
		>
			<body className={`${inter.variable} antialiased`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					disableTransitionOnChange
				>
					{children}
					<FloatingAppBar />
					<Footer />
				</ThemeProvider>
				<SmoothScroll />
				<Analytics mode='production' />
				<SpeedInsights />
				<ChatWidget />
			</body>
		</html>
	);
}
