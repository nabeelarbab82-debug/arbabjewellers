'use client';

import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminProtectedLayout from './AdminProtectedLayout';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <AdminProtectedLayout>
            <div className="min-h-screen bg-gray-50 flex">
                <AdminSidebar />
                <div className="flex-1 flex flex-col ml-[280px]">
                    <AdminHeader />
                    <main className="flex-1 p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AdminProtectedLayout>
    );
}
