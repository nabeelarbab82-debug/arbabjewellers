'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiCheck } from 'react-icons/fi';

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (newLocale: string) => {
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPathname);
        setIsOpen(false);
    };

    const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Change Language"
            >
                <FiGlobe className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium hidden sm:inline">{currentLanguage.flag}</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                        {languages.map((lang) => (
                            <motion.button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${locale === lang.code ? 'bg-primary-50' : ''
                                    }`}
                                whileHover={{ x: 4 }}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className={`font-medium ${locale === lang.code ? 'text-primary-600' : 'text-gray-700'}`}>
                                        {lang.name}
                                    </span>
                                </div>
                                {locale === lang.code && (
                                    <FiCheck className="w-5 h-5 text-primary-600" />
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
