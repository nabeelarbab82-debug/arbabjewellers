'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface CompanyInfo {
    aboutEn: string;
    aboutUr: string;
    aboutAr: string;
    mission: string;
    vision: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    website: string;
    mapLocation: {
        lat: number;
        lng: number;
    };
}

export default function CompanyPage() {
    const [company, setCompany] = useState<CompanyInfo>({
        aboutEn: '',
        aboutUr: '',
        aboutAr: '',
        mission: '',
        vision: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        email: '',
        website: '',
        mapLocation: { lat: 0, lng: 0 },
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCompanyInfo();
    }, []);

    const fetchCompanyInfo = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/company');
            if (response.data.data) {
                setCompany(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch company information');
        } finally {
            setLoading(false);
        }
    };

    const saveCompanyInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.put('/admin/company', company);
            toast.success('Company information saved successfully');
        } catch (error) {
            toast.error('Failed to save company information');
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
                    <h1 className="text-3xl font-bold text-gray-800">Company Information</h1>
                    <p className="text-gray-600 mt-1">Manage your company details</p>
                </div>

                <form onSubmit={saveCompanyInfo} className="space-y-6">
                    {/* About Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">About Company</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    About (English)
                                </label>
                                <textarea
                                    value={company.aboutEn}
                                    onChange={(e) => setCompany({ ...company, aboutEn: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    About (Urdu)
                                </label>
                                <textarea
                                    value={company.aboutUr}
                                    onChange={(e) => setCompany({ ...company, aboutUr: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-right"
                                    dir="rtl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    About (Arabic)
                                </label>
                                <textarea
                                    value={company.aboutAr}
                                    onChange={(e) => setCompany({ ...company, aboutAr: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-right"
                                    dir="rtl"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Mission & Vision */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Mission & Vision</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mission
                                </label>
                                <textarea
                                    value={company.mission}
                                    onChange={(e) => setCompany({ ...company, mission: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Vision
                                </label>
                                <textarea
                                    value={company.vision}
                                    onChange={(e) => setCompany({ ...company, vision: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={company.address}
                                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={company.city}
                                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    value={company.country}
                                    onChange={(e) => setCompany({ ...company, country: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    value={company.phone}
                                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={company.email}
                                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={company.website}
                                    onChange={(e) => setCompany({ ...company, website: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Map Location */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Map Location</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={company.mapLocation.lat}
                                    onChange={(e) =>
                                        setCompany({
                                            ...company,
                                            mapLocation: { ...company.mapLocation, lat: parseFloat(e.target.value) },
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={company.mapLocation.lng}
                                    onChange={(e) =>
                                        setCompany({
                                            ...company,
                                            mapLocation: { ...company.mapLocation, lng: parseFloat(e.target.value) },
                                        })
                                    }
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
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
                        <span>{saving ? 'Saving...' : 'Save Company Information'}</span>
                    </motion.button>
                </form>
            </div>
        </AdminLayout>
    );
}
