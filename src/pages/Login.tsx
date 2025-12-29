import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, Loader2, Moon, Sun } from 'lucide-react';
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
                        <CardTitle className="text-2xl font-bold">Login</CardTitle>
                        <CardDescription>
                            Masukkan email dan password untuk mengakses dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Lupa password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                    disabled={isLoading}
                                    className={errors.password ? 'border-destructive' : ''}
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setValue('rememberMe', checked as boolean)}
                                    disabled={isLoading}
                                />
                                <Label
                                    htmlFor="rememberMe"
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    Ingat saya
                                </Label>
                            </div>

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
                                    'Login'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-sm text-center text-muted-foreground">
                            Belum punya akun?{' '}
                            <Link to="/register" className="text-primary hover:underline font-medium">
                                Daftar sekarang
                            </Link>
                        </div>
                        <div className="text-sm text-center text-muted-foreground">
                            <Link to="/" className="hover:underline">
                                ← Kembali ke halaman utama
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                {/* Demo Credentials Info */}
                <Card className="mt-4 border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground text-center">
                            <span className="font-semibold text-foreground">Demo:</span> Daftar akun baru atau gunakan akun yang sudah terdaftar
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
