'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import api from '@/lib/axios';

interface Category {
    _id: string;
    name: string;
    image?: string;
    level: number;
}

export default function Categories() {
    const t = useTranslations('categories');
    const tCommon = useTranslations('common');
    const locale = useLocale();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories?level=1');
                setCategories(response.data.data.slice(0, 6));
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const categoryIcons = ['💍', '📿', '👂', '📿', '💎', '✨'];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4"
                    >
                        {t('subtitle')}
                    </motion.span>

                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 gradient-text">
                        {t('title')}
                    </h2>

                    <p className="text-lg text-gray-600">
                        {t('description')}
                    </p>
                </motion.div>

                {/* Categories Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="skeleton h-48 rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                    >
                        {categories.map((category, index) => (
                            <motion.div
                                key={category._id}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.8 },
                                    visible: { opacity: 1, scale: 1 },
                                }}
                            >
                                <Link href={`/${locale}/categories/${category._id}`}>
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center cursor-pointer"
                                    >
                                        <motion.div
                                            animate={{
                                                rotate: [0, 5, -5, 0],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                delay: index * 0.2,
                                            }}
                                            className="text-5xl mb-4"
                                        >
                                            {categoryIcons[index % categoryIcons.length]}
                                        </motion.div>

                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                                            {category.name}
                                        </h3>

                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileHover={{ width: '100%' }}
                                            className="h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 mt-4 mx-auto"
                                        />
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link href={`/${locale}/categories`}>
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 rounded-lg font-semibold shadow-lg hover:bg-primary-50 transition-all duration-300 inline-flex items-center space-x-2"
                        >
                            <span>{tCommon('viewAll')}</span>
                            <FiArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
