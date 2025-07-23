import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  role: string[];
  accessToken: string;
  refreshToken: string;
  userId: number;
  userName: string;
  userMail: string;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (authData: Omit<AuthState, 'isAuthenticated'>) => void;
  logout: () => void;
  updateUser: (userData: Partial<Pick<AuthState, 'userName' | 'userMail' | 'role'>>) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  role: [],
  accessToken: "",
  refreshToken: "",
  userId: 0,
  userName: "",
  userMail: "",
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      login: (authData) => {
        set({
          ...authData,
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        set({
          ...initialState,
          isAuthenticated: false,
        });
      },
      
      updateUser: (userData) => {
        set((state) => ({
          ...state,
          ...userData,
        }));
      },
    }),
    {
      name: 'access-storage', // name of the item in localStorage (same as before)
      storage: createJSONStorage(() => localStorage),
      // Only persist the auth state, not the actions
      partialize: (state) => ({
        role: state.role,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
        userName: state.userName,
        userMail: state.userMail,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for easy access
export const useAuth = () => useAuthStore((state) => ({
  role: state.role,
  accessToken: state.accessToken,
  refreshToken: state.refreshToken,
  userId: state.userId,
  userName: state.userName,
  userMail: state.userMail,
  isAuthenticated: state.isAuthenticated,
}));

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  updateUser: state.updateUser,
}));
