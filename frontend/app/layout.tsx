import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import HeroCanvas from "./components/HeroCanvas";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jithin P Joji - Portfolio",
  description: "Full Stack Developer Portfolio",
};

import MainLayout from "./components/MainLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body style={{ background: 'transparent', color: 'var(--text)' }}>
        <HeroCanvas />
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
