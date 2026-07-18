import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Header/Nav";
import Footer from "./components/Footer/Footer";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyMate AI — Your Intelligent Study Companion",
  description:
    "StudyMate AI helps you build personalised study roadmaps, generate AI-powered schedules, and chat with an intelligent study assistant — all in one place.",
  keywords: ["study", "AI", "learning", "roadmap", "education", "schedule"],
  openGraph: {
    title: "StudyMate AI",
    description: "Supercharge your learning with AI-powered study roadmaps",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
