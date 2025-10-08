import { UI_TEXT } from "@/lib/constants";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: UI_TEXT.APP_TITLE,
  description: UI_TEXT.APP_DESCRIPTION,
  keywords: [
    "reload",
    "api",
    "testing",
    "oauth",
    "wallet",
    "payments",
    "ai",
    "monetization",
  ],
  authors: [{ name: "Reload" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
