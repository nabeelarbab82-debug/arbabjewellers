'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { Cloudinary } from '@cloudinary/url-gen';

interface Category {
    _id: string;
    nameEn: string;
    nameUr: string;
    nameAr: string;
    level: number;
    parent?: string;
    children?: Category[];
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingProduct: any;
}

export default function ProductModal({ isOpen, onClose, onSuccess, editingProduct }: ProductModalProps) {
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [mainCategories, setMainCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<Category[]>([]);
    const [baseCategories, setBaseCategories] = useState<Category[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nameEn: '',
        nameUr: '',
        nameAr: '',
        descriptionEn: '',
        descriptionUr: '',
        descriptionAr: '',
        price: '',
        comparePrice: '',
        stock: '',
        weight: '',
        purity: '',
        mainCategory: '',
        subCategory: '',
        baseCategory: '',
        images: [] as string[],
        featured: false,
    });

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (editingProduct && editingProduct._id) {
                fetchProductDetails(editingProduct._id);
            } else {
                resetForm();
            }
        }
    }, [isOpen, editingProduct]);

    const fetchProductDetails = async (productId: string) => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${productId}`);
            const product = response.data.data;

            setFormData({
                nameEn: product.nameEn || product.name || '',
                nameUr: product.nameUr || '',
                nameAr: product.nameAr || '',
                descriptionEn: product.descriptionEn || product.description || '',
                descriptionUr: product.descriptionUr || '',
                descriptionAr: product.descriptionAr || '',
                price: product.price?.toString() || '',
                comparePrice: product.comparePrice?.toString() || product.salePrice?.toString() || '',
                stock: product.stock?.toString() || '',
                weight: product.weight?.toString() || '',
                purity: product.purity || '',
                mainCategory: product.mainCategory?._id || product.mainCategory || '',
                subCategory: product.subCategory?._id || product.subCategory || '',
                baseCategory: product.baseCategory?._id || product.baseCategory || '',
                images: product.images || [],
                featured: product.featured || product.isFeatured || false,
            });
        } catch (error) {
            toast.error('Failed to fetch product details');
            console.error('Fetch product error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load subcategories and base categories when editing
    useEffect(() => {
        if (allCategories.length > 0 && formData.mainCategory) {
            const subs = allCategories.filter(cat => cat.parent === formData.mainCategory && cat.level === 2);
            setSubCategories(subs);

            if (formData.subCategory) {
                const bases = allCategories.filter(cat => cat.parent === formData.subCategory && cat.level === 3);
                setBaseCategories(bases);
            }
        }
    }, [allCategories, formData.mainCategory, formData.subCategory]);

    const resetForm = () => {
        setFormData({
            nameEn: '',
            nameUr: '',
            nameAr: '',
            descriptionEn: '',
            descriptionUr: '',
            descriptionAr: '',
            price: '',
            comparePrice: '',
            stock: '',
            weight: '',
            purity: '',
            mainCategory: '',
            subCategory: '',
            baseCategory: '',
            images: [],
            featured: false,
        });
        setSubCategories([]);
        setBaseCategories([]);
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            const categoryTree = response.data.data || [];
            const flatList = flattenCategories(categoryTree);
            setAllCategories(flatList);
            setMainCategories(flatList.filter(cat => cat.level === 1));
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const flattenCategories = (cats: any[]): Category[] => {
        let result: Category[] = [];
        cats.forEach((cat) => {
            result.push({
                _id: cat._id,
                nameEn: cat.nameEn,
                nameUr: cat.nameUr || '',
                nameAr: cat.nameAr || '',
                level: cat.level,
                parent: cat.parent,
                children: cat.children
            });
            if (cat.children && cat.children.length > 0) {
                result = result.concat(flattenCategories(cat.children));
            }
        });
        return result;
    };

    const handleMainCategoryChange = (mainCategoryId: string) => {
        setFormData({
            ...formData,
            mainCategory: mainCategoryId,
            subCategory: '',
            baseCategory: ''
        });
        const subs = allCategories.filter(cat => cat.parent === mainCategoryId && cat.level === 2);
        setSubCategories(subs);
        setBaseCategories([]);
    };

    const handleSubCategoryChange = (subCategoryId: string) => {
        setFormData({
            ...formData,
            subCategory: subCategoryId,
            baseCategory: ''
        });
        const bases = allCategories.filter(cat => cat.parent === subCategoryId && cat.level === 3);
        setBaseCategories(bases);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const uploadedUrls: string[] = [];
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', uploadPreset!);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error.message);
                }

                if (data.secure_url) {
                    uploadedUrls.push(data.secure_url);
                }
            }

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));

            toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate at least one image
        if (formData.images.length === 0) {
            toast.error('Please upload at least one product image');
            return;
        }

        const productData = {
            nameEn: formData.nameEn,
            nameUr: formData.nameUr || undefined,
            nameAr: formData.nameAr || undefined,
            descriptionEn: formData.descriptionEn || undefined,
            descriptionUr: formData.descriptionUr || undefined,
            descriptionAr: formData.descriptionAr || undefined,
            price: parseFloat(formData.price),
            comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
            stock: parseInt(formData.stock),
            weight: formData.weight ? parseFloat(formData.weight) : undefined,
            purity: formData.purity || undefined,
            mainCategory: formData.mainCategory,
            subCategory: formData.subCategory,
            baseCategory: formData.baseCategory,
            images: formData.images, // Array of Cloudinary URLs
            isFeatured: formData.featured,
            isActive: true
        };

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, productData);
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', productData);
                toast.success('Product created successfully');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {editingProduct ? 'Edit Product' : 'Create Product'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form */}
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Images */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Images
                                </label>
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <Image
                                                src={img}
                                                alt="Product"
                                                width={200}
                                                height={200}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                                            {uploading && <p className="text-xs text-primary-600 mt-2">Uploading...</p>}
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

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
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Name (Urdu)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nameUr}
                                        onChange={(e) => setFormData({ ...formData, nameUr: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-right text-black"
                                        dir="rtl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Name (Arabic)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nameAr}
                                        onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-right text-black"
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
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
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
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-right text-black"
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
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-right text-black"
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            {/* Pricing & Stock */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price (PKR) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Compare Price
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.comparePrice}
                                        onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Stock *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Weight (g)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>
                            </div>

                            {/* Categories - 3 Level Hierarchy */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Main Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.mainCategory}
                                        onChange={(e) => handleMainCategoryChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    >
                                        <option value="">Select Main Category</option>
                                        {mainCategories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.nameEn}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Sub Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.subCategory}
                                        onChange={(e) => handleSubCategoryChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                        disabled={!formData.mainCategory}
                                    >
                                        <option value="">Select Sub Category</option>
                                        {subCategories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.nameEn}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Base Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.baseCategory}
                                        onChange={(e) => setFormData({ ...formData, baseCategory: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                        disabled={!formData.subCategory}
                                    >
                                        <option value="">Select Base Category</option>
                                        {baseCategories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.nameEn}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Purity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Purity (e.g., 24K, 22K, 18K)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.purity}
                                        onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-black"
                                    />
                                </div>
                            </div>

                            {/* Featured */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
                                    Feature this product on homepage
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 gradient-gold text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                                >
                                    {editingProduct ? 'Update Product' : 'Create Product'}
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
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
