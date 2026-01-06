import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      login: (admin, token) => {
        set({ admin, token, isAuthenticated: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminToken', token);
        }
      },

      logout: () => {
        set({ admin: null, token: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminToken');
        }
      },

      updateAdmin: (admin) => {
        set({ admin });
      },
    }),
    {
      name: 'admin-storage',
    }
  )
);
