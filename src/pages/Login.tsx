import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, Loader2, Eye, EyeOff, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const loginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const rememberMe = watch('rememberMe');

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            await login(data.email, data.password, data.rememberMe);
            navigate(from, { replace: true });
        } catch (error) {
            // Error is handled in AuthContext with toast
        } finally {
            setIsLoading(false);
        }
    };

    // Dynamic gradient colors based on theme
    const gradientClass = theme === 'dark'
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900';

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30 relative">
            {/* Back Button */}
            <Link
                to="/"
                className="absolute top-4 left-4 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Back to Home</span>
            </Link>

            {/* Theme Toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="absolute top-4 right-4 rounded-full"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Main Card */}
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl bg-card flex flex-col md:flex-row">
                {/* Left Side - Gradient (slides in) */}
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`w-full md:w-1/2 ${gradientClass} p-12 flex flex-col justify-center items-center text-white relative overflow-hidden`}
                >
                    {/* Animated Blur Orbs */}
                    <motion.div
                        className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 20, 0],
                            y: [0, 20, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            x: [0, -20, 0],
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="relative z-10 text-center"
                    >
                        <h2 className="text-4xl font-bold mb-4">Welcome</h2>
                        <p className="text-white/80 mb-8">
                            Join Our Unique Platform, Explore a New Experience
                        </p>
                        <Link to="/register">
                            <Button
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 rounded-full px-8 bg-transparent"
                            >
                                REGISTER
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-12 bg-card">
                    <div className="max-w-sm mx-auto">
                        {/* Logo */}
                        <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold mb-8">
                            <Activity className="w-7 h-7 text-primary" />
                            <span>Health Monitor</span>
                        </Link>

                        <h1 className="text-3xl font-bold mb-2 text-primary">Sign In</h1>
                        <p className="text-muted-foreground text-sm mb-8">Welcome back to the community</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register('email')}
                                    disabled={isLoading}
                                    className="bg-muted/50 border-muted"
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        {...register('password')}
                                        disabled={isLoading}
                                        className="bg-muted/50 border-muted pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setValue('rememberMe', checked as boolean)}
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="rememberMe" className="text-xs cursor-pointer font-normal">
                                        Remember me
                                    </Label>
                                </div>
                                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-full h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    'LOGIN'
                                )}
                            </Button>

                            <div className="text-center text-xs text-muted-foreground">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-primary font-semibold hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
