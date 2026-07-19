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
  title: "StudyMate — Your Personal Study Companion",
  description:
    "StudyMate helps you build personalised study roadmaps and track your learning progress — all in one place.",
  keywords: ["study", "learning", "roadmap", "education"],
  openGraph: {
    title: "StudyMate",
    description: "Supercharge your learning with personalized study roadmaps",
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
