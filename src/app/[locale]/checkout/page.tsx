'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

export default function CheckoutPage() {
    const t = useTranslations('checkout');
    const tCommon = useTranslations('common');
    const locale = useLocale();
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            };

            await api.post('/orders', orderData);
            toast.success(t('success'));
            clearCart();
            router.push(`/${locale}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('error'));
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        router.push(`/${locale}/cart`);
        return null;
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

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
                    {/* Customer Info */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl p-8 shadow-lg"
                        >
                            <h2 className="text-2xl font-bold mb-6">{t('customerInfo')}</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('fullName')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('email')}</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('phone')}</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('address')}</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">{t('city')}</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">{t('postalCode')}</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.postalCode}
                                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl p-8 shadow-lg sticky top-24"
                        >
                            <h2 className="text-2xl font-bold mb-6">{t('orderSummary')}</h2>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex justify-between text-sm">
                                        <span>{item.name} x{item.quantity}</span>
                                        <span className="font-semibold">
                                            {tCommon('currency')} {(item.price * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}

                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>{tCommon('total')}</span>
                                        <span className="gradient-text">
                                            {tCommon('currency')} {getTotalPrice().toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 gradient-gold text-white rounded-lg font-semibold disabled:opacity-50"
                            >
                                {loading ? t('processing') : t('placeOrder')}
                            </motion.button>
                        </motion.div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
