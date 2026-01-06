'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiGlobe } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    const t = useTranslations('common');
    const tNav = useTranslations('nav');
    const locale = useLocale();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const totalItems = useCartStore((state) => state.getTotalItems());

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: `/${locale}`, label: t('home') },
        { href: `/${locale}/products`, label: t('products') },
        { href: `/${locale}/categories`, label: t('categories') },
        { href: `/${locale}/about`, label: t('about') },
        { href: `/${locale}/contact`, label: t('contact') },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-4' : 'bg-white/95 backdrop-blur-md py-6'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href={`/${locale}`} className="flex items-center space-x-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl md:text-3xl font-serif font-bold gradient-text"
                        >
                            {t('appName')}
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    className="text-gray-700 hover:text-primary-600 transition-colors duration-300 font-medium"
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Search"
                        >
                            <FiSearch className="w-5 h-5 text-gray-700" />
                        </motion.button>

                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        {/* Cart */}
                        <Link href={`/${locale}/cart`}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Shopping Cart"
                            >
                                <FiShoppingCart className="w-5 h-5 text-gray-700" />
                                {totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </motion.button>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Menu"
                        >
                            {isMenuOpen ? (
                                <FiX className="w-6 h-6 text-gray-700" />
                            ) : (
                                <FiMenu className="w-6 h-6 text-gray-700" />
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Search Bar */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 overflow-hidden"
                        >
                            <input
                                type="search"
                                placeholder={t('searchPlaceholder')}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                                autoFocus
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 px-4 rounded-lg transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
