import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Palette, Moon, Sun, Shield, Mail } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function Pengaturan() {
  const { theme, setTheme } = useTheme();
  const { user, profile, isAdmin } = useAuth();
  const isDark = theme === "dark";

  const [fullName, setFullName] = useState(profile?.full_name || user?.name || "");
  const [agency, setAgency] = useState(profile?.agency || "");

  const handleSaveProfile = () => {
    // TODO: Implement profile update to Supabase
    toast.success("Profil berhasil diperbarui!", {
      description: "Perubahan Anda telah disimpan",
    });
  };

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
                  Kelola preferensi dan informasi akun Anda
                </p>
              </div>

              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile" className="gap-2">
                    <User className="h-4 w-4" />
                    Profil
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="gap-2">
                    <Palette className="h-4 w-4" />
                    Tampilan
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Informasi Profil</CardTitle>
                          <CardDescription>Data akun Anda yang terdaftar di sistem</CardDescription>
                        </div>
                        {isAdmin && (
                          <Badge variant="default" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={profile?.username || ""}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Username tidak dapat diubah</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </div>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Email dikelola oleh Supabase Auth</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                          id="name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={profile?.role ? (profile.role === 'admin' ? 'Administrator' : 'Public User') : 'Loading...'}
                          disabled
                          className="bg-muted font-medium"
                        />
                        <p className="text-xs text-muted-foreground">
                          {isAdmin ? '✅ Anda memiliki akses penuh sebagai administrator' : 'Role dikelola oleh administrator'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="agency">Instansi/Organisasi</Label>
                        <Input
                          id="agency"
                          value={agency}
                          onChange={(e) => setAgency(e.target.value)}
                          placeholder="Contoh: Dinas Kesehatan Kota"
                        />
                      </div>

                      <Button onClick={handleSaveProfile}>
                        Simpan Perubahan
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Account Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Informasi Akun</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">User ID</span>
                          <span className="font-mono text-xs">{user?.id?.substring(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Tipe Akun</span>
                          <span className="font-medium capitalize">{profile?.role || "Public"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Terdaftar Sejak</span>
                          <span className="font-medium">
                            {profile?.created_at
                              ? new Date(profile.created_at).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })
                              : '-'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Authentication</span>
                          <span className="font-medium">Supabase Auth</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferensi Tampilan</CardTitle>
                      <CardDescription>Sesuaikan tampilan dashboard sesuai preferensi Anda</CardDescription>
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
                          onCheckedChange={(checked) => {
                            setTheme(checked ? "dark" : "light");
                            toast.success(
                              checked ? "Mode gelap diaktifkan" : "Mode terang diaktifkan",
                              { description: "Tema berhasil diubah" }
                            );
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Theme Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Informasi Tema</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Tema Aktif</span>
                          <span className="font-medium capitalize">{theme}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Penyimpanan</span>
                          <span className="font-medium">LocalStorage</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Auto-sync</span>
                          <span className="font-medium">Aktif</span>
                        </div>
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
