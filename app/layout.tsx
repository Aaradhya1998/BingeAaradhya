import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BingeAaradhya",
  description: "A personal watch tracker and showcase for films and series.",
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
      <body className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(240,101,36,0.18),_transparent_35%),linear-gradient(180deg,_#f8efe6_0%,_#fff9f1_42%,_#f5efe8_100%)] text-foreground">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-40 border-b border-black/5 bg-background/75 backdrop-blur">
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <Link href="/" className="text-xl font-semibold tracking-tight">
                  BingeAaradhya
                </Link>
                <p className="text-sm text-muted-foreground">
                  Watch tracker, rankings, and personal stats.
                </p>
              </div>
              <nav className="flex flex-wrap items-center gap-2 text-sm">
                <Link href="/" className="rounded-full px-3 py-2 hover:bg-black/5">
                  Home
                </Link>
                <Link
                  href="/library"
                  className="rounded-full px-3 py-2 hover:bg-black/5"
                >
                  Library
                </Link>
                <Link
                  href="/watchlist"
                  className="rounded-full px-3 py-2 hover:bg-black/5"
                >
                  Watchlist
                </Link>
                <Link
                  href="/stats"
                  className="rounded-full px-3 py-2 hover:bg-black/5"
                >
                  Stats
                </Link>
                <Link
                  href="/admin/entries"
                  className="rounded-full border border-black/10 px-3 py-2 hover:bg-black/5"
                >
                  Admin
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
