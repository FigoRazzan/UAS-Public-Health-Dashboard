import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function DashboardFooter() {
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    useEffect(() => {
        fetchLastUpdated();
    }, []);

    const fetchLastUpdated = async () => {
        try {
            // Call RPC function to get last data update (bypasses RLS)
            const { data, error } = await supabase.rpc('get_last_data_update');

            if (data && !error) {
                setLastUpdated(data as string);
            }
        } catch (error) {
            console.error('Error fetching last updated:', error);
        }
    };

    if (!lastUpdated) return null;

    return (
        <footer className="border-t bg-card/50 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                        📅 Data Terakhir Diperbarui:{' '}
                        <span className="font-medium text-foreground">
                            {format(new Date(lastUpdated), "dd MMMM yyyy, HH:mm 'WIB'", { locale: id })}
                        </span>
                    </span>
                </div>
            </div>
        </footer>
    );
}
