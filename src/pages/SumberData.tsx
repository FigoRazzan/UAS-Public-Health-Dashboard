import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ExternalLink, FileText, Globe, Calendar, CheckCircle2, Info, Shield, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SumberData() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-background to-muted/20 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-foreground">Sumber Data</h1>
                <p className="text-muted-foreground mt-1">
                  Informasi lengkap tentang dataset dan infrastruktur backend
                </p>
              </div>

              {/* Main Data Source */}
              <Card className="border-primary/50 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Globe className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">WHO COVID-19 Global Data</CardTitle>
                        <CardDescription className="mt-1">
                          Dataset resmi dari World Health Organization
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Aktif
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dataset Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Total Data Points</span>
                      </div>
                      <p className="text-2xl font-bold">500,000+</p>
                      <p className="text-xs text-muted-foreground mt-1">rows di Supabase</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Database className="h-4 w-4" />
                        <span className="text-sm">Backend</span>
                      </div>
                      <p className="text-2xl font-bold">Supabase</p>
                      <p className="text-xs text-muted-foreground mt-1">PostgreSQL database</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">Cakupan</span>
                      </div>
                      <p className="text-2xl font-bold">237</p>
                      <p className="text-xs text-muted-foreground mt-1">negara & wilayah</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Periode Data</span>
                      </div>
                      <p className="text-2xl font-bold">2020-2025</p>
                      <p className="text-xs text-muted-foreground mt-1">5+ tahun data</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Dataset Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      Tentang Dataset
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Dataset ini merupakan data global COVID-19 yang dipublikasikan secara resmi oleh
                        <span className="font-semibold text-foreground"> World Health Organization (WHO)</span>.
                        Data dikumpulkan dan diverifikasi dari laporan resmi negara-negara anggota WHO di seluruh dunia.
                      </p>
                      <p>
                        Data disimpan di <span className="font-semibold text-foreground">Supabase PostgreSQL database</span> dengan
                        Row Level Security (RLS) untuk keamanan data. Dashboard mengambil data real-time dari database
                        dengan query optimization dan caching untuk performa maksimal.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Data Structure */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Struktur Data (Tabel: covid_global_reports)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">date_reported</p>
                          <p className="text-xs text-muted-foreground">Tanggal laporan (DATE)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">country_code</p>
                          <p className="text-xs text-muted-foreground">Kode ISO negara (TEXT)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">country</p>
                          <p className="text-xs text-muted-foreground">Nama lengkap negara (TEXT)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">who_region</p>
                          <p className="text-xs text-muted-foreground">Wilayah WHO (TEXT)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">new_cases</p>
                          <p className="text-xs text-muted-foreground">Kasus baru harian (INTEGER)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">cumulative_cases</p>
                          <p className="text-xs text-muted-foreground">Total kumulatif (BIGINT)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">new_deaths</p>
                          <p className="text-xs text-muted-foreground">Kematian baru harian (INTEGER)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">cumulative_deaths</p>
                          <p className="text-xs text-muted-foreground">Total kematian (BIGINT)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Links */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default" className="gap-2" asChild>
                      <a href="https://covid19.who.int/data" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Kunjungi WHO COVID-19 Dashboard
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Infrastructure */}
              <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <CardHeader>
                  <CardTitle>Infrastruktur Backend</CardTitle>
                  <CardDescription>Teknologi dan arsitektur sistem</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        Database & Storage
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform</span>
                          <span className="font-medium">Supabase</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Database</span>
                          <span className="font-medium">PostgreSQL 15</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Query Limit</span>
                          <span className="font-medium">200,000 rows/query</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Response Time</span>
                          <span className="font-medium">~1-2 seconds</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Security & Access Control
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Authentication</span>
                          <span className="font-medium">Supabase Auth</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Row Level Security</span>
                          <span className="font-medium">Enabled</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Role-Based Access</span>
                          <span className="font-medium">Admin & Public</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Audit Logging</span>
                          <span className="font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Features */}
              <Card className="border-primary/30 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <CardTitle>Fitur Admin</CardTitle>
                  </div>
                  <CardDescription>Kemampuan khusus untuk administrator</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">CSV Data Upload</p>
                        <p className="text-xs text-muted-foreground">
                          Admin dapat mengupload data COVID-19 baru melalui file CSV dengan validasi otomatis
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Audit Logs</p>
                        <p className="text-xs text-muted-foreground">
                          Semua aktivitas admin tercatat dengan timestamp, user, dan detail lengkap
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Batch Processing</p>
                        <p className="text-xs text-muted-foreground">
                          Upload data dalam batch 1000 rows untuk performa optimal
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Quality */}
              <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
                <CardHeader>
                  <CardTitle>Kualitas & Validasi Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <span className="font-semibold">Verified Source</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Data bersumber dari organisasi kesehatan resmi (WHO)
                      </p>
                    </div>
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <span className="font-semibold">Real-time Access</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Data diambil langsung dari database tanpa delay
                      </p>
                    </div>
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <span className="font-semibold">Standardized Format</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Format data konsisten dan terstandarisasi global
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer Note */}
              <div className="text-center text-sm text-muted-foreground py-4 animate-in fade-in duration-500 delay-[500ms]">
                <p>
                  Dashboard ini menggunakan <span className="font-semibold">Supabase</span> sebagai backend
                  dengan <span className="font-semibold">Row Level Security</span> untuk keamanan data
                </p>
                <p className="mt-1">
                  Data WHO untuk tujuan edukasi dan analisis kesehatan masyarakat
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
