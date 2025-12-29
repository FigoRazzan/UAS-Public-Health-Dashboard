import { supabase } from '@/lib/supabase';
import { CovidGlobalReport } from '@/types/database.types';

/**
 * Service untuk mengambil data COVID dari Supabase
 */
export const covidDataService = {
    /**
     * Ambil semua data COVID global
     */
    async fetchGlobalData(): Promise<CovidGlobalReport[]> {
        const { data, error } = await supabase
            .from('covid_global_reports')
            .select('*')
            .order('date_reported', { ascending: false });

        if (error) {
            console.error('Error fetching global data:', error);
            throw new Error('Gagal mengambil data global');
        }

        return data || [];
    },

    /**
     * Ambil data berdasarkan negara
     */
    async fetchByCountry(country: string): Promise<CovidGlobalReport[]> {
        const { data, error } = await supabase
            .from('covid_global_reports')
            .select('*')
            .eq('country', country)
            .order('date_reported', { ascending: false });

        if (error) {
            console.error('Error fetching data by country:', error);
            throw new Error(`Gagal mengambil data untuk ${country}`);
        }

        return data || [];
    },

    /**
     * Ambil data berdasarkan region WHO
     */
    async fetchByRegion(region: string): Promise<CovidGlobalReport[]> {
        const { data, error } = await supabase
            .from('covid_global_reports')
            .select('*')
            .eq('who_region', region)
            .order('date_reported', { ascending: false });

        if (error) {
            console.error('Error fetching data by region:', error);
            throw new Error(`Gagal mengambil data untuk region ${region}`);
        }

        return data || [];
    },

    /**
     * Ambil data berdasarkan rentang tanggal
     */
    async fetchByDateRange(startDate: string, endDate: string): Promise<CovidGlobalReport[]> {
        const { data, error } = await supabase
            .from('covid_global_reports')
            .select('*')
            .gte('date_reported', startDate)
            .lte('date_reported', endDate)
            .order('date_reported', { ascending: false });

        if (error) {
            console.error('Error fetching data by date range:', error);
            throw new Error('Gagal mengambil data berdasarkan rentang tanggal');
        }

        return data || [];
    },

    /**
     * Ambil data terbaru (latest)
     */
    async getLatestData(limit: number = 100): Promise<CovidGlobalReport[]> {
        const { data, error } = await supabase
            .from('covid_global_reports')
            .select('*')
            .order('date_reported', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching latest data:', error);
            throw new Error('Gagal mengambil data terbaru');
        }

        return data || [];
    },

    /**
     * Ambil daftar negara unik
     */
    async getCountries(): Promise<string[]> {
        const { data, error } = await supabase
            .from('covid_global_reports')
            .select('country')
            .order('country');

        if (error) {
            console.error('Error fetching countries:', error);
            throw new Error('Gagal mengambil daftar negara');
        }

        // Remove duplicates
        const countries = data?.map((item: { country: string }) => item.country) || [];
        const uniqueCountries = [...new Set(countries)];
        return uniqueCountries;
    },

    /**
     * Ambil daftar region WHO unik
     */
    async getRegions(): Promise<string[]> {
        const { data, error } = await supabase
            .from('covid_global_reports')
            .select('who_region')
            .order('who_region');

        if (error) {
            console.error('Error fetching regions:', error);
            throw new Error('Gagal mengambil daftar region');
        }

        // Remove duplicates
        const regions = data?.map((item: { who_region: string }) => item.who_region) || [];
        const uniqueRegions = [...new Set(regions)];
        return uniqueRegions;
    },

    /**
     * Search data berdasarkan keyword
     */
    async searchData(keyword: string): Promise<CovidGlobalReport[]> {
        const { data, error } = await supabase
            .from('covid_global_reports')
            .select('*')
            .or(`country.ilike.%${keyword}%,country_code.ilike.%${keyword}%`)
            .order('date_reported', { ascending: false })
            .limit(100);

        if (error) {
            console.error('Error searching data:', error);
            throw new Error('Gagal mencari data');
        }

        return data || [];
    },
};
