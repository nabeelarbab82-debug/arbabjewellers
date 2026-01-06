'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Testimonials() {
    const t = useTranslations('testimonials');

    const testimonials = [
        {
            name: 'Sarah Ahmed',
            role: 'Customer',
            image: 'https://i.pravatar.cc/150?img=1',
            rating: 5,
            text: 'Absolutely stunning jewelry! The quality exceeded my expectations. I bought a beautiful necklace for my wedding and received so many compliments.',
        },
        {
            name: 'Ali Hassan',
            role: 'Customer',
            image: 'https://i.pravatar.cc/150?img=2',
            rating: 5,
            text: 'Excellent service and authentic products. The staff was very helpful in choosing the perfect engagement ring. Highly recommended!',
        },
        {
            name: 'Fatima Khan',
            role: 'Customer',
            image: 'https://i.pravatar.cc/150?img=3',
            rating: 5,
            text: 'Best jewelry shop in town! Their collection is exquisite and prices are reasonable. I am a regular customer now.',
        },
        {
            name: 'Ahmed Raza',
            role: 'Customer',
            image: 'https://i.pravatar.cc/150?img=4',
            rating: 5,
            text: 'Amazing craftsmanship and beautiful designs. Purchased multiple items as gifts and everyone loved them!',
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4"
                    >
                        {t('subtitle')}
                    </motion.span>

                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 gradient-text">
                        {t('title')}
                    </h2>

                    <p className="text-lg text-gray-600">
                        {t('description')}
                    </p>
                </motion.div>

                {/* Testimonials Slider */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="!pb-12"
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full"
                                >
                                    {/* Rating */}
                                    <div className="flex items-center space-x-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <FiStar key={i} className="w-5 h-5 fill-primary-500 text-primary-500" />
                                        ))}
                                    </div>

                                    {/* Text */}
                                    <p className="text-gray-700 leading-relaxed mb-6 italic">
                                        "{testimonial.text}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover ring-4 ring-primary-100"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-800">{testimonial.name}</div>
                                            <div className="text-sm text-gray-600">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
}
