import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopNavbar } from "@/components/TopNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BingeAaradhya — Personal Watch Tracker & Showcase",
  description: "A living shelf for everything Aaradhya is watching, ranking, and recommending.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full font-sans text-slate-100 selection:bg-[#f5a623]/30 selection:text-white">
        <div className="relative min-h-screen overflow-x-hidden">
          {/* Subtle ambient lighting orbs in background */}
          <div className="pointer-events-none fixed top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[130px]" />
          <div className="pointer-events-none fixed top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-amber-500/[0.07] blur-[160px]" />
          <div className="pointer-events-none fixed bottom-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.08] blur-[140px]" />

          <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pt-4 pb-12 sm:px-6 lg:px-8">
            <TopNavbar />
            <main className="flex-1">{children}</main>
            <footer className="mt-16 border-t border-white/[0.08] py-8 text-center text-xs text-slate-400">
              <p>BingeAaradhya • My private movie and tv show tracking list • Powered by TMDB </p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
