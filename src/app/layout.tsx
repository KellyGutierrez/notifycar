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
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "NotifyCar | Sistema de Comunicación Vehicular",
  description: "La forma más rápida y segura de contactar al dueño de un vehículo por su placa.",
  icons: {
    icon: "/icon.png?v=1",
  }
};

export const dynamic = "force-dynamic";
export const revalidate = 0;


async function getGTMId() {
  try {
    const settings = await db.systemSetting.findUnique({
      where: { id: "default" }
    });
    return settings?.gtmId; // We will rename this in schema
  } catch (e) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = await getGTMId();

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Providers>
          {gtmId && <GoogleTagManager gtmId={gtmId} />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
