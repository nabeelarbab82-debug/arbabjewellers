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
            name: 'Ayesha Malik',
            role: 'Customer',
            image: 'https://i.pravatar.cc/150?img=5',
            rating: 5,
            text: 'The earrings I purchased are simply gorgeous! The craftsmanship is outstanding and they are so comfortable to wear. Will definitely shop here again.',
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
            name: 'Zainab Hussain',
            role: 'Customer',
            image: 'https://i.pravatar.cc/150?img=9',
            rating: 5,
            text: 'I love the variety of designs they offer! Bought a stunning bracelet set and the quality is exceptional. Highly satisfied with my purchase.',
        },
        {
            name: 'Ahmed Raza',
            role: 'Customer',
            image: 'https://i.pravatar.cc/150?img=4',
            rating: 5,
            text: 'Amazing craftsmanship and beautiful designs. Purchased multiple items as gifts and everyone loved them!',
        },
        {
            name: 'Maryam Siddiqui',
            role: 'Customer',
            image: 'https://i.pravatar.cc/150?img=10',
            rating: 5,
            text: 'Their bridal collection is breathtaking! I found everything I needed for my wedding. The staff helped me choose pieces that perfectly matched my outfit.',
        },
        {
            name: 'Hira Khan',
            role: 'Customer',
            image: 'https://i.pravatar.cc/150?img=16',
            rating: 5,
            text: 'Exceptional quality and beautiful designs! The gold bangles I bought are absolutely perfect. Great customer service and fair pricing.',
        },
    ];

    return (
        <section className="py-20 bg-black border-t border-primary-900/20">
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
                        className="inline-block px-4 py-2 bg-primary-500/10 text-primary-500 border border-primary-500/30 rounded-full text-sm font-semibold mb-4"
                    >
                        {t('subtitle')}
                    </motion.span>

                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 gradient-text">
                        {t('title')}
                    </h2>

                    <p className="text-lg text-gray-400">
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
                                    className="bg-secondary-900 border border-primary-500/20 p-8 rounded-2xl shadow-lg shadow-primary-500/10 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 h-80 flex flex-col"
                                >
                                    {/* Rating */}
                                    <div className="flex items-center space-x-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <FiStar key={i} className="w-5 h-5 fill-primary-500 text-primary-500" />
                                        ))}
                                    </div>

                                    {/* Text */}
                                    <p className="text-gray-300 leading-relaxed mb-6 italic flex-1 line-clamp-4">
                                        "{testimonial.text}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center space-x-4 pt-4 border-t border-primary-500/20 mt-auto">
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover ring-4 ring-primary-500/30"
                                        />
                                        <div>
                                            <div className="font-semibold text-primary-400">{testimonial.name}</div>
                                            <div className="text-sm text-gray-400">{testimonial.role}</div>
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
