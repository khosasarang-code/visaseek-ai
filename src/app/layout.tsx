import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import NewsTicker from "@/components/NewsTicker";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VisaSeek AI - Your AI Immigration Assistant",
  description:
    "Get instant immigration help for visas, PR, work permits, study permits and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7ZPXXHXT2Y"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7ZPXXHXT2Y');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-white antialiased">
        <NewsTicker />
        {children}
      </body>
    </html>
  );
}
