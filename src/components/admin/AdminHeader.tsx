'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FiLogOut, FiUser, FiBell } from 'react-icons/fi';
import { useAdminStore } from '@/store/adminStore';
import toast from 'react-hot-toast';

export default function AdminHeader() {
    const t = useTranslations('common');
    const locale = useLocale();
    const router = useRouter();
    const { admin, logout } = useAdminStore();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push(`/${locale}/admin/login`);
    };

    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
                {/* Page Title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>
                    <p className="text-sm text-gray-600">Manage your jewelry store</p>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiBell className="w-6 h-6 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </motion.button>

                    {/* User Menu */}
                    <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden md:block">
                            <div className="font-semibold text-sm text-gray-800">{admin?.name}</div>
                            <div className="text-xs text-gray-600 capitalize">{admin?.role}</div>
                        </div>
                    </div>

                    {/* Logout */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <FiLogOut className="w-4 h-4" />
                        <span className="hidden md:inline">{t('logout')}</span>
                    </motion.button>
                </div>
            </div>
        </header>
    );
}
