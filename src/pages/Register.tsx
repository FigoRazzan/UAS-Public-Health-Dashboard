import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, Loader2, Check, X, Eye, EyeOff, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const registerSchema = z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    username: z.string()
        .min(3, 'Username minimal 3 karakter')
        .max(20, 'Username maksimal 20 karakter')
        .regex(/^[a-z0-9_]+$/, 'Username hanya boleh huruf kecil, angka, dan underscore'),
    email: z.string().email('Email tidak valid'),
    password: z.string()
        .min(8, 'Password minimal 8 karakter')
        .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
        .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
        .regex(/[0-9]/, 'Password harus mengandung angka'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: 'Anda harus menyetujui syarat dan ketentuan',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
    });

    const password = watch('password');
    const acceptTerms = watch('acceptTerms');

    // Password strength indicators
    const passwordChecks = {
        length: password?.length >= 8,
        uppercase: /[A-Z]/.test(password || ''),
        lowercase: /[a-z]/.test(password || ''),
        number: /[0-9]/.test(password || ''),
    };

    const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;
    const strengthPercentage = (passwordStrength / 4) * 100;

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            await registerUser(data.name, data.username, data.email, data.password);
            navigate('/dashboard', { replace: true });
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
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl bg-card flex flex-col md:flex-row-reverse">
                {/* Right Side - Gradient (swaps to LEFT on exit) */}
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className={`w-full md:w-1/2 ${gradientClass} p-12 flex flex-col justify-center items-center text-white relative overflow-hidden`}
                >
                    {/* Animated Blur Orbs */}
                    <motion.div
                        className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, -20, 0],
                            y: [0, 20, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            x: [0, 20, 0],
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
                        <h2 className="text-4xl font-bold mb-4">Hello, Again</h2>
                        <p className="text-white/80 mb-8">
                            We are happy to see you back
                        </p>
                        <Link to="/login">
                            <Button
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 rounded-full px-8 bg-transparent"
                            >
                                LOGIN
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Left Side - Form (swaps to RIGHT on exit) */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="w-full md:w-1/2 p-12 bg-card max-h-[90vh] overflow-y-auto"
                >
                    <div className="max-w-sm mx-auto">
                        {/* Logo */}
                        <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold mb-6">
                            <Activity className="w-7 h-7 text-primary" />
                            <span>Health Monitor</span>
                        </Link>

                        <h1 className="text-3xl font-bold mb-2 text-primary">Create Account</h1>
                        <p className="text-muted-foreground text-sm mb-6">Join us today</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    {...register('name')}
                                    disabled={isLoading}
                                    className="bg-muted/50 border-muted"
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Choose a username"
                                    {...register('username')}
                                    disabled={isLoading}
                                    className="bg-muted/50 border-muted"
                                />
                                {errors.username && (
                                    <p className="text-xs text-destructive">{errors.username.message}</p>
                                )}
                            </div>

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
                                        placeholder="Create a password"
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

                                {/* Password Strength Indicator */}
                                <AnimatePresence>
                                    {password && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-1 pt-1"
                                        >
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`h-1 flex-1 rounded-full transition-all ${passwordStrength >= level
                                                            ? strengthPercentage === 100
                                                                ? 'bg-success'
                                                                : strengthPercentage >= 75
                                                                    ? 'bg-primary'
                                                                    : strengthPercentage >= 50
                                                                        ? 'bg-warning'
                                                                        : 'bg-destructive'
                                                            : 'bg-muted'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-2 gap-1 text-[10px]">
                                                <PasswordCheck label="8+ chars" checked={passwordChecks.length} />
                                                <PasswordCheck label="Uppercase" checked={passwordChecks.uppercase} />
                                                <PasswordCheck label="Lowercase" checked={passwordChecks.lowercase} />
                                                <PasswordCheck label="Number" checked={passwordChecks.number} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {errors.password && (
                                    <p className="text-xs text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Re-enter password"
                                        {...register('confirmPassword')}
                                        disabled={isLoading}
                                        className="bg-muted/50 border-muted pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="flex items-start space-x-2 pt-1">
                                <Checkbox
                                    id="acceptTerms"
                                    checked={acceptTerms}
                                    onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
                                    disabled={isLoading}
                                    className="mt-1"
                                />
                                <Label htmlFor="acceptTerms" className="text-xs cursor-pointer leading-relaxed font-normal">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-primary hover:underline">
                                        Terms & Conditions
                                    </Link>
                                </Label>
                            </div>
                            {errors.acceptTerms && (
                                <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full rounded-full h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'REGISTER'
                                )}
                            </Button>

                            <div className="text-center text-xs text-muted-foreground">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary font-semibold hover:underline">
                                    Log in
                                </Link>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Password Check Component
const PasswordCheck = ({ label, checked }: { label: string; checked: boolean }) => (
    <div className="flex items-center gap-1">
        {checked ? (
            <Check className="w-2.5 h-2.5 text-success" />
        ) : (
            <X className="w-2.5 h-2.5 text-muted-foreground" />
        )}
        <span className={`${checked ? 'text-success' : 'text-muted-foreground'}`}>
            {label}
        </span>
    </div>
);

export default Register;
