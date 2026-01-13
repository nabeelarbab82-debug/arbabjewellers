'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import MainLayout from '@/components/layout/MainLayout';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

export default function ContactPage() {
    const t = useTranslations('contact');
    const tCommon = useTranslations('common');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/contact', formData);
            toast.success(t('success'));
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="py-32 bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl font-serif font-bold gradient-text mb-4">
                            {t('title')}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t('description')}
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('name')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                    <label className="block text-sm font-medium mb-2">{t('subject')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('message')}</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 gradient-gold text-white rounded-lg font-semibold disabled:opacity-50"
                                >
                                    {loading ? tCommon('loading') : t('send')}
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {[
                                {
                                    icon: FiMapPin,
                                    title: t('address'),
                                    content: '123 Jewelry Street, Karachi, Pakistan',
                                },
                                {
                                    icon: FiPhone,
                                    title: t('phone'),
                                    content: '+92 300 1234567',
                                },
                                {
                                    icon: FiMail,
                                    title: 'Email',
                                    content: 'info@arbabjewellers.com',
                                },
                                {
                                    icon: FiClock,
                                    title: t('hours'),
                                    content: 'Mon-Sat: 10:00 AM - 8:00 PM\nSunday: Closed',
                                },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                            <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Map */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-gray-200 rounded-2xl overflow-hidden h-64"
                            >
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.1827885652145!2d67.0099164!3d24.8607343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUxJzM4LjYiTiA2N8KwMDAnMzUuNyJF!5e0!3m2!1sen!2s!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
