import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Palette, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Pengaturan() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
                <p className="text-muted-foreground mt-1">
                  Kelola preferensi dan konfigurasi dashboard Anda
                </p>
              </div>

              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile" className="gap-2">
                    <User className="h-4 w-4" />
                    Profil
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="gap-2">
                    <Bell className="h-4 w-4" />
                    Notifikasi
                  </TabsTrigger>
                  <TabsTrigger value="security" className="gap-2">
                    <Shield className="h-4 w-4" />
                    Keamanan
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="gap-2">
                    <Palette className="h-4 w-4" />
                    Tampilan
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informasi Profil</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input id="name" defaultValue="Public Health Analyst" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="analyst@health.gov" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Peran</Label>
                        <Input id="role" defaultValue="Data Analyst" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organisasi</Label>
                        <Input id="organization" defaultValue="Ministry of Health" />
                      </div>
                      <Button>Simpan Perubahan</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferensi Notifikasi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notifikasi Email</p>
                          <p className="text-sm text-muted-foreground">
                            Terima pembaruan via email
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Alert Kasus Tinggi</p>
                          <p className="text-sm text-muted-foreground">
                            Notifikasi saat kasus meningkat drastis
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Laporan Mingguan</p>
                          <p className="text-sm text-muted-foreground">
                            Terima ringkasan mingguan otomatis
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Update Data Source</p>
                          <p className="text-sm text-muted-foreground">
                            Notifikasi saat ada update dari sumber data
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Keamanan Akun</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Password Saat Ini</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Password Baru</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button>Update Password</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Aktifkan 2FA</p>
                          <p className="text-sm text-muted-foreground">
                            Tingkatkan keamanan akun dengan verifikasi dua faktor
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferensi Tampilan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {isDark ? (
                              <Moon className="h-4 w-4 text-primary" />
                            ) : (
                              <Sun className="h-4 w-4 text-primary" />
                            )}
                            <p className="font-medium">Mode Gelap</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Aktifkan tema gelap untuk mengurangi kelelahan mata
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Status: <span className="font-medium">{isDark ? "Mode Gelap Aktif" : "Mode Terang Aktif"}</span>
                          </p>
                        </div>
                        <Switch 
                          checked={isDark}
                          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Sidebar Compact</p>
                          <p className="text-sm text-muted-foreground">
                            Gunakan sidebar dengan lebar minimal
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Animasi</p>
                          <p className="text-sm text-muted-foreground">
                            Aktifkan animasi transisi pada UI
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
