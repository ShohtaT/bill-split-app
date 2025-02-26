import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';

const geistSans = localFont({
  src: '../../public/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../../public/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'お金のやりとり管理',
  description: 'お金のやりとり管理',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex justify-center mx-3 mb-20">
          <div className="w-[420px]">{children}</div>
        </div>
      </body>
    </html>
  );
}
