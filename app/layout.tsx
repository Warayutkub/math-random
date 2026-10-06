import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Prompt } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Sans_Thai({
  variable: "--font-plex-loaded",
  subsets: ["thai", "latin"],
  weight: ["400", "600"],
});

const prompt = Prompt({
  variable: "--font-prompt-loaded",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "เลขใกล้เคียง — Math Random",
  description: "เกมคณิตศาสตร์: ใช้ตัวเลข 5 ตัวกับ + − × ÷ ให้ได้ใกล้เลขเป้าหมายที่สุด",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${plex.variable} ${prompt.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
