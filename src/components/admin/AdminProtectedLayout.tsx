'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAdminStore } from '@/store/adminStore';

export default function AdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const locale = useLocale();
    const { isAuthenticated, token } = useAdminStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Give zustand time to hydrate from cookies
        const timer = setTimeout(() => {
            setIsChecking(false);
            if (!isAuthenticated || !token) {
                router.push(`/${locale}/admin/login`);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [isAuthenticated, token, router, locale]);

    if (isChecking || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
