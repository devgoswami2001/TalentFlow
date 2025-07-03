import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { cn } from '@/lib/utils';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: {
    default: "Hyresense - The Future of Talent Acquisition",
    template: "%s | Hyresense",
  },
  description: "The modern way to manage your hiring pipeline. Intelligent insights for a smarter recruitment process that helps you find the best talent, faster.",
  metadataBase: new URL('https://hyresense.com'), // Replace with your actual domain
  openGraph: {
    title: "Hyresense: The Future of Talent Acquisition",
    description: "Intelligent insights for a smarter recruitment pipeline that helps you find the best talent, faster.",
    url: "https://hyresense.com", // Replace with your actual domain
    siteName: 'Hyresense',
    images: [
      {
        url: '/logo.png', // Path to your logo in the public folder
        width: 256,
        height: 256,
        alt: 'Hyresense Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Hyresense: The Future of Talent Acquisition",
    description: 'The modern way to manage your hiring pipeline.',
    images: ['/logo.png'], // Path to your logo in the public folder
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('antialiased', fontBody.variable, fontHeadline.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
