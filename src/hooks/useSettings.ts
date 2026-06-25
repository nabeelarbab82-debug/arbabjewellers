'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export interface Settings {
    siteName: string;
    logo: string;
    favicon: string;
    currency: string;
    shippingFee: number;
    taxRate: number;
    contactInfo: {
        email: string;
        phone1: string;
        phone2: string;
        phone3: string;
        address1: string;
        address2: string;
        googleMapsUrl: string;
    };
    socialMedia: {
        facebook: {
            url: string;
            visible: boolean;
        };
        instagram: {
            url: string;
            visible: boolean;
        };
        youtube: {
            url: string;
            visible: boolean;
        };
        tiktok: {
            url: string;
            visible: boolean;
        };
    };
    emailConfig: {
        service: string;
        host: string;
        port: number;
        secure: boolean;
        user: string;
        pass: string;
        from: string;
    };
}

const defaultSettings: Settings = {
    siteName: 'Arbab Jewellers',
    logo: '',
    favicon: '',
    currency: 'PKR',
    shippingFee: 0,
    taxRate: 0,
    contactInfo: {
        email: 'arbabjewellersofficial@gmail.com',
        phone1: '0333-5861171',
        phone2: '0332-3026222',
        phone3: '051-6102658',
        address1: 'Shop No.13-A Opposite Arena Cinema, Phase 4 Bahria Heights 3, Bahria Town Rawalpindi',
        address2: 'Shop#75, Lalkurti, Rawalpindi Cantt',
        googleMapsUrl: 'https://share.google/pn1nYXFUmMZ8dbYo7',
    },
    socialMedia: {
        facebook: {
            url: 'https://web.facebook.com/profile.php?id=61585786391480',
            visible: true,
        },
        instagram: {
            url: 'https://www.instagram.com/arbab_jeweller/',
            visible: true,
        },
        youtube: {
            url: 'https://www.youtube.com/channel/UCeLpWAiVC4olmFe0_UiJ_fQ',
            visible: true,
        },
        tiktok: {
            url: 'https://www.tiktok.com/@arbab_jeweller?lang=en',
            visible: true,
        },
    },
    emailConfig: {
        service: 'gmail',
        host: '',
        port: 587,
        secure: false,
        user: '',
        pass: '',
        from: '',
    },
};

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings/public');
                setSettings(response.data.settings);
            } catch (error) {
                console.error('Failed to fetch settings, using defaults:', error);
                setSettings(defaultSettings);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, loading };
}
