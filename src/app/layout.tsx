import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CBD Caifan & Salad Tracker",
  description: "Track the cheapest caifan and salad spots in the CBD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-dvh flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <header className="z-[1200] shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="text-[15px] font-medium text-zinc-900 dark:text-zinc-50">
              Caifan &amp; Salad
            </Link>
            <Link
              href="/deals/new"
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Add deal
            </Link>
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
