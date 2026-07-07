import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SpeakSmart — AI Public Speaking Coach",
  description:
    "Practice and perfect your public speaking with real-time AI analysis of filler words, body language, tone, confidence, and delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
