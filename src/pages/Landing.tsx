import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/FeatureCard';
import { TeamMemberCard } from '@/components/TeamMemberCard';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    BarChart3,
    Filter,
    Globe,
    TrendingUp,
    Shield,
    Moon,
    Sun
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Landing = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const features = [
        {
            icon: BarChart3,
            title: 'Visualisasi Data Interaktif',
            description: 'Tren kasus harian, distribusi regional, dan analisis demografis dengan chart interaktif yang mudah dipahami.'
        },
        {
            icon: Filter,
            title: 'Sistem Filter Canggih',
            description: 'Filter data berdasarkan rentang tanggal, wilayah WHO, dan time range selector untuk analisis yang lebih mendalam.'
        },
        {
            icon: TrendingUp,
            title: 'KPI Dashboard Real-time',
            description: 'Pantau total kasus, kematian, tingkat kesembuhan, dan CFR dengan trend analysis 7 hari terakhir.'
        },
        {
            icon: Globe,
            title: 'Data Global WHO',
            description: 'Akses data resmi dari 6 wilayah WHO mencakup 200+ negara dengan update real-time dari World Health Organization.'
        },
        {
            icon: Activity,
            title: 'Performa Optimal',
            description: 'IndexedDB caching untuk loading instant, memoization untuk optimasi, dan responsive design untuk semua device.'
        },
        {
            icon: Shield,
            title: 'Keamanan Data',
            description: 'Sistem autentikasi yang aman dengan enkripsi data dan perlindungan privasi pengguna yang terjamin.'
        }
    ];

    const teamMembers = [
        {
            nrp: '15-2022-044',
            name: 'Dimas Bratakusumah',
            role: 'Project Lead / Health Informatics Analyst'
        },
        {
            nrp: '15-2022-064',
            name: 'Muhammad Figo Razzan Fadillah',
            role: 'Application Developer / Data Engineer'
        },
        {
            nrp: '15-2022-150',
            name: 'Dian Raisa Gumilar',
            role: 'Data Analyst / Visualization Specialist'
        },
        {
            nrp: '15-2022-217',
            name: 'Mochamad Ramdhan',
            role: 'System Architect / Developer'
        },
        {
            nrp: '15-2022-250',
            name: 'R Jayani Maulana S',
            role: 'Public Health Data Specialist'
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold">Public Health Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-full"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button onClick={() => navigate('/register')}>
                            Register
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Activity className="w-4 h-4" />
                        <span>COVID-19 Global Monitoring Platform</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        Public Health Dashboard
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                        Platform monitoring dan analisis data COVID-19 global secara real-time dari World Health Organization (WHO)
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                        <Button size="lg" onClick={() => navigate('/register')} className="text-lg px-8">
                            Mulai Sekarang
                            <Activity className="w-5 h-5 ml-2" />
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="text-lg px-8">
                            Login ke Dashboard
                        </Button>
                    </div>

                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">500K+</div>
                            <div className="text-sm text-muted-foreground mt-1">Data Records</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">200+</div>
                            <div className="text-sm text-muted-foreground mt-1">Negara</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">6</div>
                            <div className="text-sm text-muted-foreground mt-1">Wilayah WHO</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">Real-time</div>
                            <div className="text-sm text-muted-foreground mt-1">Update Data</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Dashboard komprehensif dengan berbagai fitur untuk monitoring dan analisis data kesehatan masyarakat
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <FeatureCard {...feature} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tim Pengembang</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Mahasiswa Informatika ITENAS - Mata Kuliah FB-499 INFORMATIKA TERAPAN BB
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {teamMembers.map((member, index) => (
                            <div
                                key={member.nrp}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <TeamMemberCard {...member} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground">
                            <span className="font-semibold">Institut Teknologi Nasional (ITENAS) Bandung</span>
                            <br />
                            Tahun Akademik 2024/2025
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-12 text-primary-foreground">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Siap Memulai Monitoring Data COVID-19?
                        </h2>
                        <p className="text-lg mb-8 opacity-90">
                            Daftar sekarang dan akses dashboard analisis data kesehatan masyarakat secara real-time
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() => navigate('/register')}
                                className="text-lg px-8"
                            >
                                Daftar Gratis
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/login')}
                                className="text-lg px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                            >
                                Sudah Punya Akun?
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-8 px-4">
                <div className="container mx-auto text-center text-muted-foreground">
                    <p className="mb-2">
                        © 2024 Public Health Dashboard - Institut Teknologi Nasional Bandung
                    </p>
                    <p className="text-sm">
                        Data source: World Health Organization (WHO) COVID-19 Global Daily Data
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
