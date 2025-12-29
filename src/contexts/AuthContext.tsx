import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth.types';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth_user';
const REMEMBER_ME_KEY = 'auth_remember_me';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
                const storedUser = rememberMe
                    ? localStorage.getItem(AUTH_STORAGE_KEY)
                    : sessionStorage.getItem(AUTH_STORAGE_KEY);

                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string, rememberMe = false) => {
        try {
            setLoading(true);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // In a real app, this would be an API call
            // For now, we'll check if user exists in localStorage (from registration)
            const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
            const foundUser = users.find((u: User & { password: string }) =>
                u.email === email && u.password === password
            );

            if (!foundUser) {
                throw new Error('Email atau password salah');
            }

            const userData: User = {
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
                createdAt: foundUser.createdAt,
            };

            setUser(userData);

            // Store user data
            const userJson = JSON.stringify(userData);
            if (rememberMe) {
                localStorage.setItem(AUTH_STORAGE_KEY, userJson);
                localStorage.setItem(REMEMBER_ME_KEY, 'true');
            } else {
                sessionStorage.setItem(AUTH_STORAGE_KEY, userJson);
                localStorage.setItem(REMEMBER_ME_KEY, 'false');
            }

            toast.success('Login berhasil!', {
                description: `Selamat datang kembali, ${userData.name}!`,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login gagal';
            toast.error('Login Gagal', {
                description: message,
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setLoading(true);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
            const existingUser = users.find((u: User & { password: string }) => u.email === email);

            if (existingUser) {
                throw new Error('Email sudah terdaftar');
            }

            // Create new user
            const newUser: User & { password: string } = {
                id: crypto.randomUUID(),
                name,
                email,
                password, // In real app, this would be hashed on backend
                createdAt: new Date().toISOString(),
            };

            // Save to "database" (localStorage)
            users.push(newUser);
            localStorage.setItem('registered_users', JSON.stringify(users));

            // Auto-login after registration
            const userData: User = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                createdAt: newUser.createdAt,
            };

            setUser(userData);
            sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));

            toast.success('Registrasi berhasil!', {
                description: `Selamat datang, ${userData.name}!`,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registrasi gagal';
            toast.error('Registrasi Gagal', {
                description: message,
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(REMEMBER_ME_KEY);
        toast.info('Logout berhasil', {
            description: 'Sampai jumpa lagi!',
        });
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
