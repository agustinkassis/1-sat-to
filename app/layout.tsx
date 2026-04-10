import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';

import { ThemeProvider } from '@/lib/theme-context';

import { UmamiAnalytics } from '@/components/umami-analytics';
import { TooltipProvider } from '@/components/ui/tooltip';

import './globals.css';

const BASE_ENVIRONMENT = process.env.BASE_ENVIRONMENT || '';

export const metadata: Metadata = {
  title: '1 SAT es igual a ... | Precio del Satoshi en tiempo real',
  description:
    'Visualiza en tiempo real el valor de un Satoshi en PESOS y otras monedas de Latinoamerica. Incluye calculadora y graficos historicos.',
  keywords: ['bitcoin', 'satoshi', 'sat', 'mxn', 'peso mexicano', 'criptomonedas', 'precio bitcoin'],
  authors: [{ name: 'Jona Llamas' }],
  openGraph: {
    title: '1 SAT es igual a ...',
    description: 'Precio del Satoshi en tiempo real',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body className={`${GeistSans.className} font-sans antialiased`}>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        {BASE_ENVIRONMENT === 'production' && <UmamiAnalytics />}
      </body>
    </html>
  );
}
