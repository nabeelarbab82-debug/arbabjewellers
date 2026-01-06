'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductModal from '@/components/admin/ProductModal';
import ProductTable from '@/components/admin/ProductTable';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface Product {
    _id: string;
    name: string;
    nameEn?: string;
    nameUr?: string;
    nameAr?: string;
    price: number;
    images: string[];
    mainCategory?: {
        _id: string;
        nameEn: string;
    };
    subCategory?: {
        _id: string;
        nameEn: string;
    };
    baseCategory?: {
        _id: string;
        nameEn: string;
    };
    stock: number;
    isFeatured: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data.data.products);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const toggleFeatured = async (productId: string, isFeatured: boolean) => {
        try {
            await api.put(`/products/${productId}/toggle-featured`, { featured: !isFeatured });
            toast.success('Product updated successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to update product');
        }
    };

    const deleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/products/${productId}`);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                        <p className="text-gray-600 mt-1">Manage your product catalog</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setEditingProduct(null);
                            setShowModal(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 gradient-gold text-white rounded-lg shadow-lg"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Add Product</span>
                    </motion.button>
                </div>

                {/* Products Table */}
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <ProductTable
                        products={products}
                        onEdit={(product) => {
                            setEditingProduct(product);
                            setShowModal(true);
                        }}
                        onDelete={deleteProduct}
                        onToggleFeatured={toggleFeatured}
                    />
                )}

                {/* Product Modal */}
                <ProductModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchProducts}
                    editingProduct={editingProduct}
                />
            </div>
        </AdminLayout>
    );
}
