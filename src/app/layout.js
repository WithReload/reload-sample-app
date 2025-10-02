import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Reload API Testing",
  description:
    "Test and integrate with Reload's powerful wallet and payment APIs",
  keywords: ["reload", "api", "testing", "oauth", "wallet", "payments"],
  authors: [{ name: "Reload" }],
  viewport: "width=device-width, initial-scale=1",
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
