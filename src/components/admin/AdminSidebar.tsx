'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
    FiHome,
    FiShoppingBag,
    FiShoppingCart,
    FiGrid,
    FiMail,
    FiMessageSquare,
    FiSettings,
    FiFileText,
    FiPieChart,
    FiUpload,
    FiMenu,
    FiX,
    FiStar,
} from 'react-icons/fi';

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('admin');
    const tCommon = useTranslations('common');

    const menuItems = [
        { icon: FiHome, label: t('dashboard'), href: `/${locale}/admin/dashboard` },
        { icon: FiShoppingBag, label: t('products'), href: `/${locale}/admin/products` },
        { icon: FiShoppingCart, label: t('orders'), href: `/${locale}/admin/orders` },
        { icon: FiGrid, label: t('categories'), href: `/${locale}/admin/categories` },
        { icon: FiMail, label: 'Newsletter', href: `/${locale}/admin/newsletter` },
        { icon: FiMessageSquare, label: 'Contacts', href: `/${locale}/admin/contacts` },
        { icon: FiStar, label: 'Testimonials', href: `/${locale}/admin/testimonials` },
        { icon: FiFileText, label: 'Email Templates', href: `/${locale}/admin/email-templates` },
        { icon: FiPieChart, label: 'Company Info', href: `/${locale}/admin/company` },
        { icon: FiUpload, label: 'File Upload', href: `/${locale}/admin/upload` },
        { icon: FiSettings, label: t('settings'), href: `/${locale}/admin/settings` },
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
            >
                {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? 280 : 0,
                    opacity: isOpen ? 1 : 0,
                }}
                className={`bg-gradient-to-br from-secondary-900 to-secondary-950 text-white h-screen sticky top-0 overflow-hidden ${isOpen ? 'block' : 'hidden lg:block'
                    }`}
            >
                <div className="p-6">
                    {/* Logo */}
                    <Link href={`/${locale}/admin/dashboard`}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center space-x-3 mb-8"
                        >
                            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center font-bold text-xl">
                                A
                            </div>
                            <div>
                                <div className="font-serif font-bold text-lg">{tCommon('appName')}</div>
                                <div className="text-xs text-gray-400">Admin Panel</div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Menu Items */}
                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${isActive
                                            ? 'bg-primary-600 text-white'
                                            : 'text-gray-300 hover:bg-white/10'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="font-medium">{item.label}</span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </motion.aside>
        </>
    );
}
