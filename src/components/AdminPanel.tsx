import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { uploadCSVData, createAuditLog } from '@/services/adminService';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

export function AdminPanel() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                toast.error('Format file tidak valid', {
                    description: 'Harap upload file CSV (.csv)',
                });
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file || !user) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            setUploadProgress(10); // Starting

            // Upload CSV data
            console.log('📤 Uploading CSV...');
            const result = await uploadCSVData(file);
            console.log('✅ CSV uploaded:', result);

            setUploadProgress(70); // Upload complete

            // Create audit log (non-blocking)
            try {
                console.log('📝 Creating audit log...');
                await createAuditLog({
                    admin_id: user.id,
                    action: 'UPLOAD_CSV',
                    details: {
                        filename: file.name,
                        rows_inserted: result.count,
                        timestamp: new Date().toISOString(),
                    },
                });
                console.log('✅ Audit log created');
            } catch (auditError: any) {
                console.warn('⚠️ Audit log failed (non-critical):', auditError.message);
                // Don't block on audit log failure
            }

            setUploadProgress(100); // Complete

            toast.success('Upload berhasil!', {
                description: `${result.count} baris data berhasil diimport`,
            });

            // Close modal after short delay
            setTimeout(() => {
                setIsOpen(false);
                setFile(null);
                setUploadProgress(0);
            }, 1000);

        } catch (error: any) {
            console.error('❌ Upload failed:', error);
            toast.error('Upload gagal', {
                description: error.message || 'Terjadi kesalahan saat mengupload file',
            });
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <FileSpreadsheet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Panel Admin</CardTitle>
                        <CardDescription>Kelola data COVID-19</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-medium">Fitur khusus admin</p>
                        <p className="text-xs mt-1">Upload file CSV untuk memperbarui data dashboard</p>
                    </div>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                            <Upload className="mr-2 h-4 w-4" />
                            Import Data CSV
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload File CSV</DialogTitle>
                            <DialogDescription>
                                Pilih file CSV untuk diimport ke database. File harus memiliki format yang sesuai dengan tabel covid_global_reports.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="csv-file">File CSV</Label>
                                <Input
                                    id="csv-file"
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                                {file && (
                                    <p className="text-sm text-muted-foreground">
                                        File terpilih: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                    </p>
                                )}
                            </div>

                            {isUploading && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <Progress value={uploadProgress} />
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsOpen(false)}
                                    disabled={isUploading}
                                >
                                    Batal
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleUpload}
                                    disabled={!file || isUploading}
                                >
                                    {isUploading ? 'Mengupload...' : 'Upload'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
