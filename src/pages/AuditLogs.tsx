import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getAuditLogs } from '@/services/adminService';
import { FileText, Search, Download, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface AuditLog {
    id: string;
    user_id: string;
    action: string;
    details: string; // TEXT from database
    performed_at: string;
    profiles?: {
        username: string;
        email: string;
    };
}

const ACTION_COLORS: Record<string, string> = {
    UPLOAD_CSV: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    EDIT_DATA: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    DELETE_DATA: 'bg-red-500/10 text-red-700 border-red-500/20',
};

export default function AuditLogs() {
    const { isAdmin, isLoading } = useAuth();
    const navigate = useNavigate();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect if not admin
        if (!isLoading && !isAdmin) {
            toast.error('Akses ditolak', {
                description: 'Halaman ini hanya untuk admin',
            });
            navigate('/dashboard');
            return;
        }

        if (isAdmin) {
            fetchLogs();
        }
    }, [isAdmin, isLoading, navigate]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const { data } = await getAuditLogs({ limit: 100 });
            setLogs(data || []);
            setFilteredLogs(data || []);
        } catch (error: any) {
            toast.error('Gagal memuat audit logs', {
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = logs;

        // Filter by action
        if (actionFilter !== 'all') {
            filtered = filtered.filter(log => log.action === actionFilter);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(log =>
                log.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.action.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredLogs(filtered);
    }, [logs, actionFilter, searchQuery]);

    const exportToCSV = () => {
        const csv = [
            ['Timestamp', 'Admin', 'Action', 'Details'],
            ...filteredLogs.map(log => [
                format(new Date(log.performed_at), 'dd/MM/yyyy HH:mm:ss'),
                log.profiles?.username || log.profiles?.email || 'Unknown',
                log.action,
                log.details, // Already a string
            ]),
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success('Export berhasil', {
            description: 'Audit logs berhasil diexport ke CSV',
        });
    };

    if (isLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Audit Logs</h1>
                            <p className="text-muted-foreground">Riwayat aktivitas admin</p>
                        </div>
                    </div>
                    <Button onClick={exportToCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                        <CardDescription>Cari dan filter audit logs</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari berdasarkan username atau email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Semua Action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Action</SelectItem>
                                <SelectItem value="UPLOAD_CSV">Upload CSV</SelectItem>
                                <SelectItem value="EDIT_DATA">Edit Data</SelectItem>
                                <SelectItem value="DELETE_DATA">Delete Data</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Aktivitas ({filteredLogs.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Admin</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2 py-8">
                                                <FileText className="h-12 w-12 opacity-20" />
                                                <p>Tidak ada audit logs</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-sm">
                                                {format(new Date(log.performed_at), 'dd MMM yyyy, HH:mm:ss', { locale: id })}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{log.profiles?.username || 'Unknown'}</p>
                                                    <p className="text-xs text-muted-foreground">{log.profiles?.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={ACTION_COLORS[log.action] || ''}>
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <div className="text-xs text-muted-foreground truncate" title={log.details}>
                                                    {log.details}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
