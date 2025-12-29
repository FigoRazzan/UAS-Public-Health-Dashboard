import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, Loader2, Moon, Sun, Check, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const registerSchema = z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter'),
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

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            await registerUser(data.name, data.email, data.password);
            navigate('/dashboard', { replace: true });
        } catch (error) {
            // Error is handled in AuthContext with toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/5">
            {/* Theme Toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="absolute top-4 right-4 rounded-full"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
                        <Activity className="w-8 h-8 text-primary" />
                        <span>Public Health Dashboard</span>
                    </Link>
                    <p className="text-muted-foreground mt-2">
                        Monitoring COVID-19 Global Data
                    </p>
                </div>

                <Card className="border-2">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Daftar Akun</CardTitle>
                        <CardDescription>
                            Buat akun baru untuk mengakses dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    {...register('name')}
                                    disabled={isLoading}
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@example.com"
                                    {...register('email')}
                                    disabled={isLoading}
                                    className={errors.email ? 'border-destructive' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                    disabled={isLoading}
                                    className={errors.password ? 'border-destructive' : ''}
                                />

                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                                        <p className="text-xs font-medium text-muted-foreground">Kekuatan Password:</p>
                                        <div className="space-y-1">
                                            <PasswordCheck
                                                label="Minimal 8 karakter"
                                                checked={passwordChecks.length}
                                            />
                                            <PasswordCheck
                                                label="Huruf besar (A-Z)"
                                                checked={passwordChecks.uppercase}
                                            />
                                            <PasswordCheck
                                                label="Huruf kecil (a-z)"
                                                checked={passwordChecks.lowercase}
                                            />
                                            <PasswordCheck
                                                label="Angka (0-9)"
                                                checked={passwordChecks.number}
                                            />
                                        </div>
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('confirmPassword')}
                                    disabled={isLoading}
                                    className={errors.confirmPassword ? 'border-destructive' : ''}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="acceptTerms"
                                    checked={acceptTerms}
                                    onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
                                    disabled={isLoading}
                                    className="mt-1"
                                />
                                <Label
                                    htmlFor="acceptTerms"
                                    className="text-sm font-normal cursor-pointer leading-relaxed"
                                >
                                    Saya menyetujui{' '}
                                    <Link to="/terms" className="text-primary hover:underline">
                                        syarat dan ketentuan
                                    </Link>{' '}
                                    serta{' '}
                                    <Link to="/privacy" className="text-primary hover:underline">
                                        kebijakan privasi
                                    </Link>
                                </Label>
                            </div>
                            {errors.acceptTerms && (
                                <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    'Daftar Sekarang'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-sm text-center text-muted-foreground">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Login di sini
                            </Link>
                        </div>
                        <div className="text-sm text-center text-muted-foreground">
                            <Link to="/" className="hover:underline">
                                ← Kembali ke halaman utama
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

// Password Check Component
const PasswordCheck = ({ label, checked }: { label: string; checked: boolean }) => (
    <div className="flex items-center gap-2">
        {checked ? (
            <Check className="w-4 h-4 text-success" />
        ) : (
            <X className="w-4 h-4 text-muted-foreground" />
        )}
        <span className={`text-xs ${checked ? 'text-success' : 'text-muted-foreground'}`}>
            {label}
        </span>
    </div>
);

export default Register;
