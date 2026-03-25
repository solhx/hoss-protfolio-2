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
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-sans',
});

export const metadata: Metadata = {
  // ... keeping your existing metadata
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
          // REMOVED: disableTransitionOnChange
          // Theme transitions are now smooth 300ms color shifts
        >
          <SmoothScroll />
          <ScrollProgress />
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