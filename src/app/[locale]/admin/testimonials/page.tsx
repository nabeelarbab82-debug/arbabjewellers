'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiUpload } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

interface Testimonial {
    _id: string;
    name: string;
    text: string;
    rating: number;
    image?: string;
    isActive: boolean;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        text: '',
        rating: 5,
        image: '',
        isActive: true,
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/company');
            setTestimonials(response.data.data?.testimonials || []);
        } catch (error) {
            toast.error('Failed to fetch testimonials');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploading(true);
            const response = await api.post('/upload/single', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFormData((prev) => ({ ...prev, image: response.data.data.filename }));
            toast.success('Image uploaded');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingTestimonial) {
                await api.put(`/admin/company/testimonials/${editingTestimonial._id}`, formData);
                toast.success('Testimonial updated');
            } else {
                await api.post('/admin/company/testimonials', formData);
                toast.success('Testimonial created');
            }
            setShowModal(false);
            setFormData({ name: '', text: '', rating: 5, image: '', isActive: true });
            setEditingTestimonial(null);
            fetchTestimonials();
        } catch (error) {
            toast.error('Failed to save testimonial');
        }
    };

    const deleteTestimonial = async (id: string) => {
        if (!confirm('Delete this testimonial?')) return;

        try {
            await api.delete(`/admin/company/testimonials/${id}`);
            toast.success('Testimonial deleted');
            fetchTestimonials();
        } catch (error) {
            toast.error('Failed to delete testimonial');
        }
    };

    const openEditModal = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            name: testimonial.name,
            text: testimonial.text,
            rating: testimonial.rating,
            image: testimonial.image || '',
            isActive: testimonial.isActive,
        });
        setShowModal(true);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Testimonials</h1>
                        <p className="text-gray-600 mt-1">Manage customer testimonials</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setEditingTestimonial(null);
                            setFormData({ name: '', text: '', rating: 5, image: '', isActive: true });
                            setShowModal(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 gradient-gold text-white rounded-lg shadow-lg"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Add Testimonial</span>
                    </motion.button>
                </div>

                {/* Testimonials Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl shadow-lg p-6"
                            >
                                {/* Image & Name */}
                                <div className="flex items-center space-x-3 mb-4">
                                    {testimonial.image ? (
                                        <Image
                                            src={getImageUrl(testimonial.image)}
                                            alt={testimonial.name}
                                            width={60}
                                            height={60}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-15 h-15 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                                        <div className="flex space-x-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar
                                                    key={i}
                                                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Text */}
                                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{testimonial.text}</p>

                                {/* Status & Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <span
                                        className={`text-xs px-3 py-1 rounded-full font-semibold ${testimonial.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {testimonial.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openEditModal(testimonial)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => deleteTestimonial(testimonial._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Create/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl max-w-2xl w-full p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {editingTestimonial ? 'Edit Testimonial' : 'Create Testimonial'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Image */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Customer Photo
                                    </label>
                                    {formData.image && (
                                        <div className="mb-4">
                                            <Image
                                                src={getImageUrl(formData.image)}
                                                alt="Preview"
                                                width={80}
                                                height={80}
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                                        <div className="text-center">
                                            <FiUpload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <span className="text-sm text-gray-600">
                                                {uploading ? 'Uploading...' : 'Click to upload photo'}
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Customer Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                    />
                                </div>

                                {/* Text */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Testimonial Text *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                    />
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Rating (1-5) *
                                    </label>
                                    <select
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                    >
                                        {[5, 4, 3, 2, 1].map((num) => (
                                            <option key={num} value={num}>
                                                {num} Star{num > 1 ? 's' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Active */}
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                                        Show on website
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 gradient-gold text-white rounded-lg font-semibold"
                                    >
                                        {editingTestimonial ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
