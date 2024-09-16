import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Viewport } from "next";
import I18nProvider from '@/components/I18nProvider';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Market Place - Citizen Wallet",
  description: "Offers and requests from your community",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const lang = getLanguage();

  return (
    <html lang={lang}>
      <body>
        <I18nProvider lang={lang}>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}

function getLanguage() {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language');
  if (acceptLanguage) {
    const [browserLang] = acceptLanguage.split(',');
    const [langCode] = browserLang.split('-');
    return ['en', 'fr'].includes(langCode) ? langCode : 'en';
  }
  return 'en';
}
