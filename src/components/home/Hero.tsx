'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPhone } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';

export default function Hero() {
    const t = useTranslations('hero');
    const tCommon = useTranslations('common');
    const locale = useLocale();

    // First video refs and state
    const videoRef1 = useRef<HTMLVideoElement>(null);
    const sectionRef1 = useRef<HTMLElement>(null);
    const [isPlaying1, setIsPlaying1] = useState(true);
    const [isMuted1, setIsMuted1] = useState(true);

    // Second video refs and state
    const videoRef2 = useRef<HTMLVideoElement>(null);
    const sectionRef2 = useRef<HTMLElement>(null);
    const [isPlaying2, setIsPlaying2] = useState(true);
    const [isMuted2, setIsMuted2] = useState(true);

    const togglePlay1 = () => {
        if (videoRef1.current) {
            if (isPlaying1) {
                videoRef1.current.pause();
            } else {
                videoRef1.current.play();
            }
            setIsPlaying1(!isPlaying1);
        }
    };

    const toggleMute1 = () => {
        if (videoRef1.current) {
            videoRef1.current.muted = !isMuted1;
            setIsMuted1(!isMuted1);
        }
    };

    const togglePlay2 = () => {
        if (videoRef2.current) {
            if (isPlaying2) {
                videoRef2.current.pause();
            } else {
                videoRef2.current.play();
            }
            setIsPlaying2(!isPlaying2);
        }
    };

    const toggleMute2 = () => {
        if (videoRef2.current) {
            videoRef2.current.muted = !isMuted2;
            setIsMuted2(!isMuted2);
        }
    };

    // Pause videos when scrolling away from their sections
    useEffect(() => {
        const observer1 = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (videoRef1.current) {
                        if (entry.isIntersecting) {
                            videoRef1.current.play();
                            setIsPlaying1(true);
                        } else {
                            videoRef1.current.pause();
                            setIsPlaying1(false);
                        }
                    }
                });
            },
            { threshold: 0.3 }
        );

        const observer2 = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (videoRef2.current) {
                        if (entry.isIntersecting) {
                            videoRef2.current.play();
                            setIsPlaying2(true);
                        } else {
                            videoRef2.current.pause();
                            setIsPlaying2(false);
                        }
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef1.current) {
            observer1.observe(sectionRef1.current);
        }
        if (sectionRef2.current) {
            observer2.observe(sectionRef2.current);
        }

        return () => {
            if (sectionRef1.current) {
                observer1.unobserve(sectionRef1.current);
            }
            if (sectionRef2.current) {
                observer2.unobserve(sectionRef2.current);
            }
        };
    }, []);

    return (
        <>
            {/* First Hero Section - Video Only */}
            <section ref={sectionRef1} className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
                <div className="relative w-full h-full z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative w-full h-full"
                    >
                        <div className="relative w-full aspect-video overflow-hidden shadow-2xl group">
                            <video
                                ref={videoRef1}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            >
                                <source
                                    src="https://cdn.shopify.com/videos/c/o/v/6d05ee27411847279eacf6d4c6a62e49.mp4"
                                    type="video/mp4"
                                />
                                Your browser does not support the video tag.
                            </video>

                            {/* Video Controls */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md rounded-full px-6 py-4 shadow-2xl">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={togglePlay1}
                                        className="text-white hover:text-primary-400 transition-colors duration-200"
                                        aria-label={isPlaying1 ? 'Pause video' : 'Play video'}
                                    >
                                        {isPlaying1 ? (
                                            <FiPause className="w-6 h-6 sm:w-8 sm:h-8" />
                                        ) : (
                                            <FiPlay className="w-6 h-6 sm:w-8 sm:h-8" />
                                        )}
                                    </motion.button>
                                    <div className="w-px h-8 bg-white/30" />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleMute1}
                                        className="text-white hover:text-primary-400 transition-colors duration-200"
                                        aria-label={isMuted1 ? 'Unmute video' : 'Mute video'}
                                    >
                                        {isMuted1 ? (
                                            <FiVolumeX className="w-6 h-6 sm:w-8 sm:h-8" />
                                        ) : (
                                            <FiVolume2 className="w-6 h-6 sm:w-8 sm:h-8" />
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Subtle shine effect */}
                            <motion.div
                                animate={{
                                    x: ['-100%', '200%'],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            />
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-2xl border border-primary-100 z-20"
                        >
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">💎</span>
                                <span className="font-bold text-gray-800">Exquisite Diamond Collection</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Second Section - Content + Video */}
            <section ref={sectionRef2} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-200/20 to-transparent rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -90, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-secondary-200/20 to-transparent rounded-full blur-3xl"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block"
                            >
                                <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                                    ✨ {t('subtitle')}
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight"
                            >
                                <span className="gradient-text">{t('title')}</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-gray-600 leading-relaxed"
                            >
                                {t('description')}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap gap-4"
                            >
                                <Link href={`/${locale}/products`}>
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 gradient-gold text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <span>{t('cta')}</span>
                                        <FiArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>

                                <Link href={`/${locale}/contact`}>
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 rounded-lg font-semibold shadow-lg hover:bg-primary-50 transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <FiPhone className="w-5 h-5" />
                                        <span>{t('ctaSecondary')}</span>
                                    </motion.button>
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
                            >
                                {[
                                    { value: '500+', label: 'Products' },
                                    { value: '10K+', label: 'Happy Customers' },
                                    { value: '25+', label: 'Years Experience' },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                                        <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Second Video Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="relative z-10"
                            >
                                <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl ring-4 ring-primary-200/50 ring-offset-4 ring-offset-white group">
                                    <video
                                        ref={videoRef2}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    >
                                        <source
                                            src="https://res.cloudinary.com/dm87rn19g/video/upload/v1768053795/ln0kaoy11ylgctryotrh.mp4"
                                            type="video/mp4"
                                        />
                                        Your browser does not support the video tag.
                                    </video>
                                    {/* Elegant gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

                                    {/* Video Controls */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md rounded-full px-6 py-4 shadow-2xl">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={togglePlay2}
                                                className="text-white hover:text-primary-400 transition-colors duration-200"
                                                aria-label={isPlaying2 ? 'Pause video' : 'Play video'}
                                            >
                                                {isPlaying2 ? (
                                                    <FiPause className="w-6 h-6 sm:w-8 sm:h-8" />
                                                ) : (
                                                    <FiPlay className="w-6 h-6 sm:w-8 sm:h-8" />
                                                )}
                                            </motion.button>
                                            <div className="w-px h-8 bg-white/30" />
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={toggleMute2}
                                                className="text-white hover:text-primary-400 transition-colors duration-200"
                                                aria-label={isMuted2 ? 'Unmute video' : 'Mute video'}
                                            >
                                                {isMuted2 ? (
                                                    <FiVolumeX className="w-6 h-6 sm:w-8 sm:h-8" />
                                                ) : (
                                                    <FiVolume2 className="w-6 h-6 sm:w-8 sm:h-8" />
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Subtle shine effect */}
                                    <motion.div
                                        animate={{
                                            x: ['-100%', '200%'],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatDelay: 2,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                    />
                                </div>

                                {/* Floating Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-2xl shadow-2xl border border-primary-100"
                                >
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-gold flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                                            💎
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 text-sm sm:text-base">Premium Quality</div>
                                            <div className="text-xs sm:text-sm text-gray-600">Certified Authentic</div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 }}
                                    className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-2xl shadow-2xl border border-secondary-100"
                                >
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold gradient-text">50%</div>
                                        <div className="text-xs sm:text-sm text-gray-600 mt-1">Special Offer</div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Decorative Elements */}
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 30,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute top-1/4 -right-4 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 border-4 border-primary-300/40 rounded-full"
                            />
                            <motion.div
                                animate={{
                                    rotate: [360, 0],
                                    scale: [1, 1.15, 1],
                                }}
                                transition={{
                                    duration: 25,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute bottom-1/4 -left-4 sm:-left-8 w-20 h-20 sm:w-24 sm:h-24 border-4 border-secondary-300/40 rounded-full"
                            />

                            {/* Sparkle effects */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0.8, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute top-1/2 right-0 w-3 h-3 bg-primary-400 rounded-full blur-sm"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0.8, 0.3],
                                }}
                                transition={{
                                    duration: 2.5,
                                    delay: 0.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute top-1/3 left-0 w-2 h-2 bg-secondary-400 rounded-full blur-sm"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
// 