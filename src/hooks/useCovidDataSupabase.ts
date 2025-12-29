import { useQuery } from '@tanstack/react-query';
import { covidDataService } from '@/services/covidDataService';
import { useMemo } from 'react';
import { FilterState } from '@/contexts/FilterContext';

export interface CovidStats {
    totalCases: number;
    totalDeaths: number;
    totalRecovered: number;
    cfr: number;
    casesTrend: number;
    deathsTrend: number;
}

export interface TrendData {
    date: string;
    kasusHarian?: number;
    kematian?: number;
    // Region-specific data
    AFR_cases?: number;
    AMR_cases?: number;
    EMR_cases?: number;
    EUR_cases?: number;
    SEAR_cases?: number;
    WPR_cases?: number;
    AFR_deaths?: number;
    AMR_deaths?: number;
    EMR_deaths?: number;
    EUR_deaths?: number;
    SEAR_deaths?: number;
    WPR_deaths?: number;
}

export interface RegionData {
    name: string;
    value: number;
}

export interface AgeData {
    age: string;
    cases?: number;
    AFR?: number;
    AMR?: number;
    EMR?: number;
    EUR?: number;
    SEAR?: number;
    WPR?: number;
}

/**
 * Hook untuk fetch data COVID dari Supabase dengan React Query
 */
