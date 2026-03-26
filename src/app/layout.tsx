// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { ScrollProgress } from 'src/components/ui/scroll-progress';
import {
  ChatWidget,
  FloatingAppBar,
  Footer,
  SmoothScroll,
} from 'src/components';
import { CursorFollower } from 'src/components/ui/cursor-follower';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-sans',
  display: 'swap', // ← Prevents FOIT flash
});

// ═══════════════════════════════════════════════════════════
// ENHANCED METADATA — Much better SEO + social sharing
// ═══════════════════════════════════════════════════════════
const siteUrl = 'https://hossamhassan.dev'; // ← Update with your real domain

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Hossam Hassan — MEARN Stack Developer',
    template: '%s | Hossam Hassan',
  },
  description:
    'Portfolio of Hossam Hassan — 3+ years of experience building modern web applications with React, Next.js, Node.js, Express, and MongoDB.',
  keywords: [
    'Hossam Hassan',
    'MEARN Stack',
    'React Developer',
    'Next.js Developer',
    'Full Stack Developer',
    'Portfolio',
    'Node.js',
    'MongoDB',
    'TypeScript',
  ],
  authors: [{ name: 'Hossam Hassan' }],
  creator: 'Hossam Hassan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Hossam Hassan Portfolio',
    title: 'Hossam Hassan — MEARN Stack Developer',
    description:
      'Building modern, high-performance web applications with React, Next.js, and Node.js.',
    images: [
      {
        url: '/og-image.webp', // ← Create a 1200×630 OG image
        width: 1200,
        height: 630,
        alt: 'Hossam Hassan — MEARN Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hossam Hassan — MEARN Stack Developer',
    description: 'Building modern web applications with cutting-edge technologies.',
    images: ['/og-image.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// ═══════════════════════════════════════════════════════════
// JSON-LD Structured Data — Helps Google rich results
// ═══════════════════════════════════════════════════════════
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Hossam Hassan',
  jobTitle: 'MEARN Stack Developer',
  url: siteUrl,
  email: 'hossamhassan112003@gmail.com',
  telephone: '+201022828316',
  sameAs: [
    'https://github.com/hossamhassan',   // ← Update
    'https://linkedin.com/in/hossamhassan', // ← Update
  ],
  knowsAbout: [
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'MongoDB',
    'Express',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to external origins */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='dark'>
          <SmoothScroll />
          <ScrollProgress />
          <CursorFollower />
          {children}
          <FloatingAppBar />
          <Footer />
          <ChatWidget />
        </ThemeProvider>
        <Analytics mode='production' />
        <SpeedInsights />
      </body>
    </html>
  );
}