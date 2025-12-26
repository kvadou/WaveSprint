import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WaveSprint.ai - Transmit Your Idea. Receive a Working App in 24 Hours.",
  description: "Enter your concept into the WaveSprint Console. We interpret your signal and sprint an MVP into reality.",
  keywords: ["MVP development", "rapid prototyping", "24-hour app development", "startup MVP", "custom software"],
  authors: [{ name: "WaveSprint.ai" }],
  openGraph: {
    title: "WaveSprint.ai - Working App in 24 Hours",
    description: "Transmit your idea. Receive a working app.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className={`${dmSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
