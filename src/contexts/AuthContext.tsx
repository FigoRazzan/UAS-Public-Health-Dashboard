import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database.types';
import { toast } from 'sonner';

interface User {
    id: string;
    email: string;
    name: string;
    role?: 'admin' | 'public';
    agency?: string | null;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    register: (name: string, username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check session on mount
    useEffect(() => {
        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                await loadUserProfile(session.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const checkUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await loadUserProfile(session.user);
            }
        } catch (error) {
            console.error('Error checking user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadUserProfile = async (supabaseUser: SupabaseUser) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single<Profile>();

            if (error) throw error;

            if (profile) {
                setUser({
                    id: supabaseUser.id,
                    email: supabaseUser.email || '',
                    name: profile.full_name || supabaseUser.email || 'User',
                    role: profile.role as 'admin' | 'public',
                    agency: profile.agency,
                });
            } else {
                // No profile found, use basic user info
                setUser({
                    id: supabaseUser.id,
                    email: supabaseUser.email || '',
                    name: supabaseUser.email || 'User',
                    role: 'public',
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            // Fallback to basic user info
            setUser({
                id: supabaseUser.id,
                email: supabaseUser.email || '',
                name: supabaseUser.email || 'User',
                role: 'public',
            });
        }
    };

    const login = async (emailOrUsername: string, password: string, rememberMe?: boolean) => {
        try {
            let email = emailOrUsername;

            // Detect if input is username (no @ symbol) or email
            if (!emailOrUsername.includes('@')) {
                // Input is username, get email from profiles table
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('username', emailOrUsername)
                    .single<{ email: string }>();

                if (profileError || !profile || !profile.email) {
                    toast.error('Username tidak ditemukan');
                    throw new Error('Username not found');
                }

                email = profile.email;
            }

            // Now login with email
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                await loadUserProfile(data.user);
                toast.success('Login berhasil!');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            if (!error.message.includes('Username')) {
                toast.error(error.message || 'Login gagal. Periksa email/username dan password Anda.');
            }
            throw error;
        }
    };

    const register = async (name: string, username: string, email: string, password: string) => {
        try {
            // Sign up user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        username: username,
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                // Profile will be created automatically by trigger
                // Wait a bit for trigger to complete
                await new Promise(resolve => setTimeout(resolve, 1000));

                await loadUserProfile(data.user);
                toast.success('Registrasi berhasil! Selamat datang!');
            }
        } catch (error: any) {
            console.error('Register error:', error);
            toast.error(error.message || 'Registrasi gagal. Coba lagi.');
            throw error;
        }
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUser(null);
            toast.success('Logout berhasil!');
        } catch (error: any) {
            console.error('Logout error:', error);
            toast.error('Logout gagal. Coba lagi.');
            throw error;
        }
    };

    const value = {
        user,
        isLoading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
