import type { Metadata } from 'next';
import './../css/globals.css';
import localFont from 'next/font/local';
import Nav from '@/components/navbar';
import LoginModal from '@/components/login';
import Providers from '@/components/providers';

const myFont = localFont({ src: '../fonts/jf-openhuninn-2.0.ttf' });

export const metadata: Metadata = {
  title: 'TheShop',
  description: 'TheShop storefront',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${myFont.className} min-h-screen bg-white text-gray-900`}>
        <Providers>
          <Nav />
          <LoginModal />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
