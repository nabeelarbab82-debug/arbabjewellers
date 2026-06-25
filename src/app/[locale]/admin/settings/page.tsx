'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
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
    contactInfo: {
        email: string;
        phone1: string;
        phone2: string;
        phone3: string;
        address1: string;
        address2: string;
        googleMapsUrl: string;
    };
    socialMedia: {
        facebook: {
            url: string;
            visible: boolean;
        };
        instagram: {
            url: string;
            visible: boolean;
        };
        youtube: {
            url: string;
            visible: boolean;
        };
        tiktok: {
            url: string;
            visible: boolean;
        };
    };
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
        contactInfo: {
            email: '',
            phone1: '',
            phone2: '',
            phone3: '',
            address1: '',
            address2: '',
            googleMapsUrl: '',
        },
        socialMedia: {
            facebook: {
                url: '',
                visible: true,
            },
            instagram: {
                url: '',
                visible: true,
            },
            youtube: {
                url: '',
                visible: true,
            },
            tiktok: {
                url: '',
                visible: true,
            },
        },
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
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

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

    const changePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setChangingPassword(true);

        try {
            const response = await api.put('/admin/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            // Update token if provided (to keep user logged in)
            if (response.data.token) {
                document.cookie = `adminToken=${response.data.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
            }

            toast.success('Password changed successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            // Reset password visibility
            setShowPasswords({
                current: false,
                new: false,
                confirm: false,
            });
        } catch (error: any) {
            console.error('Password change error:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                    placeholder="https://example.com/favicon.ico"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Change Password */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
                        <form onSubmit={changePassword} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? "text" : "password"}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                            placeholder="Enter current password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.current ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                            placeholder="Enter new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.new ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.confirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="flex items-center space-x-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow disabled:opacity-50 transition-colors"
                            >
                                <FiLock className="w-4 h-4" />
                                <span>{changingPassword ? 'Changing...' : 'Change Password'}</span>
                            </button>
                        </form>
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={settings.contactInfo.email}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        contactInfo: { ...settings.contactInfo, email: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                    placeholder="contact@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone 1
                                </label>
                                <input
                                    type="text"
                                    value={settings.contactInfo.phone1}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        contactInfo: { ...settings.contactInfo, phone1: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                    placeholder="0333-5861171"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone 2 (WhatsApp)
                                </label>
                                <input
                                    type="text"
                                    value={settings.contactInfo.phone2}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        contactInfo: { ...settings.contactInfo, phone2: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                    placeholder="0332-3026222"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone 3 (PTCL)
                                </label>
                                <input
                                    type="text"
                                    value={settings.contactInfo.phone3}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        contactInfo: { ...settings.contactInfo, phone3: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                    placeholder="051-6102658"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Address 1
                                </label>
                                <input
                                    type="text"
                                    value={settings.contactInfo.address1}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        contactInfo: { ...settings.contactInfo, address1: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                    placeholder="Shop No.13-A Opposite Arena Cinema..."
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Address 2
                                </label>
                                <input
                                    type="text"
                                    value={settings.contactInfo.address2}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        contactInfo: { ...settings.contactInfo, address2: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                    placeholder="Shop#75, Lalkurti, Rawalpindi Cantt"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Google Maps URL
                                </label>
                                <input
                                    type="text"
                                    value={settings.contactInfo.googleMapsUrl}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        contactInfo: { ...settings.contactInfo, googleMapsUrl: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Social Media Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Social Media Links</h2>
                        <div className="space-y-4">
                            {/* Facebook */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Facebook URL
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.socialMedia.facebook.url}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialMedia: {
                                                ...settings.socialMedia,
                                                facebook: { ...settings.socialMedia.facebook, url: e.target.value }
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                                <div className="flex items-center mt-6">
                                    <input
                                        type="checkbox"
                                        id="facebook-visible"
                                        checked={settings.socialMedia.facebook.visible}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialMedia: {
                                                ...settings.socialMedia,
                                                facebook: { ...settings.socialMedia.facebook, visible: e.target.checked }
                                            }
                                        })}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="facebook-visible" className="ml-2 text-sm font-semibold text-gray-700 whitespace-nowrap">
                                        Visible
                                    </label>
                                </div>
                            </div>

                            {/* Instagram */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Instagram URL
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.socialMedia.instagram.url}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialMedia: {
                                                ...settings.socialMedia,
                                                instagram: { ...settings.socialMedia.instagram, url: e.target.value }
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div className="flex items-center mt-6">
                                    <input
                                        type="checkbox"
                                        id="instagram-visible"
                                        checked={settings.socialMedia.instagram.visible}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialMedia: {
                                                ...settings.socialMedia,
                                                instagram: { ...settings.socialMedia.instagram, visible: e.target.checked }
                                            }
                                        })}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="instagram-visible" className="ml-2 text-sm font-semibold text-gray-700 whitespace-nowrap">
                                        Visible
                                    </label>
                                </div>
                            </div>

                            {/* YouTube */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        YouTube URL
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.socialMedia.youtube.url}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialMedia: {
                                                ...settings.socialMedia,
                                                youtube: { ...settings.socialMedia.youtube, url: e.target.value }
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                                <div className="flex items-center mt-6">
                                    <input
                                        type="checkbox"
                                        id="youtube-visible"
                                        checked={settings.socialMedia.youtube.visible}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialMedia: {
                                                ...settings.socialMedia,
                                                youtube: { ...settings.socialMedia.youtube, visible: e.target.checked }
                                            }
                                        })}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="youtube-visible" className="ml-2 text-sm font-semibold text-gray-700 whitespace-nowrap">
                                        Visible
                                    </label>
                                </div>
                            </div>

                            {/* TikTok */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        TikTok URL
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.socialMedia.tiktok.url}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialMedia: {
                                                ...settings.socialMedia,
                                                tiktok: { ...settings.socialMedia.tiktok, url: e.target.value }
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                                        placeholder="https://tiktok.com/..."
                                    />
                                </div>
                                <div className="flex items-center mt-6">
                                    <input
                                        type="checkbox"
                                        id="tiktok-visible"
                                        checked={settings.socialMedia.tiktok.visible}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socialMedia: {
                                                ...settings.socialMedia,
                                                tiktok: { ...settings.socialMedia.tiktok, visible: e.target.checked }
                                            }
                                        })}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="tiktok-visible" className="ml-2 text-sm font-semibold text-gray-700 whitespace-nowrap">
                                        Visible
                                    </label>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Email Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
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
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
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
