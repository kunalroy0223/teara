import type { Metadata } from "next";
import { bodoniModa, hankenGrotesk } from "@/lib/fonts";
import "./globals.css";

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
      <body className="min-h-full flex flex-col font-body bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}
