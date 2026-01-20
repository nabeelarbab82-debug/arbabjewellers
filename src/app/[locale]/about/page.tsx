'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import MainLayout from '@/components/layout/MainLayout';
import { FiAward, FiHeart, FiShield, FiTrendingUp, FiUsers, FiStar, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export default function AboutPage() {
    const t = useTranslations('about');

    const values = [
        {
            icon: FiAward,
            title: 'Excellence',
            description: 'We strive for excellence in every piece of jewelry we create, ensuring the highest quality craftsmanship.',
        },
        {
            icon: FiHeart,
            title: 'Passion',
            description: 'Our passion for jewelry drives us to create timeless pieces that tell your unique story.',
        },
        {
            icon: FiShield,
            title: 'Trust',
            description: 'Built on decades of trust, we provide authentic and certified jewelry with complete transparency.',
        },
        {
            icon: FiTrendingUp,
            title: 'Innovation',
            description: 'We blend traditional craftsmanship with modern designs to create contemporary masterpieces.',
        },
        {
            icon: FiUsers,
            title: 'Customer Focus',
            description: 'Your satisfaction is our priority. We go above and beyond to exceed your expectations.',
        },
        {
            icon: FiStar,
            title: 'Quality',
            description: 'Every piece undergoes rigorous quality checks to ensure it meets our exceptional standards.',
        },
    ];

    const stats = [
        { number: '30+', label: 'Years of Experience' },
        { number: '50K+', label: 'Happy Customers' },
        { number: '100+', label: 'Unique Designs' },
        { number: '99%', label: 'Customer Satisfaction' },
    ];

    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920"
                        alt="About Arbab Jewellers"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-6 py-2 bg-primary-500/10 text-primary-500 border border-primary-500/30 rounded-full text-sm font-semibold mb-6"
                        >
                            Our Story
                        </motion.span>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
                            About <span className="gradient-text">Arbab Jewellers</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                            Crafting Timeless Elegance Since 1990
                        </p>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary-500/20 rounded-full animate-pulse" />
                <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-primary-500/20 rounded-full animate-pulse delay-300" />
            </section>

            {/* Our Story Section */}
            <section className="py-20 bg-black">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="relative">
                                <Image
                                    src="/logo/about.jpeg"
                                    alt="Arbab Jewellers Outlet"
                                    width={800}
                                    height={600}
                                    className="rounded-2xl shadow-2xl shadow-primary-500/20 border border-primary-500/20 object-cover"
                                />
                                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl -z-10 blur-xl opacity-50" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl md:text-5xl font-serif font-bold gradient-text">
                                Our Journey
                            </h2>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Founded in 1990, Arbab Jewellers has been a beacon of excellence in the jewelry industry for over three decades. What started as a small family business has grown into one of the most trusted names in fine jewelry.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Our journey is built on the foundation of trust, quality, and exceptional craftsmanship. Every piece of jewelry that leaves our workshop carries with it the legacy of our skilled artisans and the dreams of our valued customers.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                We specialize in creating bespoke jewelry pieces that celebrate life's most precious moments. From engagement rings to heritage pieces, each creation is a testament to our commitment to excellence.
                            </p>
                            <div className="pt-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-block px-8 py-4 gradient-gold text-black rounded-lg font-semibold shadow-lg shadow-primary-500/20"
                                >
                                    Trusted by 50,000+ Customers
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-black-gold">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                                    className="text-4xl md:text-5xl font-bold text-primary-400 mb-2"
                                >
                                    {stat.number}
                                </motion.div>
                                <div className="text-gray-300 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20 bg-black border-t border-primary-900/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold gradient-text mb-4">
                            Our Values
                        </h2>
                        <p className="text-lg text-gray-400">
                            The principles that guide everything we do
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="bg-secondary-900 border border-primary-500/20 p-8 rounded-2xl shadow-lg shadow-primary-500/10 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 h-full flex flex-col"
                            >
                                <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-6 border border-primary-500/30">
                                    <value.icon className="w-8 h-8 text-primary-400" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-primary-400 mb-4">
                                    {value.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed flex-1">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20 bg-black border-t border-primary-900/20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-secondary-900 border border-primary-500/20 p-10 rounded-2xl shadow-lg shadow-primary-500/10"
                        >
                            <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mb-6 border border-primary-500/30">
                                <FiTrendingUp className="w-10 h-10 text-primary-400" />
                            </div>
                            <h3 className="text-3xl font-serif font-bold gradient-text mb-6">
                                Our Mission
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                To create exquisite jewelry that celebrates life's most precious moments, while maintaining the highest standards of quality, authenticity, and customer service. We aim to be the trusted choice for generations to come.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-secondary-900 border border-primary-500/20 p-10 rounded-2xl shadow-lg shadow-primary-500/10"
                        >
                            <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mb-6 border border-primary-500/30">
                                <FiStar className="w-10 h-10 text-primary-400" />
                            </div>
                            <h3 className="text-3xl font-serif font-bold gradient-text mb-6">
                                Our Vision
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                To be recognized as the leading jewelry house that combines traditional craftsmanship with contemporary design, setting new standards in the industry and creating pieces that become family heirlooms.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Information Section */}
            <section className="py-20 bg-black border-t border-primary-900/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold gradient-text mb-4">
                            Visit Our Showroom
                        </h2>
                        <p className="text-lg text-gray-400">
                            Come visit us and experience our exquisite collection in person
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-secondary-900 border border-primary-500/20 p-8 rounded-2xl text-center">
                                <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4 mx-auto border border-primary-500/30">
                                    <FiMapPin className="w-8 h-8 text-primary-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-primary-400 mb-3">Address</h3>
                                <p className="text-gray-300 space-y-2">
                                    <span className="block">Shop No.13-A Opposite Arena Cinema<br />
                                        Phase 4 Bahria Heights 3<br />
                                        Bahria Town Rawalpindi</span>
                                    <span className="block mt-4">Shop#75, Lalkurti<br />Rawalpindi Cantt</span>
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-secondary-900 border border-primary-500/20 p-8 rounded-2xl text-center">
                                <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4 mx-auto border border-primary-500/30">
                                    <FiPhone className="w-8 h-8 text-primary-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-primary-400 mb-3">Phone</h3>
                                <div className="text-gray-300 space-y-2">
                                    <a href="tel:03335861171" className="hover:text-primary-400 transition-colors text-lg block">
                                        0333-5861171
                                    </a>
                                    <a href="tel:03323026222" className="hover:text-primary-400 transition-colors text-lg block">
                                        0332-3026222 (WhatsApp)
                                    </a>
                                    <a href="tel:0516102658" className="hover:text-primary-400 transition-colors text-lg block">
                                        051-6102658 (PTCL)
                                    </a>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-secondary-900 border border-primary-500/20 p-8 rounded-2xl text-center">
                                <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4 mx-auto border border-primary-500/30">
                                    <FiMail className="w-8 h-8 text-primary-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-primary-400 mb-3">Email</h3>
                                <a href="mailto:nabeelarbab82@gmail.com" className="text-gray-300 hover:text-primary-400 transition-colors break-all">
                                    nabeelarbab82@gmail.com
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-black-gold">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                            Explore Our Collection
                        </h2>
                        <p className="text-xl text-gray-200 mb-8">
                            Browse our exquisite jewelry pieces and find the perfect one for you
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.a
                                href="/contact"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-primary-500 text-black rounded-lg font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all"
                            >
                                Contact Us
                            </motion.a>
                            <motion.a
                                href="/products"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all"
                            >
                                Browse Collection
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </MainLayout>
    );
}
