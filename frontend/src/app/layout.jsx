import { Mona_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

// Configure Mona Sans — only load weights actually used in the design
const monaSans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

// Configure Playfair Display
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  style: ["normal", "italic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "Puramente Jewel",
  description: "A Legacy Built On Craftsmanship",
  icons: {
    icon: "/images/logo/puramente fav icon.png",
    shortcut: "/images/logo/puramente fav icon.png",
    apple: "/images/logo/puramente fav icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${monaSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}