import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

const FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400;1,500&family=Rozha+One&family=Urbanist:wght@300;400;500;600&display=swap';

export const metadata: Metadata = {
  title: 'Teara · Made For You',
  description: 'Teara turns leftover Darjeeling tea leaves into skincare. Made For You.',
  icons: { icon: 'brand/tmark.svg' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#C9D1B5' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <SmoothScroll />
        <div className="page">
          <Header />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
