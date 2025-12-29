import { supabase } from '@/lib/supabase';
import Papa from 'papaparse';

interface AuditLogData {
    admin_id: string;
    action: string;
    details: Record<string, any>;
}

interface UploadResult {
    count: number;
    errors: string[];
}

/**
 * Upload CSV data to covid_global_reports table
 */
export async function uploadCSVData(file: File): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const data = results.data;

                    if (data.length === 0) {
                        reject(new Error('File CSV kosong'));
                        return;
                    }

                    // Transform data to match database schema
                    const transformedData = data.map((row: any) => ({
                        date_reported: row.Date_reported || row.date_reported,
                        country_code: row.Country_code || row.country_code,
                        country: row.Country || row.country,
                        who_region: row.WHO_region || row.who_region,
                        new_cases: parseInt(row.New_cases || row.new_cases || '0'),
                        cumulative_cases: parseInt(row.Cumulative_cases || row.cumulative_cases || '0'),
                        new_deaths: parseInt(row.New_deaths || row.new_deaths || '0'),
                        cumulative_deaths: parseInt(row.Cumulative_deaths || row.cumulative_deaths || '0'),
                    }));

                    // Insert data in batches (1000 rows per batch)
                    const batchSize = 1000;
                    const errors: string[] = [];
                    let totalInserted = 0;

                    for (let i = 0; i < transformedData.length; i += batchSize) {
                        const batch = transformedData.slice(i, i + batchSize);

                        const { error, count } = await supabase
                            .from('covid_global_reports')
                            .insert(batch as any);

                        if (error) {
                            errors.push(`Batch ${i / batchSize + 1}: ${error.message}`);
                        } else {
                            totalInserted += count || batch.length;
                        }
                    }

                    if (errors.length > 0 && totalInserted === 0) {
                        reject(new Error(`Upload gagal: ${errors.join(', ')}`));
                    } else {
                        resolve({
                            count: totalInserted,
                            errors,
                        });
                    }
                } catch (error: any) {
                    reject(new Error(`Error parsing CSV: ${error.message}`));
                }
            },
            error: (error) => {
                reject(new Error(`Error reading file: ${error.message}`));
            },
        });
    });
}

/**
 * Create audit log entry
 * Database schema: user_id, action, details (TEXT), performed_at
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
    const { error } = await supabase
        .from('audit_logs')
        .insert({
            user_id: data.admin_id,
            action: data.action,
            details: JSON.stringify(data.details),
            performed_at: new Date().toISOString(),
        } as any); // Type assertion to bypass Supabase type checking

    if (error) {
        console.error('Error creating audit log:', error);
        throw new Error('Gagal membuat audit log');
    }
}

/**
 * Get audit logs with optional filtering
 * Database schema: user_id, action, details (TEXT), performed_at
 */
export async function getAuditLogs(filters?: {
    action?: string;
    admin_id?: string;
    limit?: number;
    offset?: number;
}) {
    let query = supabase
        .from('audit_logs')
        .select('*')
        .order('performed_at', { ascending: false });

    if (filters?.action) {
        query = query.eq('action', filters.action);
    }

    if (filters?.admin_id) {
        query = query.eq('user_id', filters.admin_id);
    }

    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data: logs, error, count } = await query;

    if (error) {
        console.error('Error fetching audit logs:', error);
        throw new Error('Gagal mengambil audit logs');
    }

    // Manually fetch profile data for each unique user_id
    if (logs && logs.length > 0) {
        const userIds = [...new Set(logs.map((log: any) => log.user_id).filter(Boolean))];

        if (userIds.length > 0) {
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, username, email')
                .in('id', userIds);

            // Attach profile data to logs
            const logsWithProfiles = logs.map((log: any) => ({
                ...log,
                profiles: profiles?.find((p: any) => p.id === log.user_id),
            }));

            return { data: logsWithProfiles, count };
        }
    }

    return { data: logs, count };
}
