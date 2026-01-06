'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FiMail, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

export default function Newsletter() {
    const t = useTranslations('newsletter');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/newsletter/subscribe', { email });
            toast.success(t('success'));
            setEmail('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        {/* Icon */}
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="inline-block"
                        >
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto">
                                <FiMail className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>

                        {/* Content */}
                        <div className="space-y-4">
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-block px-4 py-2 bg-white/20 backdrop-blur-lg text-white rounded-full text-sm font-semibold"
                            >
                                {t('subtitle')}
                            </motion.span>

                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
                                {t('title')}
                            </h2>

                            <p className="text-xl text-white/90">
                                {t('description')}
                            </p>
                        </div>

                        {/* Form */}
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mt-8"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('emailPlaceholder')}
                                required
                                disabled={loading}
                                className="flex-1 px-6 py-4 rounded-lg border-2 border-white/30 bg-white/10 backdrop-blur-lg text-white placeholder-white/60 focus:outline-none focus:border-white transition-all disabled:opacity-50"
                            />
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                <span>{loading ? 'Loading...' : t('subscribe')}</span>
                                {!loading && <FiSend className="w-5 h-5" />}
                            </motion.button>
                        </motion.form>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center space-x-8 text-white/80 text-sm mt-6"
                        >
                            <div className="flex items-center space-x-2">
                                <span>✓</span>
                                <span>No Spam</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>✓</span>
                                <span>Exclusive Offers</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>✓</span>
                                <span>Unsubscribe Anytime</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
