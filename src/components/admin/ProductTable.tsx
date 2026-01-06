'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiStar, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import { getImageUrl, formatPrice } from '@/lib/utils';

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

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
    onToggleFeatured: (productId: string, isFeatured: boolean) => void;
}

export default function ProductTable({ products, onEdit, onDelete, onToggleFeatured }: ProductTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter products based on search
    const filteredProducts = products.filter((product) =>
        (product.name || product.nameEn || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // Reset to page 1 when search changes
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Product Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Featured
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentProducts.map((product, index) => (
                                <motion.tr
                                    key={product._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-16 w-16 relative rounded-lg overflow-hidden bg-gray-100">
                                            {product.images.length > 0 ? (
                                                <Image
                                                    src={getImageUrl(product.images[0])}
                                                    alt={product.name || product.nameEn || 'Product'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {product.name || product.nameEn}
                                        </div>
                                        {product.nameUr && (
                                            <div className="text-xs text-gray-500 mt-1" dir="rtl">
                                                {product.nameUr}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {product.mainCategory?.nameEn || '-'}
                                        </div>
                                        {product.subCategory && (
                                            <div className="text-xs text-gray-500">
                                                {product.subCategory.nameEn}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-primary-600">
                                            {formatPrice(product.price)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 10
                                                ? 'bg-green-100 text-green-800'
                                                : product.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => onToggleFeatured(product._id, product.isFeatured)}
                                            className={`p-2 rounded-lg transition-colors ${product.isFeatured
                                                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                }`}
                                        >
                                            <FiStar className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(product._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {currentProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                {searchTerm ? 'No products found matching your search.' : 'No products available.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                            <span className="font-semibold">{Math.min(endIndex, filteredProducts.length)}</span> of{' '}
                            <span className="font-semibold">{filteredProducts.length}</span> results
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FiChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === page
                                                ? 'bg-primary-600 text-white'
                                                : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FiChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
