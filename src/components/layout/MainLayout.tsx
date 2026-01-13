'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-[88px] lg:pt-[120px]">
                {children}
            </main>
            <Footer />
        </div>
    );
}
