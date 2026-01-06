import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import AboutSection from '@/components/home/AboutSection';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import MainLayout from '@/components/layout/MainLayout';

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'ur' }, { locale: 'ar' }];
}

export default function HomePage() {
    return (
        <MainLayout>
            <Hero />
            <FeaturedProducts />
            <Categories />
            <AboutSection />
            <Testimonials />
            <Newsletter />
        </MainLayout>
    );
}
