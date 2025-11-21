import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppKit } from "../contexts/appkit"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "x402fi | Web3 Payment Gateway",
  description: "Secure, fast, and minimal Web3 payment solution.",
};

export default function RootLayout({
  children
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppKit>
          {children}
        </AppKit>
      </body>
    </html>
  );
}
