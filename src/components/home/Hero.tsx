'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPhone } from 'react-icons/fi';

export default function Hero() {
    const t = useTranslations('hero');
    const tCommon = useTranslations('common');
    const locale = useLocale();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-32 pb-20">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-200/20 to-transparent rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-secondary-200/20 to-transparent rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block"
                        >
                            <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                                ✨ {t('subtitle')}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight"
                        >
                            <span className="gradient-text">{t('title')}</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-gray-600 leading-relaxed"
                        >
                            {t('description')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link href={`/${locale}/products`}>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 gradient-gold text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                                >
                                    <span>{t('cta')}</span>
                                    <FiArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>

                            <Link href={`/${locale}/contact`}>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 rounded-lg font-semibold shadow-lg hover:bg-primary-50 transition-all duration-300 flex items-center space-x-2"
                                >
                                    <FiPhone className="w-5 h-5" />
                                    <span>{t('ctaSecondary')}</span>
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
                        >
                            {[
                                { value: '500+', label: 'Products' },
                                { value: '10K+', label: 'Happy Customers' },
                                { value: '25+', label: 'Years Experience' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="relative z-10"
                        >
                            <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800"
                                    alt="Jewelry Collection"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            {/* Floating Cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-white font-bold text-xl">
                                        ⭐
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">Premium Quality</div>
                                        <div className="text-sm text-gray-600">Certified Authentic</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl"
                            >
                                <div className="text-center">
                                    <div className="text-3xl font-bold gradient-text">50%</div>
                                    <div className="text-sm text-gray-600 mt-1">Special Offer</div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Decorative Elements */}
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 30,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute top-1/4 -right-8 w-32 h-32 border-4 border-primary-300/30 rounded-full"
                        />
                        <motion.div
                            animate={{
                                rotate: [360, 0],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute bottom-1/4 -left-8 w-24 h-24 border-4 border-secondary-300/30 rounded-full"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-primary-600 rounded-full flex items-start justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="w-1.5 h-1.5 bg-primary-600 rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}
