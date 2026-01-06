import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Playfair_Display, Noto_Nastaliq_Urdu } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { setRequestLocale } from 'next-intl/server';
import '../globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const notoNastaliq = Noto_Nastaliq_Urdu({
    subsets: ['arabic'],
    variable: '--font-noto-nastaliq',
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'ur' }, { locale: 'ar' }];
}

export const metadata = {
    title: 'Arbab Jewellers - Exquisite Jewelry Collection',
    description: 'Discover timeless elegance with Arbab Jewellers premium collection of gold, diamond, and gemstone jewelry',
    keywords: 'jewelry, gold, diamond, rings, necklaces, earrings, bracelets, arbab jewellers',
};

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    
    // Enable static rendering
    setRequestLocale(locale);
    
    const messages = await getMessages();

    return (
        <html lang={locale} dir={locale === 'ar' || locale === 'ur' ? 'rtl' : 'ltr'}>
            <body className={`${inter.variable} ${playfair.variable} ${notoNastaliq.variable} font-sans antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#d68d47',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
