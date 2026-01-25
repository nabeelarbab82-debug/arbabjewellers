'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/utils';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        stock: number;
    };
    showPrice?: boolean;
}

export default function ProductCard({ product, showPrice = true }: ProductCardProps) {
    const tCommon = useTranslations('common');
    const locale = useLocale();

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -8 }}
            className="group"
        >
            <Link href={`/${locale}/products/${product._id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <motion.img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            whileHover={{ scale: 1.1 }}
                        />

                        {/* Stock Badge */}
                        {product.stock === 0 && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Out of Stock
                            </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full py-3 bg-white text-primary-600 rounded-lg font-semibold shadow-lg"
                                >
                                    {tCommon('viewDetails')}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors flex-1">
                            {product.name}
                        </h3>

                        {showPrice && (
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-2xl font-bold gradient-text">
                                    {tCommon('currency')} {product.price.toLocaleString()}
                                </span>

                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-white shadow-lg"
                                >
                                    ⭐
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
