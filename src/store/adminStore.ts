import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}

interface AdminStore {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (admin: Admin, token: string) => void;
  logout: () => void;
  updateAdmin: (admin: Admin) => void;
}

// Custom cookie storage
const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    // Set cookie with 7 days expiry, secure and sameSite
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    document.cookie = `${name}=; max-age=0; path=/`;
  },
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      login: (admin, token) => {
        set({ admin, token, isAuthenticated: true });
        // Store token separately in cookie for API calls
        if (typeof window !== 'undefined') {
          const maxAge = 7 * 24 * 60 * 60;
          document.cookie = `adminToken=${encodeURIComponent(token)}; max-age=${maxAge}; path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
        }
      },

      logout: () => {
        set({ admin: null, token: null, isAuthenticated: false });
        // Clear both cookies
        if (typeof window !== 'undefined') {
          document.cookie = 'adminToken=; max-age=0; path=/';
          document.cookie = 'admin-storage=; max-age=0; path=/';
        }
      },

      updateAdmin: (admin) => {
        set({ admin });
      },
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
