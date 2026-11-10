import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist } from "next/font/google";

import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QueryProvider from "@/providers/QueryProvider";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const ameLeilaFont = localFont({
  src: [
    {
      path: "../../public/fonts/IranyekanX/IRANYekanX-Regular.3-a6bab62df99b.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranyekanX/IRANYekanX-Medium.3-5e66990e2ecd.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranyekanX/IRANYekanX-Bold.3-0691142bf3bf.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ame-leila",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "عمه لیلا | فروشگاه اینترنتی لباس",
    template: "%s | عمه لیلا",
  },

  description:
    "فروشگاه اینترنتی عمه لیلا؛ خرید آنلاین لباس زنانه، مردانه، بچگانه، کفش، کیف، شال و روسری و اکسسوری.",

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${ameLeilaFont.variable} ${geist.variable}`}
    >
      <body className={ameLeilaFont.className}>
        <QueryProvider>
          <Header />

          {children}

          <Footer />
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
