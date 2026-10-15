import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: "Trusted Devices",
  description: "Trusted Devices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${robotoCondensed.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
