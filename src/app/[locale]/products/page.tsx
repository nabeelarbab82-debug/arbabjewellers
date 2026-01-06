'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import api from '@/lib/axios';

export default function ProductsPage() {
    const locale = useLocale();
    const tCommon = useTranslations('common');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get(`/products?page=${page}&limit=12`);
                setProducts(response.data.data.products || []);
                setTotalPages(response.data.data.pagination?.pages || 1);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-serif font-bold gradient-text mb-4">
                        {tCommon('products')}
                    </h1>
                    <p className="text-lg text-gray-600">
                        Explore our exquisite collection
                    </p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="skeleton h-96 rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 space-x-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-10 h-10 rounded-lg font-semibold ${page === i + 1
                                            ? 'gradient-gold text-white'
                                            : 'bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {i + 1}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
}
