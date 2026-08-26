import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VedaAI - Exam Question & Answer Sheet Mapping Platform',
  description:
    'Automated AI-powered question extraction, handwritten answer sheet mapping, region highlighting, and grading platform for teachers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-900 antialiased">
      <body className={`${inter.className} h-full overflow-hidden text-slate-900 bg-slate-100`}>
        {children}
      </body>
    </html>
  );
}
