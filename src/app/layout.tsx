import type {Metadata} from 'next';
import { Geist_Sans as GeistSans, Geist_Mono as GeistMono } from 'geist/font';
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

export const metadata: Metadata = {
  title: 'BudgetFlow',
  description: 'Track your budget and expenses with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans`}>
        {children}
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}
