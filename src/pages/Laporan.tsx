import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Laporan() {
  const reports = [
    {
      title: "Laporan Mingguan COVID-19",
      date: "01-07 Nov 2025",
      status: "Tersedia",
      type: "Mingguan"
    },
    {
      title: "Laporan Bulanan Oktober 2025",
      date: "Oktober 2025",
      status: "Tersedia",
      type: "Bulanan"
    },
    {
      title: "Analisis Tren Regional Q4 2025",
      date: "Q4 2025",
      status: "Tersedia",
      type: "Kuartalan"
    },
    {
      title: "Laporan Tahunan 2024",
      date: "2024",
      status: "Tersedia",
      type: "Tahunan"
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Laporan & Analisis</h1>
                <p className="text-muted-foreground mt-1">
                  Akses laporan berkala dan analisis mendalam tentang data wabah
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-sm text-muted-foreground">Total Laporan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-success/10 text-success">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">4</p>
                        <p className="text-sm text-muted-foreground">Laporan Bulan Ini</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-warning/10 text-warning">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Analisis Tren</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-danger/10 text-danger">
                        <Download className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">156</p>
                        <p className="text-sm text-muted-foreground">Total Download</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Laporan Tersedia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.map((report, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{report.title}</h3>
                            <p className="text-sm text-muted-foreground">{report.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{report.type}</Badge>
                          <Badge variant="secondary">{report.status}</Badge>
                          <Button size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Generate Laporan Custom</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1">
                      Pilih Rentang Tanggal
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Pilih Negara/Wilayah
                    </Button>
                    <Button className="gap-2">
                      <FileText className="h-4 w-4" />
                      Generate Laporan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
