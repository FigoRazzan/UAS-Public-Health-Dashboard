export interface CovidGlobalReport {
    id: number;
    date_reported: string;
    country_code: string;
    country: string;
    who_region: string;
    new_cases: number;
    cumulative_cases: number;
    new_deaths: number;
    cumulative_deaths: number;
    created_at: string;
}

export interface Profile {
    id: string;
    full_name: string | null;
    username: string | null;
    email: string | null;
    role: 'admin' | 'public';
    agency: string | null;
    created_at: string;
}

export interface AuditLog {
    id: number;
    user_id: string | null;
    action: string;
    details: string | null;
    performed_at: string;
}

export interface Database {
    public: {
        Tables: {
            covid_global_reports: {
                Row: CovidGlobalReport;
                Insert: Omit<CovidGlobalReport, 'id' | 'created_at'>;
                Update: Partial<Omit<CovidGlobalReport, 'id' | 'created_at'>>;
            };
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'created_at'>;
                Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
            };
            audit_logs: {
                Row: AuditLog;
                Insert: Omit<AuditLog, 'id' | 'performed_at'>;
                Update: Partial<Omit<AuditLog, 'id' | 'performed_at'>>;
            };
        };
    };
}
