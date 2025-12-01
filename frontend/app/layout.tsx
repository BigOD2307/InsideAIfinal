import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono, Blaka } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-title",
  weight: ["500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  weight: ["400", "500"],
  display: "swap",
});

const blaka = Blaka({
  subsets: ["latin"],
  variable: "--font-blaka",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inside AI - Votre Coach IA Personnel",
  description: "Plateforme complète pour maîtriser l'IA : formation, veille technologique et communauté",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${fraunces.variable} ${plexMono.variable} ${blaka.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
