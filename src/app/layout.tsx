import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "House Match - 注文住宅マッチングプラットフォーム",
  description: "理想の住まいと出会える、注文住宅マッチングプラットフォーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
