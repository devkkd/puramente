import { Mona_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

// Configure Mona Sans
const monaSans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

// Configure Playfair Display
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  style: ["normal", "italic"], 
});

export const metadata = {
  title: "Puramente Jewel",
  description: "A Legacy Built On Craftsmanship",
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