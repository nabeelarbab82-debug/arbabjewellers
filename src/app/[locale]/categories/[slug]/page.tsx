'use client';

import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { FiGrid, FiList, FiArrowLeft } from 'react-icons/fi';

interface Category {
    _id: string;
    nameEn: string;
    nameUr: string;
    nameAr: string;
    slug: string;
    descriptionEn?: string;
    image?: string;
    level: number;
    children?: Category[];
}

interface Product {
    _id: string;
    name: string;
    nameEn: string;
    nameUr: string;
    nameAr: string;
    slug: string;
    description: string;
    descriptionEn?: string;
    descriptionUr?: string;
    descriptionAr?: string;
    images: string[];
    price: number;
    salePrice?: number;
    stock: number;
    isFeatured: boolean;
    isActive: boolean;
}

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const locale = useLocale();
    const t = useTranslations('category');

    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        fetchCategoryAndProducts();
    }, [slug]);

    const fetchCategoryAndProducts = async () => {
        try {
            // Fetch all categories and find the one with matching slug
            const categoriesResponse = await axios.get('/categories');
            const allCategories = categoriesResponse.data.data;

            const findCategory = (cats: Category[]): Category | null => {
                for (const cat of cats) {
                    if (cat.slug === slug) return cat;
                    if (cat.children) {
                        const found = findCategory(cat.children);
                        if (found) return found;
                    }
                }
                return null;
            };

            const foundCategory = findCategory(allCategories);
            setCategory(foundCategory);

            if (foundCategory) {
                // Fetch products for this category
                // Try different API endpoints based on category level
                let productsResponse;
                try {
                    if (foundCategory.level === 1) {
                        productsResponse = await axios.get(`/products?mainCategory=${foundCategory._id}`);
                    } else if (foundCategory.level === 2) {
                        productsResponse = await axios.get(`/products?subCategory=${foundCategory._id}`);
                    } else if (foundCategory.level === 3) {
                        productsResponse = await axios.get(`/products?baseCategory=${foundCategory._id}`);
                    }
                    // Handle the nested response structure
                    const productData = productsResponse?.data?.data?.products || productsResponse?.data?.products || productsResponse?.data?.data || [];
                    setProducts(productData);
                } catch (productError) {
                    console.error('Error fetching products:', productError);
                    setProducts([]);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Category Not Found</h1>
                <Link href={`/${locale}/categories`} className="text-primary-600 hover:text-primary-700 font-semibold">
                    Back to Categories
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={category.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920'}
                        alt={category.nameEn}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <Link
                        href={`/${locale}/categories`}
                        className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Categories
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
                            {category.nameEn}
                        </h1>
                        {category.descriptionEn && (
                            <p className="text-xl text-white/90 max-w-3xl">
                                {category.descriptionEn}
                            </p>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Subcategories */}
            {category.children && category.children.length > 0 && (
                <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8">Subcategories</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {category.children.map((subcat) => (
                                <Link key={subcat._id} href={`/${locale}/categories/${subcat.slug}`}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800">{subcat.nameEn}</h3>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Products Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-serif font-bold text-gray-800">
                            Products ({products.length})
                        </h2>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                            >
                                <FiGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                            >
                                <FiList className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-xl text-gray-600">No products found in this category.</p>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8' : 'space-y-6'}>
                            {products.map((product, index) => (
                                <ProductCard key={product._id} product={product} viewMode={viewMode} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function ProductCard({ product, viewMode, index }: { product: Product; viewMode: 'grid' | 'list'; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const locale = useLocale();
    const discount = product.salePrice && product.salePrice > 0 ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
            >
                <Link href={`/${locale}/products/${product._id}`}>
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex overflow-hidden">
                        <div className="w-48 h-48 flex-shrink-0">
                            <img
                                src={product.images[0] || 'https://via.placeholder.com/400'}
                                alt={product.nameEn || product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.nameEn || product.name}</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-primary-600">
                                    ${product.salePrice || product.price}
                                </span>
                                {product.salePrice && product.salePrice > 0 && (
                                    <span className="text-lg text-gray-400 line-through">${product.price}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Link href={`/${locale}/products/${product._id}`}>
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="relative aspect-square overflow-hidden">
                        <motion.img
                            src={product.images[0] || 'https://via.placeholder.com/400'}
                            alt={product.nameEn || product.name}
                            className="w-full h-full object-cover"
                            animate={{ scale: isHovered ? 1.1 : 1 }}
                            transition={{ duration: 0.6 }}
                        />
                        {discount > 0 && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                -{discount}%
                            </div>
                        )}
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                            {product.nameEn || product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary-600">
                                ${product.salePrice && product.salePrice > 0 ? product.salePrice : product.price}
                            </span>
                            {product.salePrice && product.salePrice > 0 && (
                                <span className="text-sm text-gray-400 line-through">${product.price}</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