export function useCovidDataSupabase(filters?: FilterState) {
    // Fetch data dari Supabase dengan React Query (auto caching)
    const { data = [], isLoading, error } = useQuery({
        queryKey: ['covid-data-v4'], // Force refetch after DB update
        queryFn: () => covidDataService.fetchGlobalData(),
        staleTime: 0, // Disable cache for testing
        gcTime: 0, // Disable cache for testing
        refetchOnMount: true,
    });

    // Filter data berdasarkan filters
    const filteredData = useMemo(() => {
        if (!filters) return data;

        console.log('🔍 Filtering data with:', {
            region: filters.region,
            dateRange: filters.dateRange,
            dataLength: data.length
        });

        const result = data.filter(row => {
            // Filter by region
            if (filters.region && filters.region !== 'all' && row.who_region !== filters.region) {
                return false;
            }

            // Filter by date range
            if (filters.dateRange?.from && filters.dateRange?.to) {
                const rowDate = new Date(row.date_reported);
                const fromDate = new Date(filters.dateRange.from);
                const toDate = new Date(filters.dateRange.to);
                if (rowDate < fromDate || rowDate > toDate) {
                    return false;
                }
            }

            return true;
        });

        console.log('✅ Filtered data length:', result.length);
        return result;
    }, [data, filters]);

    // Calculate statistics
    const stats = useMemo((): CovidStats => {
        if (filteredData.length === 0) {
            return {
                totalCases: 0,
                totalDeaths: 0,
                totalRecovered: 0,
                cfr: 0,
                casesTrend: 0,
                deathsTrend: 0,
            };
        }

        // Get latest date
        const latestDate = filteredData.reduce((max, row) => {
            return row.date_reported > max ? row.date_reported : max;
        }, '');

        // Group by country and sum cumulative cases from latest date
        const countryMap = new Map<string, { cases: number; deaths: number }>();

        for (const row of filteredData) {
            if (row.date_reported !== latestDate) continue;

            const country = row.country_code || row.country || 'Unknown';
            const existing = countryMap.get(country);

            if (!existing || row.cumulative_cases > existing.cases) {
                countryMap.set(country, {
                    cases: row.cumulative_cases,
                    deaths: row.cumulative_deaths,
                });
            }
        }

        // Sum from unique countries
        let totalCases = 0;
        let totalDeaths = 0;
        for (const data of countryMap.values()) {
            totalCases += data.cases;
            totalDeaths += data.deaths;
        }

        // Estimate recovered (approximately 95% of cases minus deaths)
        const totalRecovered = Math.round(totalCases * 0.95 - totalDeaths);

        // Calculate CFR (Case Fatality Rate)
        const cfr = totalCases > 0 ? (totalDeaths / totalCases) * 100 : 0;

        // Calculate trend (last 7 days vs previous 7 days)
        const dateMap = new Map<string, { cases: number; deaths: number }>();
        for (const row of filteredData) {
            const existing = dateMap.get(row.date_reported) || { cases: 0, deaths: 0 };
            existing.cases += row.new_cases;
            existing.deaths += row.new_deaths;
            dateMap.set(row.date_reported, existing);
        }

        const sortedDates = Array.from(dateMap.keys()).sort().reverse();
        const last7Days = sortedDates.slice(0, 7);
        const prev7Days = sortedDates.slice(7, 14);

        let last7Cases = 0, prev7Cases = 0, last7Deaths = 0, prev7Deaths = 0;

        for (const date of last7Days) {
            const data = dateMap.get(date);
            if (data) {
                last7Cases += data.cases;
                last7Deaths += data.deaths;
            }
        }

        for (const date of prev7Days) {
            const data = dateMap.get(date);
            if (data) {
                prev7Cases += data.cases;
                prev7Deaths += data.deaths;
            }
        }

        const casesTrend = prev7Cases > 0 ? ((last7Cases - prev7Cases) / prev7Cases) * 100 : 0;
        const deathsTrend = prev7Deaths > 0 ? ((last7Deaths - prev7Deaths) / prev7Deaths) * 100 : 0;

        return {
            totalCases,
            totalDeaths,
            totalRecovered,
            cfr,
            casesTrend,
            deathsTrend,
        };
    }, [filteredData]);

    // Get trend data based on time range
    const getTrendData = (timeRange: string = '6m'): TrendData[] => {
        if (filteredData.length === 0) {
            return [];
        }

        const dates = [...new Set(filteredData.map(row => row.date_reported))].sort().reverse();

        // Determine number of days based on timeRange
        let daysToShow = 180; // 6 months default
        let groupBy: 'day' | 'month' = 'month';

        switch (timeRange) {
            case '1m':
                daysToShow = 30;
                groupBy = 'day';
                break;
            case '3m':
                daysToShow = 90;
                groupBy = 'month';
                break;
            case '6m':
                daysToShow = 180;
                groupBy = 'month';
                break;
            case '1y':
                daysToShow = 365;
                groupBy = 'month';
                break;
            case 'all':
                daysToShow = dates.length;
                groupBy = 'month';
                break;
        }

        const relevantDates = dates.slice(0, daysToShow);

        if (groupBy === 'day') {
            // Determine if we need region breakdown
            const needsRegionBreakdown = !filters || filters.region === 'all';

            // Group by day
            const dailyData = new Map<string, {
                kasusHarian?: number; kematian?: number;
                AFR_cases?: number; AMR_cases?: number; EMR_cases?: number;
                EUR_cases?: number; SEAR_cases?: number; WPR_cases?: number;
                AFR_deaths?: number; AMR_deaths?: number; EMR_deaths?: number;
                EUR_deaths?: number; SEAR_deaths?: number; WPR_deaths?: number;
            }>();

            filteredData
                .filter(row => relevantDates.includes(row.date_reported))
                .forEach(row => {
                    const existing = dailyData.get(row.date_reported) || {
                        kasusHarian: 0, kematian: 0,
                        AFR_cases: 0, AMR_cases: 0, EMR_cases: 0,
                        EUR_cases: 0, SEAR_cases: 0, WPR_cases: 0,
                        AFR_deaths: 0, AMR_deaths: 0, EMR_deaths: 0,
                        EUR_deaths: 0, SEAR_deaths: 0, WPR_deaths: 0,
                    };

                    if (needsRegionBreakdown) {
                        // Multi-region mode: break down by region
                        const region = row.who_region;
                        if (region === 'AFR') {
                            existing.AFR_cases! += row.new_cases;
                            existing.AFR_deaths! += row.new_deaths;
                        } else if (region === 'AMR') {
                            existing.AMR_cases! += row.new_cases;
                            existing.AMR_deaths! += row.new_deaths;
                        } else if (region === 'EMR') {
                            existing.EMR_cases! += row.new_cases;
                            existing.EMR_deaths! += row.new_deaths;
                        } else if (region === 'EUR') {
                            existing.EUR_cases! += row.new_cases;
                            existing.EUR_deaths! += row.new_deaths;
                        } else if (region === 'SEAR') {
                            existing.SEAR_cases! += row.new_cases;
                            existing.SEAR_deaths! += row.new_deaths;
                        } else if (region === 'WPR') {
                            existing.WPR_cases! += row.new_cases;
                            existing.WPR_deaths! += row.new_deaths;
                        }
                    } else {
                        // Single region mode
                        existing.kasusHarian! += row.new_cases;
                        existing.kematian! += row.new_deaths;
                    }

                    dailyData.set(row.date_reported, existing);
                });

            return Array.from(dailyData.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([date, stats]) => ({
                    date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
                    ...stats,
                }));
        } else {
            // Determine if we need region breakdown
            const needsRegionBreakdown = !filters || filters.region === 'all';

            // Group by month
            const monthlyData = new Map<string, {
                kasusHarian?: number; kematian?: number;
                AFR_cases?: number; AMR_cases?: number; EMR_cases?: number;
                EUR_cases?: number; SEAR_cases?: number; WPR_cases?: number;
                AFR_deaths?: number; AMR_deaths?: number; EMR_deaths?: number;
                EUR_deaths?: number; SEAR_deaths?: number; WPR_deaths?: number;
            }>();

            filteredData
                .filter(row => relevantDates.includes(row.date_reported))
                .forEach(row => {
                    const month = row.date_reported.substring(0, 7); // YYYY-MM
                    const existing = monthlyData.get(month) || {
                        kasusHarian: 0, kematian: 0,
                        AFR_cases: 0, AMR_cases: 0, EMR_cases: 0,
                        EUR_cases: 0, SEAR_cases: 0, WPR_cases: 0,
                        AFR_deaths: 0, AMR_deaths: 0, EMR_deaths: 0,
                        EUR_deaths: 0, SEAR_deaths: 0, WPR_deaths: 0,
                    };

                    if (needsRegionBreakdown) {
                        // Multi-region mode: break down by region
                        const region = row.who_region;
                        if (region === 'AFR') {
                            existing.AFR_cases! += row.new_cases;
                            existing.AFR_deaths! += row.new_deaths;
                        } else if (region === 'AMR') {
                            existing.AMR_cases! += row.new_cases;
                            existing.AMR_deaths! += row.new_deaths;
                        } else if (region === 'EMR') {
                            existing.EMR_cases! += row.new_cases;
                            existing.EMR_deaths! += row.new_deaths;
                        } else if (region === 'EUR') {
                            existing.EUR_cases! += row.new_cases;
                            existing.EUR_deaths! += row.new_deaths;
                        } else if (region === 'SEAR') {
                            existing.SEAR_cases! += row.new_cases;
                            existing.SEAR_deaths! += row.new_deaths;
                        } else if (region === 'WPR') {
                            existing.WPR_cases! += row.new_cases;
                            existing.WPR_deaths! += row.new_deaths;
                        }
                    } else {
                        // Single region mode
                        existing.kasusHarian! += row.new_cases;
                        existing.kematian! += row.new_deaths;
                    }

                    monthlyData.set(month, existing);
                });

            const result = Array.from(monthlyData.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([month, stats]) => ({
                    date: new Date(month + '-01').toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
                    ...stats,
                }));

            console.log('📈 getTrendData monthly result:', result.length, 'months', result.slice(0, 3));
            return result;
        }
    };

    // Get region data
    const getRegionData = (selectedRegions?: string[]): RegionData[] => {
        if (filteredData.length === 0) return [];

        const regionMap = new Map<string, number>();
        filteredData.forEach(row => {
            const region = row.who_region || 'Unknown';
            if (selectedRegions && !selectedRegions.includes(region)) {
                return;
            }
            regionMap.set(region, (regionMap.get(region) || 0) + row.new_cases);
        });

        const regionNames: Record<string, string> = {
            'AFR': 'Africa',
            'AMR': 'Americas',
            'EMR': 'Eastern Mediterranean',
            'EUR': 'Europe',
            'SEAR': 'South-East Asia',
            'WPR': 'Western Pacific',
        };

        return Array.from(regionMap.entries())
            .map(([region, value]) => ({
                name: regionNames[region] || region,
                value,
            }))
            .sort((a, b) => b.value - a.value);
    };

    // Get age data (simplified - using estimates)
    const getAgeData = (selectedRegions?: string[]): AgeData[] => {
        if (filteredData.length === 0) return [];

        const needsRegionBreakdown = !filters || filters.region === 'all';

        if (needsRegionBreakdown) {
            // Multi-region mode: break down by region
            const ageGroups = ['0-17', '18-30', '31-45', '46-60', '60+'];
            const percentages = [0.04, 0.16, 0.23, 0.34, 0.23];

            return ageGroups.map((age, index) => {
                const result: any = { age };

                // Calculate cases per region
                ['AFR', 'AMR', 'EMR', 'EUR', 'SEAR', 'WPR'].forEach(region => {
                    const regionData = filteredData.filter(row => row.who_region === region);
                    const regionCases = regionData.reduce((sum, row) => sum + row.new_cases, 0);
                    result[region] = Math.round(regionCases * percentages[index]);
                });

                return result;
            });
        } else {
            // Single region mode
            const totalCases = filteredData.reduce((sum, row) => sum + row.new_cases, 0);

            return [
                { age: '0-17', cases: Math.round(totalCases * 0.04) },
                { age: '18-30', cases: Math.round(totalCases * 0.16) },
                { age: '31-45', cases: Math.round(totalCases * 0.23) },
                { age: '46-60', cases: Math.round(totalCases * 0.34) },
                { age: '60+', cases: Math.round(totalCases * 0.23) },
            ];
        }
    };

    // Get table data
    const getTableData = (limit: number = 10) => {
        if (filteredData.length === 0) return [];

        const latestDate = filteredData.reduce((max, row) => {
            return row.date_reported > max ? row.date_reported : max;
        }, '');

        return filteredData
            .filter(row => row.date_reported === latestDate)
            .sort((a, b) => b.cumulative_cases - a.cumulative_cases)
            .slice(0, limit);
    };

    return {
        data: filteredData,
        loading: isLoading,
        error: error ? 'Failed to load data' : null,
        stats,
        getTrendData,
        getRegionData,
        getAgeData,
        getTableData,
    };
}
