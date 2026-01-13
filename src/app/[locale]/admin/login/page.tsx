'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useAdminStore } from '@/store/adminStore';

export default function AdminLoginPage() {
    const t = useTranslations('common');
    const locale = useLocale();
    const router = useRouter();
    const login = useAdminStore((state) => state.login);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/admin/auth/login', formData);
            const { token, admin } = response.data;

            login(admin, token);
            toast.success('Login successful!');
            router.push(`/${locale}/admin/dashboard`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <FiLock className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-serif font-bold gradient-text mb-2">
                        Admin Panel
                    </h1>
                    <p className="text-gray-600">{t('appName')}</p>
                </div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-2xl p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors text-black"
                                    placeholder="admin@arbabjewellers.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors text-black"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 gradient-gold text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : t('login')}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-6"
                >
                    <a
                        href={`/${locale}`}
                        className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        ← Back to Website
                    </a>
                </motion.div>
            </motion.div>
        </div>
    );
}
