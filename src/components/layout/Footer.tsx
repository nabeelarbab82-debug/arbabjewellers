'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

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
        { icon: FaFacebookF, href: 'https://web.facebook.com/profile.php?id=61585786391480', label: 'Facebook' },
        { icon: FaInstagram, href: 'https://www.instagram.com/arbab_jeweller/', label: 'Instagram' },
        { icon: FaYoutube, href: 'https://www.youtube.com/channel/UCeLpWAiVC4olmFe0_UiJ_fQ', label: 'YouTube' },
        { icon: FaTiktok, href: 'https://www.tiktok.com/@arbab_jeweller?lang=en', label: 'TikTok' },
    ];

    return (
        <footer className="bg-black border-t border-primary-500/20">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <div className="mb-4">
                            <Image
                                src="/logo/logo.jpeg"
                                alt={tCommon('appName')}
                                width={180}
                                height={120}
                                className="object-contain"
                            />
                        </div>
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
                                    className="w-10 h-10 rounded-full bg-primary-500/10 hover:bg-primary-500 hover:text-black border border-primary-500/30 flex items-center justify-center transition-all"
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
                                <a
                                    href="https://www.google.com/maps/place/Arbab+Jewellers/@33.5521371,73.1365602,16.78z/data=!4m6!3m5!1s0x38dfed735103f637:0xe1c43de9372819cc!8m2!3d33.552142!4d73.1392478!16s%2Fg%2F11yt2kp2k9?hl=en&entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-primary-400 transition-colors"
                                >
                                    Shop No.13-A Opposite Arena Cinema, Phase 4 Bahria Heights 3, Bahria Town Rawalpindi
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a href="tel:03323026222" className="text-gray-300 hover:text-primary-400 transition-colors">0332-3026222</a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a href="mailto:nabeelarbab82@gmail.com" className="text-gray-300 hover:text-primary-400 transition-colors">nabeelarbab82@gmail.com</a>
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
                        {/* <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex items-center space-x-4"
                        >
                            <img src="/payment-methods.png" alt="Payment Methods" className="h-8 opacity-70" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </motion.div> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
