'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FiAward, FiHeart, FiShield, FiTruck } from 'react-icons/fi';

export default function AboutSection() {
    const t = useTranslations('about');

    const features = [
        {
            icon: FiAward,
            title: 'Premium Quality',
            description: 'Certified and authentic jewelry crafted with excellence',
        },
        {
            icon: FiShield,
            title: 'Secure Shopping',
            description: 'Your transactions are protected and secure',
        },
        {
            icon: FiTruck,
            title: 'Fast Delivery',
            description: 'Quick and reliable shipping to your doorstep',
        },
        {
            icon: FiHeart,
            title: 'Customer Care',
            description: 'Dedicated support for all your needs',
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="rounded-2xl overflow-hidden shadow-lg"
                            >
                                <img
                                    src="https://res.cloudinary.com/dm87rn19g/image/upload/v1769332549/ar74kpmh0hsinxlrl2ev.jpg"
                                    alt="Jewelry 1"
                                    className="w-full h-64 object-contain bg-white"
                                />
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="rounded-2xl overflow-hidden shadow-lg mt-8"
                            >
                                <img
                                    src="https://res.cloudinary.com/dm87rn19g/image/upload/v1769332544/vwzlugtvdt0fds2by5i2.jpg"
                                    alt="Jewelry 2"
                                    className="w-full h-64 object-contain bg-white"
                                />
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="rounded-2xl overflow-hidden shadow-lg -mt-8"
                            >
                                <img
                                    src="https://res.cloudinary.com/dm87rn19g/image/upload/v1769332544/itr6rya5vltscqykxoik.jpg"
                                    alt="Jewelry 3"
                                    className="w-full h-64 object-contain bg-white"
                                />
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="rounded-2xl overflow-hidden shadow-lg"
                            >
                                <img
                                    src="https://res.cloudinary.com/dm87rn19g/image/upload/v1769332545/dqwx8rheikdl34ylw8nw.jpg"
                                    alt="Jewelry 4"
                                    className="w-full h-64 object-contain bg-white"
                                />
                            </motion.div>
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="text-5xl font-bold gradient-text">65+</div>
                                <div className="text-sm text-gray-600 mt-2 font-semibold">Years of Excellence</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div>
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4"
                            >
                                {t('subtitle')}
                            </motion.span>

                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 gradient-text">
                                {t('title')}
                            </h2>

                            <p className="text-lg text-gray-600 leading-relaxed">
                                {t('description')}
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                                >
                                    <feature.icon className="w-10 h-10 text-primary-600 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
