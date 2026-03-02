import { create } from 'zustand';

export type UserRole = 'USER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  passwordChangedAt?: string;
  passwordResetExpires?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  setAuth: (user: IUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setAuth: (user, token) => {
    localStorage.setItem('accessToken', token);
    set({ user: null, accessToken: null });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null });
  },
}));