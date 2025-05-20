import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'GeoQuiz',
    description: '世界の国を覚えるためのゲームです。',
    icons: {
        icon: '/logo.png',
        shortcut: '/logo.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
                <div id="root">{children}</div>
            </body>
        </html>
    );
}
