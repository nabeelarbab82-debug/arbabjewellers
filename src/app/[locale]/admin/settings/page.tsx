'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface Settings {
    siteName: string;
    logo: string;
    favicon: string;
    currency: string;
    shippingFee: number;
    taxRate: number;
    emailConfig: {
        service: string;
        host: string;
        port: number;
        secure: boolean;
        user: string;
        pass: string;
        from: string;
    };
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        siteName: '',
        logo: '',
        favicon: '',
        currency: 'PKR',
        shippingFee: 0,
        taxRate: 0,
        emailConfig: {
            service: 'gmail',
            host: '',
            port: 587,
            secure: false,
            user: '',
            pass: '',
            from: '',
        },
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/settings');
            setSettings(response.data.settings);
        } catch (error) {
            toast.error('Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.put('/settings', settings);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                    <p className="text-gray-600 mt-1">Configure your store settings</p>
                </div>

                <form onSubmit={saveSettings} className="space-y-6">
                    {/* General Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">General Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Currency
                                </label>
                                <input
                                    type="text"
                                    value={settings.currency}
                                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Logo URL
                                </label>
                                <input
                                    type="text"
                                    value={settings.logo}
                                    onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Favicon URL
                                </label>
                                <input
                                    type="text"
                                    value={settings.favicon}
                                    onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                    placeholder="https://example.com/favicon.ico"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Pricing Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Pricing & Shipping</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tax Rate (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={settings.taxRate}
                                    onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Shipping Fee (PKR)
                                </label>
                                <input
                                    type="number"
                                    value={settings.shippingFee}
                                    onChange={(e) => setSettings({ ...settings, shippingFee: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Email Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Email Configuration</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Service
                                </label>
                                <select
                                    value={settings.emailConfig.service}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        emailConfig: { ...settings.emailConfig, service: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                >
                                    <option value="gmail">Gmail</option>
                                    <option value="outlook">Outlook</option>
                                    <option value="custom">Custom SMTP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    SMTP Host
                                </label>
                                <input
                                    type="text"
                                    value={settings.emailConfig.host}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        emailConfig: { ...settings.emailConfig, host: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                    placeholder="smtp.gmail.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    SMTP Port
                                </label>
                                <input
                                    type="number"
                                    value={settings.emailConfig.port}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        emailConfig: { ...settings.emailConfig, port: parseInt(e.target.value) || 587 }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email User
                                </label>
                                <input
                                    type="text"
                                    value={settings.emailConfig.user}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        emailConfig: { ...settings.emailConfig, user: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Password
                                </label>
                                <input
                                    type="password"
                                    value={settings.emailConfig.pass}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        emailConfig: { ...settings.emailConfig, pass: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    From Email
                                </label>
                                <input
                                    type="email"
                                    value={settings.emailConfig.from}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        emailConfig: { ...settings.emailConfig, from: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                    placeholder="noreply@example.com"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="secure"
                                    checked={settings.emailConfig.secure}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        emailConfig: { ...settings.emailConfig, secure: e.target.checked }
                                    })}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <label htmlFor="secure" className="ml-2 text-sm font-semibold text-gray-700">
                                    Use Secure Connection (SSL/TLS)
                                </label>
                            </div>
                        </div>
                    </motion.div>

                    {/* Save Button */}
                    <motion.button
                        type="submit"
                        disabled={saving}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-2 px-8 py-4 gradient-gold text-white rounded-lg shadow-lg disabled:opacity-50"
                    >
                        <FiSave className="w-5 h-5" />
                        <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                    </motion.button>
                </form>
            </div>
        </AdminLayout>
    );
}
