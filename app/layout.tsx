import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit-loaded",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "เลขใกล้เคียง — Math Random",
  description: "เกมคณิตศาสตร์: ใช้ตัวเลข 5 ตัวกับ + − × ÷ ให้ได้ใกล้เลขเป้าหมายที่สุด",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${kanit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
