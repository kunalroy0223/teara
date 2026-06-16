import type { Metadata } from "next";
import { bodoniModa, hankenGrotesk } from "@/lib/fonts";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Teara | Premium Himalayan Wellness & Skincare",
  description: "Experience ritual over routine with Teara. Luxury skincare and wellness essentials crafted from resilient Himalayan botanicals. Shop high-performance formulas for modern living.",
  keywords: ["luxury skincare", "Himalayan botanicals", "modern wellness", "premium beauty", "sustainable skincare"],
  openGraph: {
    title: "Teara | Premium Himalayan Wellness & Skincare",
    description: "Luxury skincare and wellness essentials crafted from resilient Himalayan botanicals.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${hankenGrotesk.variable} h-full antialiased light`}
    >
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W0JGQ19G6S"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-W0JGQ19G6S');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-body bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}

