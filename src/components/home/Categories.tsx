'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import api from '@/lib/axios';

interface Category {
    _id: string;
    name?: string;
    nameEn: string;
    nameUr: string;
    nameAr: string;
    slug: string;
    image?: string;
    level: number;
    children?: Category[];
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
                const response = await api.get('/categories');
                // Filter only level 1 (main categories) and show first 4
                const mainCategories = response.data.data.filter((cat: Category) => cat.level === 1).slice(0, 4);
                setCategories(mainCategories);
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, index) => (
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
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        {categories.map((category, index) => (
                            <motion.div
                                key={category._id}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.8 },
                                    visible: { opacity: 1, scale: 1 },
                                }}
                            >
                                <Link href={`/${locale}/categories/${category.slug || category._id}`}>
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center cursor-pointer overflow-hidden"
                                    >
                                        {/* Category Image Background */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={category.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600'}
                                                alt={category.nameEn}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        </div>

                                        {/* Category Name Overlay */}
                                        <div className="absolute inset-0 flex items-end justify-center p-6">
                                            <h3 className="text-xl font-semibold text-white drop-shadow-lg">
                                                {locale === 'ar' ? category.nameAr : locale === 'ur' ? category.nameUr : category.nameEn}
                                            </h3>
                                        </div>

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
