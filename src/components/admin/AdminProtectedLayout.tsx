'use client';

import { useEffect } from 'react';
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

    useEffect(() => {
        if (!isAuthenticated || !token) {
            router.push(`/${locale}/admin/login`);
        }
    }, [isAuthenticated, token, router, locale]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}
