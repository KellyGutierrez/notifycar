import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Providers } from "@/components/Providers";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "NotifyCar | Sistema de Comunicación Vehicular",
  description: "La forma más rápida y segura de contactar al dueño de un vehículo por su placa.",
  icons: {
    icon: "/favicon.ico",
  }
};

async function getGAId() {
  try {
    const settings = await db.systemSetting.findUnique({
      where: { id: "default" }
    });
    return settings?.googleAnalyticsId;
  } catch (e) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = await getGAId();

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {gaId && <GoogleAnalytics gaId={gaId} />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
