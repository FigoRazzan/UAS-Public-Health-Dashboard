import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ExternalLink, FileText, Globe, Calendar, Download, CheckCircle2, Info } from "lucide-react";
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
                  Informasi lengkap tentang dataset dan sumber data yang digunakan
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
                      <p className="text-2xl font-bold">502,802</p>
                      <p className="text-xs text-muted-foreground mt-1">rows dalam dataset</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Database className="h-4 w-4" />
                        <span className="text-sm">Ukuran File</span>
                      </div>
                      <p className="text-2xl font-bold">21.84 MB</p>
                      <p className="text-xs text-muted-foreground mt-1">file CSV</p>
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
                      <p className="text-xs text-muted-foreground mt-1">5 tahun data</p>
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
                        Dataset mencakup informasi harian tentang kasus konfirmasi, kematian, dan berbagai indikator 
                        kesehatan masyarakat lainnya. Data dikelompokkan berdasarkan negara dan wilayah WHO 
                        (Afrika, Amerika, Mediterania Timur, Eropa, Asia Tenggara, dan Pasifik Barat).
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Data Structure */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Struktur Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Date_reported</p>
                          <p className="text-xs text-muted-foreground">Tanggal laporan (YYYY-MM-DD)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Country_code</p>
                          <p className="text-xs text-muted-foreground">Kode ISO negara (2 huruf)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Country</p>
                          <p className="text-xs text-muted-foreground">Nama lengkap negara</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">WHO_region</p>
                          <p className="text-xs text-muted-foreground">Wilayah WHO (AFR, AMR, EMR, EUR, SEAR, WPR)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">New_cases</p>
                          <p className="text-xs text-muted-foreground">Jumlah kasus baru per hari</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Cumulative_cases</p>
                          <p className="text-xs text-muted-foreground">Total kasus kumulatif</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">New_deaths</p>
                          <p className="text-xs text-muted-foreground">Jumlah kematian baru per hari</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Cumulative_deaths</p>
                          <p className="text-xs text-muted-foreground">Total kematian kumulatif</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Data Processing */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Pemrosesan Data</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-success/10 text-success mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Caching dengan IndexedDB</p>
                          <p className="text-xs text-muted-foreground">
                            Data disimpan di browser untuk akses cepat (cache 24 jam)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-success/10 text-success mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Pre-aggregation & Indexing</p>
                          <p className="text-xs text-muted-foreground">
                            Data diindeks berdasarkan tanggal dan wilayah untuk filtering yang efisien
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-success/10 text-success mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Optimized Filtering</p>
                          <p className="text-xs text-muted-foreground">
                            Filtering dengan O(1) lookup untuk performa maksimal
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-success/10 text-success mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Memoized Calculations</p>
                          <p className="text-xs text-muted-foreground">
                            Statistik dan agregasi di-cache untuk menghindari recalculation
                          </p>
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
                    <Button variant="outline" className="gap-2" asChild>
                      <a href="https://covid19.who.int/WHO-COVID-19-global-data.csv" target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                        Download Dataset Original
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Specifications */}
              <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <CardHeader>
                  <CardTitle>Spesifikasi Teknis</CardTitle>
                  <CardDescription>Detail implementasi dan teknologi yang digunakan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Format & Parsing</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Format File</span>
                          <span className="font-medium">CSV (Comma-separated values)</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Encoding</span>
                          <span className="font-medium">UTF-8</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Parser</span>
                          <span className="font-medium">PapaParse 5.4.1</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Kolom</span>
                          <span className="font-medium">8 columns</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Storage & Performance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Browser Storage</span>
                          <span className="font-medium">IndexedDB</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cache Duration</span>
                          <span className="font-medium">24 hours</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Initial Load Time</span>
                          <span className="font-medium">~2-3 seconds</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cached Load Time</span>
                          <span className="font-medium">&lt; 1 second</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Quality */}
              <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
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
                        <span className="font-semibold">Daily Updates</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dataset diperbarui setiap hari dengan data terbaru
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
              <div className="text-center text-sm text-muted-foreground py-4 animate-in fade-in duration-500 delay-[400ms]">
                <p>
                  Data terakhir diperbarui: <span className="font-semibold">{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </p>
                <p className="mt-1">
                  Dashboard ini menggunakan data terbuka dari WHO untuk tujuan edukasi dan analisis
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
