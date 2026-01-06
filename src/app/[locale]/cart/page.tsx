'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import MainLayout from '@/components/layout/MainLayout';
import { useCartStore } from '@/store/cartStore';
import { getImageUrl } from '@/lib/utils';

export default function CartPage() {
    const t = useTranslations('cart');
    const tCommon = useTranslations('common');
    const locale = useLocale();
    const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

    if (items.length === 0) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md mx-auto"
                    >
                        <FiShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                        <h1 className="text-3xl font-bold mb-4">{t('empty')}</h1>
                        <Link href={`/${locale}/products`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 gradient-gold text-white rounded-lg font-semibold"
                            >
                                {t('continueShopping')}
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-32">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-serif font-bold gradient-text mb-12"
                >
                    {t('title')}
                </motion.h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={item.productId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg flex items-center space-x-6"
                            >
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />

                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                                    <p className="text-primary-600 font-bold">
                                        {tCommon('currency')} {item.price.toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        className="px-3 py-1 hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <span className="px-4">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        className="px-3 py-1 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => removeItem(item.productId)}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    <FiTrash2 className="w-5 h-5" />
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl p-8 shadow-lg sticky top-24"
                        >
                            <h2 className="text-2xl font-bold mb-6">{tCommon('total')}</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span>{tCommon('subtotal')}</span>
                                    <span className="font-bold">
                                        {tCommon('currency')} {getTotalPrice().toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Link href={`/${locale}/checkout`}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 gradient-gold text-white rounded-lg font-semibold"
                                >
                                    {t('proceedToCheckout')}
                                </motion.button>
                            </Link>

                            <Link href={`/${locale}/products`}>
                                <button className="w-full mt-4 py-4 border-2 border-gray-200 rounded-lg font-semibold hover:border-primary-600 transition-colors">
                                    {t('continueShopping')}
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
