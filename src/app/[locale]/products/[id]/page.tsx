'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';
import MainLayout from '@/components/layout/MainLayout';
import { useCartStore } from '@/store/cartStore';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

export default function ProductDetailPage() {
    const params = useParams();
    const locale = useLocale();
    const t = useTranslations('product');
    const tCommon = useTranslations('common');
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${params.id}`);
                setProduct(response.data.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    const handleAddToCart = () => {
        if (product) {
            addItem({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity,
                image: product.images[0],
                stock: product.stock,
            });
            toast.success(t('addedToCart'));
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-32">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="skeleton h-96 rounded-2xl" />
                        <div className="space-y-4">
                            <div className="skeleton h-8 w-3/4" />
                            <div className="skeleton h-6 w-1/2" />
                            <div className="skeleton h-32 w-full" />
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!product) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-32 text-center">
                    <h1 className="text-2xl font-bold">Product not found</h1>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-32">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                            <img
                                src={getImageUrl(product.images[selectedImage])}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((image: string, index: number) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square rounded-lg overflow-hidden ${selectedImage === index ? 'ring-4 ring-primary-600' : ''
                                        }`}
                                >
                                    <img
                                        src={getImageUrl(image)}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h1 className="text-4xl font-serif font-bold mb-4">{product.name}</h1>
                            <div className="text-3xl font-bold gradient-text mb-4">
                                {tCommon('currency')} {product.price.toLocaleString()}
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <span className={`px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.stock > 0 ? t('inStock') : t('outOfStock')}
                                </span>
                                <span className="text-gray-600">{t('sku')}: {product.sku || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="prose prose-gray">
                            <h3 className="text-lg font-semibold">{t('description')}</h3>
                            <p>{product.description}</p>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="px-6 py-2 border-x-2 border-gray-200">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-4 py-2 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 py-3 gradient-gold text-white rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiShoppingCart className="w-5 h-5" />
                                <span>{tCommon('addToCart')}</span>
                            </motion.button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-200 rounded-lg hover:border-primary-600 transition-colors"
                            >
                                <FiHeart className="w-5 h-5" />
                                <span>Wishlist</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-200 rounded-lg hover:border-primary-600 transition-colors"
                            >
                                <FiShare2 className="w-5 h-5" />
                                <span>Share</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
