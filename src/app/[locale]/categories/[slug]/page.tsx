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
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [mainCategories, setMainCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<Category[]>([]);
    const [baseCategories, setBaseCategories] = useState<Category[]>([]);

    const [selectedMainId, setSelectedMainId] = useState<string>('');
    const [selectedSubId, setSelectedSubId] = useState<string>('');
    const [selectedBaseId, setSelectedBaseId] = useState<string>('');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        fetchCategoryAndProducts();
    }, [slug]);

    const fetchCategoryAndProducts = async () => {
        try {
            const categoriesResponse = await axios.get('/categories');
            const cats = categoriesResponse.data.data;
            setAllCategories(cats);
            setMainCategories(cats.filter((c: Category) => c.level === 1));

            // Find the category by slug to set initial state
            const findCategoryBySlug = (categories: Category[]): Category | null => {
                for (const cat of categories) {
                    if (cat.slug === slug) return cat;
                    if (cat.children) {
                        const found = findCategoryBySlug(cat.children);
                        if (found) return found;
                    }
                }
                return null;
            };

            const foundCat = findCategoryBySlug(cats);
            if (foundCat) {
                setCategory(foundCat);

                // If it's a main category, load its products directly
                if (foundCat.level === 1) {
                    setSelectedMainId(foundCat._id);
                    fetchProducts(foundCat._id, '', '');
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (mainId: string, subId: string, baseId: string) => {
        try {
            let url = '/products?';
            if (mainId) url += `mainCategory=${mainId}`;
            if (subId) url += `&subCategory=${subId}`;
            if (baseId) url += `&baseCategory=${baseId}`;

            const response = await axios.get(url);
            const productData = response?.data?.data?.products || response?.data?.products || response?.data?.data || [];
            setProducts(productData);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        }
    };

    const handleMainCategoryChange = (mainId: string) => {
        setSelectedMainId(mainId);
        setSelectedSubId('');
        setSelectedBaseId('');
        setSubCategories([]);
        setBaseCategories([]);

        if (mainId) {
            const mainCat = mainCategories.find(c => c._id === mainId);
            if (mainCat?.children) {
                setSubCategories(mainCat.children);
            }
            fetchProducts(mainId, '', '');
        } else {
            setProducts([]);
        }
    };

    const handleSubCategoryChange = (subId: string) => {
        setSelectedSubId(subId);
        setSelectedBaseId('');
        setBaseCategories([]);

        if (subId) {
            const subCat = subCategories.find(c => c._id === subId);
            if (subCat?.children) {
                setBaseCategories(subCat.children);
            }
            fetchProducts(selectedMainId, subId, '');
        } else if (selectedMainId) {
            fetchProducts(selectedMainId, '', '');
        }
    };

    const handleBaseCategoryChange = (baseId: string) => {
        setSelectedBaseId(baseId);

        if (baseId) {
            fetchProducts(selectedMainId, selectedSubId, baseId);
        } else if (selectedSubId) {
            fetchProducts(selectedMainId, selectedSubId, '');
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

            {/* Category Filters */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100 rounded-full blur-3xl opacity-20 animate-pulse delay-700" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-serif font-bold gradient-text mb-3">Refine Your Search</h2>
                        <p className="text-gray-600">Select categories to find your perfect jewelry piece</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Main Category Dropdown */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="relative group"
                            >
                                <label className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold mr-2">1</span>
                                    Main Category
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedMainId}
                                        onChange={(e) => handleMainCategoryChange(e.target.value)}
                                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none bg-white text-gray-800 font-semibold transition-all duration-300 appearance-none cursor-pointer hover:border-primary-300 hover:shadow-lg"
                                    >
                                        <option value="">Select Main Category</option>
                                        {mainCategories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.nameEn}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {selectedMainId && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Sub Category Dropdown */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="relative group"
                            >
                                <label className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold mr-2">2</span>
                                    Sub Category
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedSubId}
                                        onChange={(e) => handleSubCategoryChange(e.target.value)}
                                        disabled={!selectedMainId || subCategories.length === 0}
                                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none bg-white text-gray-800 font-semibold disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-300 appearance-none cursor-pointer hover:border-primary-300 hover:shadow-lg disabled:hover:border-gray-200 disabled:hover:shadow-none"
                                    >
                                        <option value="">All Subcategories</option>
                                        {subCategories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.nameEn}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {selectedSubId && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Base Category Dropdown */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="relative group"
                            >
                                <label className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold mr-2">3</span>
                                    Base Category
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedBaseId}
                                        onChange={(e) => handleBaseCategoryChange(e.target.value)}
                                        disabled={!selectedSubId || baseCategories.length === 0}
                                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none bg-white text-gray-800 font-semibold disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-300 appearance-none cursor-pointer hover:border-primary-300 hover:shadow-lg disabled:hover:border-gray-200 disabled:hover:shadow-none"
                                    >
                                        <option value="">All Base Categories</option>
                                        {baseCategories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.nameEn}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {selectedBaseId && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

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
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex overflow-hidden h-48">
                        <div className="w-48 h-48 flex-shrink-0">
                            <img
                                src={product.images[0] || 'https://via.placeholder.com/400'}
                                alt={product.nameEn || product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.nameEn || product.name}</h3>
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
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
                    <div className="relative aspect-square overflow-hidden">
                        <motion.img
                            src={product.images[0] || 'https://via.placeholder.com/400'}
                            alt={product.nameEn || product.name}
                            className="w-full h-full object-cover"
                            animate={{ scale: isHovered ? 1.1 : 1 }}
                            transition={{ duration: 0.6 }}
                        />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 flex-1">
                            {product.nameEn || product.name}
                        </h3>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
