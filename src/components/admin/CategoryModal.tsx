'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface Category {
    _id?: string;
    nameEn: string;
    nameUr: string;
    nameAr: string;
    descriptionEn?: string;
    descriptionUr?: string;
    descriptionAr?: string;
    parent?: string;
    level: number;
    image?: string;
    order?: number;
    isActive?: boolean;
}

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingCategory: Category | null;
    parentCategory?: { _id: string; nameEn: string; level: number } | null;
}

export default function CategoryModal({
    isOpen,
    onClose,
    onSuccess,
    editingCategory,
    parentCategory,
}: CategoryModalProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState<Category>({
        nameEn: '',
        nameUr: '',
        nameAr: '',
        descriptionEn: '',
        descriptionUr: '',
        descriptionAr: '',
        parent: '',
        level: 1,
        image: '',
        order: 0,
    });

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (editingCategory) {
                setFormData({
                    nameEn: editingCategory.nameEn || '',
                    nameUr: editingCategory.nameUr || '',
                    nameAr: editingCategory.nameAr || '',
                    descriptionEn: editingCategory.descriptionEn || '',
                    descriptionUr: editingCategory.descriptionUr || '',
                    descriptionAr: editingCategory.descriptionAr || '',
                    parent: editingCategory.parent || '',
                    level: editingCategory.level || 1,
                    image: editingCategory.image || '',
                    order: editingCategory.order || 0,
                });
            } else if (parentCategory) {
                setFormData({
                    nameEn: '',
                    nameUr: '',
                    nameAr: '',
                    descriptionEn: '',
                    descriptionUr: '',
                    descriptionAr: '',
                    parent: parentCategory._id,
                    level: parentCategory.level + 1,
                    image: '',
                    order: 0,
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editingCategory, parentCategory]);

    const resetForm = () => {
        setFormData({
            nameEn: '',
            nameUr: '',
            nameAr: '',
            descriptionEn: '',
            descriptionUr: '',
            descriptionAr: '',
            parent: '',
            level: 1,
            image: '',
            order: 0,
        });
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const flattenCategories = (cats: any[], level: number = 1, prefix: string = ''): any[] => {
        let result: any[] = [];
        cats.forEach((cat) => {
            if (level < 3) {
                result.push({ ...cat, nameEn: prefix + cat.nameEn });
                if (cat.children && cat.children.length > 0) {
                    result = result.concat(flattenCategories(cat.children, level + 1, prefix + '  '));
                }
            }
        });
        return result;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.level > 3) {
            toast.error('Maximum 3 levels of categories allowed');
            return;
        }

        const categoryData = {
            nameEn: formData.nameEn,
            nameUr: formData.nameUr,
            nameAr: formData.nameAr,
            descriptionEn: formData.descriptionEn,
            descriptionUr: formData.descriptionUr,
            descriptionAr: formData.descriptionAr,
            level: formData.level,
            parent: formData.parent || null,
            image: formData.image || '',
            order: formData.order || 0,
        };

        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory._id}`, categoryData);
                toast.success('Category updated successfully');
            } else {
                await api.post('/categories', categoryData);
                toast.success('Category created successfully');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to save category');
        }
    };

    if (!isOpen) return null;

    const availableParents = flattenCategories(categories).filter((cat) => cat.level < 3);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingCategory ? 'Edit Category' : 'Create Category'}
                            </h2>
                            {parentCategory && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Parent: {parentCategory.nameEn} (Level {parentCategory.level})
                                </p>
                            )}
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Parent Category */}
                        {!parentCategory && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Parent Category (Optional)
                                </label>
                                <select
                                    value={formData.parent}
                                    onChange={(e) => {
                                        const selectedParent = availableParents.find((c) => c._id === e.target.value);
                                        setFormData({
                                            ...formData,
                                            parent: e.target.value,
                                            level: selectedParent ? selectedParent.level + 1 : 1,
                                        });
                                    }}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                >
                                    <option value="">-- Top Level Category --</option>
                                    {availableParents.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.nameEn} (Level {cat.level})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    This will be a Level {formData.level} category. Maximum 3 levels allowed.
                                </p>
                            </div>
                        )}

                        {/* Names */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Name (English) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nameEn}
                                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Name (Urdu) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nameUr}
                                    onChange={(e) => setFormData({ ...formData, nameUr: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-right"
                                    dir="rtl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Name (Arabic) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nameAr}
                                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-right"
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        {/* Descriptions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description (English)
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.descriptionEn}
                                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description (Urdu)
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.descriptionUr}
                                    onChange={(e) => setFormData({ ...formData, descriptionUr: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-right"
                                    dir="rtl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description (Arabic)
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.descriptionAr}
                                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-right"
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        {/* Image URL and Order */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Image URL (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                className="flex-1 py-3 gradient-gold text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                            >
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
