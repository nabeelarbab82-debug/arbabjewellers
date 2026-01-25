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
                            <div className="flex items-center space-x-4 text-sm">
                                <span className={`px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.stock > 0 ? t('inStock') : t('outOfStock')}
                                </span>
                            </div>
                        </div>

                        <div className="prose prose-gray">
                            <h3 className="text-lg font-semibold">{t('description')}</h3>
                            <p>{product.description}</p>
                        </div>

                        {/* Product Note */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative bg-gradient-to-br from-black via-secondary-900 to-black border-2 border-primary-500/30 rounded-2xl p-6 space-y-4 overflow-hidden"
                        >
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-bl-full" />

                            <div className="relative">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center mt-1 border border-primary-500/30">
                                        <span className="text-primary-400 text-lg">ℹ️</span>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        <span className="font-semibold text-primary-400">Note:</span> Product images are for illustration purposes only. Actual product may vary slightly.
                                    </p>
                                </div>
                            </div>

                            <div className="relative border-t border-primary-500/30 pt-4">
                                <div className="flex items-start space-x-3 mb-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mt-1 border border-green-500/30">
                                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <p className="text-base text-gray-200 leading-relaxed">
                                        <span className="font-semibold text-white">Interested in this article?</span><br />
                                        <span className="text-gray-400">Reach out to us on WhatsApp for pricing details and availability.</span>
                                    </p>
                                </div>

                                <motion.a
                                    href={`https://wa.me/923323026222?text=Hi, I'm interested in this product:%0A%0AProduct: ${encodeURIComponent(product.name)}%0AImage: ${encodeURIComponent(getImageUrl(product.images[0]))}%0A%0APlease provide pricing details.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(34 197 94 / 0.3), 0 8px 10px -6px rgb(34 197 94 / 0.2)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full inline-flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-green-500/20 group"
                                >
                                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    <span className="text-lg">Chat on WhatsApp</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </motion.a>
                            </div>
                        </motion.div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex items-center space-x-4">
                            {/* <div className="flex items-center border-2 border-gray-200 rounded-lg">
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
                            </div> */}

                            {/* <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 py-3 gradient-gold text-white rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiShoppingCart className="w-5 h-5" />
                                <span>{tCommon('addToCart')}</span>
                            </motion.button> */}
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
