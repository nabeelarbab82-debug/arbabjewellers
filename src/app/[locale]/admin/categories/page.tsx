'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import CategoryModal from '@/components/admin/CategoryModal';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface Category {
    _id: string;
    nameEn: string;
    nameUr: string;
    nameAr: string;
    descriptionEn?: string;
    descriptionUr?: string;
    descriptionAr?: string;
    level: number;
    parent?: string;
    children?: Category[];
    image?: string;
    order?: number;
    isActive?: boolean;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [parentCategory, setParentCategory] = useState<any>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/categories');
            setCategories(response?.data?.data || []);
        } catch (error) {
            toast.error('Failed to fetch categories');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (categoryId: string) => {
        if (!confirm('Are you sure? This will also delete all subcategories.')) return;

        try {
            await api.delete(`/categories/${categoryId}`);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to delete category');
        }
    };

    const toggleExpand = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const renderCategory = (category: Category, depth: number = 0) => {
        const hasChildren = category?.children && category?.children?.length > 0;
        const isExpanded = expandedCategories.has(category?._id);

        return (
            <div key={category?._id}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors`}
                    style={{ paddingLeft: `${depth * 2 + 1}rem` }}
                >
                    <div className="flex items-center space-x-3 flex-1">
                        {hasChildren && (
                            <button
                                onClick={() => toggleExpand(category?._id)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                            </button>
                        )}
                        {!hasChildren && <div className="w-4" />}

                        <div>
                            <h3 className="font-semibold text-gray-800">{category?.nameEn || 'N/A'}</h3>
                            <p className="text-sm text-gray-600">
                                {category?.nameUr || 'N/A'} | {category?.nameAr || 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            {category?.level === 1 && 'Main Category'}
                            {category?.level === 2 && 'Sub Category'}
                            {category?.level === 3 && 'Base Category'}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if ((category?.level || 0) < 3) {
                                    setParentCategory({ _id: category?._id, nameEn: category?.nameEn, level: category?.level });
                                    setEditingCategory(null);
                                    setShowModal(true);
                                } else {
                                    toast.error('Maximum 3 levels allowed');
                                }
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Add subcategory"
                        >
                            <FiPlus />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategory(category);
                                setParentCategory(null);
                                setShowModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                            <FiEdit2 />
                        </button>
                        <button
                            onClick={() => deleteCategory(category?._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                </motion.div>

                {hasChildren && isExpanded && (
                    <div>
                        {category?.children?.map((child) => renderCategory(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                        <p className="text-gray-600 mt-1">Manage product categories (3-level hierarchy)</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setEditingCategory(null);
                            setParentCategory(null);
                            setShowModal(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 gradient-gold text-white rounded-lg shadow-lg"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Add Category</span>
                    </motion.button>
                </div>

                {/* Categories Tree */}
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {categories?.length > 0 ? (
                            categories.map((category) => renderCategory(category))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No categories found. Add your first category to get started.
                            </div>
                        )}
                    </div>
                )}

                {/* Category Modal */}
                <CategoryModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setEditingCategory(null);
                        setParentCategory(null);
                    }}
                    onSuccess={fetchCategories}
                    editingCategory={editingCategory}
                    parentCategory={parentCategory}
                />
            </div>
        </AdminLayout>
    );
}
