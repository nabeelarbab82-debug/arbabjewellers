'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { FiArrowRight } from 'react-icons/fi';

interface Category {
    _id: string;
    nameEn: string;
    nameUr: string;
    nameAr: string;
    slug: string;
    descriptionEn?: string;
    descriptionUr?: string;
    descriptionAr?: string;
    image?: string;
    level: number;
    children?: Category[];
}

export default function CategoriesPage() {
    const t = useTranslations('categories');
    const locale = useLocale();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920"
                        alt="Categories"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
                            {t('heroTitle') || 'Shop by Category'}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                            {t('heroDescription') || 'Explore our exquisite collection of fine jewelry organized by category'}
                        </p>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/20 rounded-full animate-pulse" />
                <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white/20 rounded-full animate-pulse delay-300" />
            </section>

            {/* Categories Grid */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                        </div>
                    ) : (
                        <>
                            {/* Main Categories */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                                {categories.map((category, index) => (
                                    <CategoryCard key={category._id} category={category} index={index} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

function CategoryCard({ category, index }: { category: Category; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const locale = useLocale();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group"
        >
            <Link href={`/${locale}/categories/${category.slug}`}>
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                    {/* Image */}
                    <div className="absolute inset-0">
                        <motion.img
                            src={category.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'}
                            alt={category.nameEn}
                            className="w-full h-full object-cover"
                            animate={{ scale: isHovered ? 1.1 : 1 }}
                            transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                        >
                            <h3 className="text-3xl font-serif font-bold text-white mb-3">
                                {category.nameEn}
                            </h3>
                            {category.descriptionEn && (
                                <p className="text-white/90 text-sm mb-4 line-clamp-2">
                                    {category.descriptionEn}
                                </p>
                            )}

                            {/* Subcategories Count */}
                            {category.children && category.children.length > 0 && (
                                <p className="text-white/80 text-sm mb-4">
                                    {category.children.length} Subcategories
                                </p>
                            )}

                            <motion.div
                                className="flex items-center text-white font-semibold"
                                animate={{ x: isHovered ? 10 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <span>Explore Collection</span>
                                <FiArrowRight className="ml-2 w-5 h-5" />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-white/30 rounded-tr-2xl" />
                </div>
            </Link>
        </motion.div>
    );
}
