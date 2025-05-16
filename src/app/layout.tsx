
import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeToggle } from '@/components/theme-toggle'; // Import new component

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nursery Rhyme Remix',
  description: 'Remix popular children\'s songs with fun new themes!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add "dark" class by default here
    <html lang="en" className={`${quicksand.variable} dark`}> 
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeToggle /> {/* Add the toggle button */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
