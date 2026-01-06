'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
    const t = useTranslations('footer');
    const tCommon = useTranslations('common');
    const locale = useLocale();

    const quickLinks = [
        { href: `/${locale}`, label: tCommon('home') },
        { href: `/${locale}/products`, label: tCommon('products') },
        { href: `/${locale}/categories`, label: tCommon('categories') },
        { href: `/${locale}/about`, label: tCommon('about') },
        { href: `/${locale}/contact`, label: tCommon('contact') },
    ];

    const customerService = [
        { href: `/${locale}/privacy`, label: t('privacyPolicy') },
        { href: `/${locale}/terms`, label: t('termsConditions') },
        { href: `/${locale}/returns`, label: t('returnPolicy') },
        { href: `/${locale}/shipping`, label: t('shipping') },
        { href: `/${locale}/faq`, label: t('faq') },
    ];

    const socialLinks = [
        { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
        { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
        { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    ];

    return (
        <footer className="bg-gradient-to-br from-secondary-900 to-secondary-950 text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-2xl font-serif font-bold text-primary-400">
                            {tCommon('appName')}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            {t('description')}
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary-600 flex items-center justify-center transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="text-lg font-semibold mb-4 text-primary-400">{t('quickLinks')}</h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block hover:translate-x-1"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Customer Service */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="text-lg font-semibold mb-4 text-primary-400">{t('customerService')}</h4>
                        <ul className="space-y-2">
                            {customerService.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-primary-400 transition-colors duration-300 inline-block hover:translate-x-1"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <h4 className="text-lg font-semibold mb-4 text-primary-400">{tCommon('contact')}</h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <FiMapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">
                                    123 Jewelry Street, Karachi, Pakistan
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <span className="text-gray-300">+92 300 1234567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <span className="text-gray-300">info@arbabjewellers.com</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-gray-400 text-sm text-center md:text-left"
                        >
                            {t('copyright')}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex items-center space-x-4"
                        >
                            <img src="/payment-methods.png" alt="Payment Methods" className="h-8 opacity-70" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
