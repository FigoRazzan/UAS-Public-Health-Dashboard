import { useEffect, useState, useMemo } from 'react';
import Papa from 'papaparse';
import { FilterState } from '@/contexts/FilterContext';
import { getCachedData, setCachedData } from '@/lib/indexedDB';

export interface CovidDataRow {
  Date_reported: string;
  Country_code: string;
  Country: string;
  WHO_region: string;
  New_cases: number;
  Cumulative_cases: number;
  New_deaths: number;
  Cumulative_deaths: number;
}

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

export function useCovidData(filters?: FilterState) {
  const [data, setData] = useState<CovidDataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aggregatedData, setAggregatedData] = useState<Map<string, CovidDataRow[]>>(new Map());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to get cached data first
        const cached = await getCachedData();
        if (cached) {
          console.log(`✅ Loaded ${cached.data.length} rows from cache (INSTANT)`);
          const parsedData = cached.data as CovidDataRow[];
          setData(parsedData);
          
          // Pre-aggregate data for faster filtering
          console.log('🔄 Pre-aggregating data for faster filtering...');
          const startAggregate = performance.now();
          const aggregated = new Map<string, CovidDataRow[]>();
          
          parsedData.forEach(row => {
            const key = `${row.Date_reported}_${row.WHO_region}`;
            if (!aggregated.has(key)) {
              aggregated.set(key, []);
            }
            aggregated.get(key)!.push(row);
          });
          
          setAggregatedData(aggregated);
          console.log(`✅ Aggregated in ${((performance.now() - startAggregate) / 1000).toFixed(2)}s`);
          setLoading(false);
          return;
        }

        // If no cache, fetch from CSV
        console.log('📥 Fetching CSV from server...');
        const startTime = performance.now();
        const response = await fetch('/WHO-COVID-19-global-daily-data.csv');
        const csvText = await response.text();
        console.log(`📦 CSV downloaded in ${((performance.now() - startTime) / 1000).toFixed(2)}s`);

        console.log('🔄 Parsing CSV data...');
        const parseStart = performance.now();
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: async (results) => {
            const parsedData = results.data as CovidDataRow[];
            console.log(`✅ Parsed ${parsedData.length} rows in ${((performance.now() - parseStart) / 1000).toFixed(2)}s`);
            setData(parsedData);
            
            // Pre-aggregate data
            console.log('🔄 Pre-aggregating data...');
            const startAggregate = performance.now();
            const aggregated = new Map<string, CovidDataRow[]>();
            
            parsedData.forEach(row => {
              const key = `${row.Date_reported}_${row.WHO_region}`;
              if (!aggregated.has(key)) {
                aggregated.set(key, []);
              }
              aggregated.get(key)!.push(row);
            });
            
            setAggregatedData(aggregated);
            console.log(`✅ Aggregated in ${((performance.now() - startAggregate) / 1000).toFixed(2)}s`);
            
            // Cache the data for next time
            console.log('💾 Caching data to IndexedDB...');
            await setCachedData(parsedData);
            console.log('✅ Data cached! Next load will be instant ⚡');
            
            setLoading(false);
          },
          error: (error) => {
            console.error('❌ Parse error:', error);
            setError(error.message);
            setLoading(false);
          },
        });
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setError('Failed to load CSV file');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Optimized filtered data with early termination for large datasets
  const filteredData = useMemo(() => {
    if (!filters) return data;
    
    console.time('⚡ Filtering data');
    
    // If filtering by region, use aggregated data for faster lookup
    if (filters.region !== 'all' && aggregatedData.size > 0) {
      const result: CovidDataRow[] = [];
      const fromDate = filters.dateRange?.from ? new Date(filters.dateRange.from) : null;
      const toDate = filters.dateRange?.to ? new Date(filters.dateRange.to) : null;
      
      // Only iterate through relevant keys
      for (const [key, rows] of aggregatedData.entries()) {
        const [dateStr, region] = key.split('_');
        
        // Quick region check
        if (region !== filters.region) continue;
        
        // Quick date check
        if (fromDate || toDate) {
          const rowDate = new Date(dateStr);
          if (fromDate && rowDate < fromDate) continue;
          if (toDate && rowDate > toDate) continue;
        }
        
        result.push(...rows);
      }
      
      console.timeEnd('⚡ Filtering data');
      return result;
    }
    
    // Standard filtering for 'all' regions
    const result = data.filter(row => {
      // Filter by date range
      if (filters.dateRange?.from && filters.dateRange?.to) {
        const rowDate = new Date(row.Date_reported);
        const fromDate = new Date(filters.dateRange.from);
        const toDate = new Date(filters.dateRange.to);
        if (rowDate < fromDate || rowDate > toDate) {
          return false;
        }
      }

      return true;
    });
    
    console.timeEnd('⚡ Filtering data');
    return result;
  }, [data, aggregatedData, filters?.dateRange?.from, filters?.dateRange?.to, filters?.region]);

  // Calculate statistics with memoization
  const getStats = useMemo((): CovidStats => {
    console.time('⚡ Stats calculation');
    
    if (filteredData.length === 0) {
      console.timeEnd('⚡ Stats calculation');
      return {
        totalCases: 0,
        totalDeaths: 0,
        totalRecovered: 0,
        cfr: 0,
        casesTrend: 0,
        deathsTrend: 0,
      };
    }

    // Get latest date once
    const latestDate = filteredData.reduce((max, row) => {
      return row.Date_reported > max ? row.Date_reported : max;
    }, '');

    // Group by country and sum cumulative cases from latest date only
    const countryMap = new Map<string, { cases: number; deaths: number }>();
    
    for (const row of filteredData) {
      if (row.Date_reported !== latestDate) continue;
      
      const country = row.Country_code || row.Country || 'Unknown';
      const existing = countryMap.get(country);
      
      if (!existing || (row.Cumulative_cases || 0) > existing.cases) {
        countryMap.set(country, {
          cases: row.Cumulative_cases || 0,
          deaths: row.Cumulative_deaths || 0,
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

    // Calculate trend efficiently with single pass
    const dateMap = new Map<string, { cases: number; deaths: number }>();
    for (const row of filteredData) {
      const existing = dateMap.get(row.Date_reported) || { cases: 0, deaths: 0 };
      existing.cases += row.New_cases || 0;
      existing.deaths += row.New_deaths || 0;
      dateMap.set(row.Date_reported, existing);
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

    console.timeEnd('⚡ Stats calculation');
    return {
      totalCases,
      totalDeaths,
      totalRecovered,
      cfr,
      casesTrend,
      deathsTrend,
    };
  }, [filteredData]);

  // Get trend data based on time range (with per-region breakdown)
  const getTrendData = (timeRange: string = '6m'): TrendData[] => {
    // Check if we need region breakdown or single region data
    const needsRegionBreakdown = !filters || filters.region === 'all';
    
    // Get data based on filter mode
    const baseData = needsRegionBreakdown ? data.filter(row => {
      if (filters?.dateRange?.from && filters?.dateRange?.to) {
        const rowDate = new Date(row.Date_reported);
        const fromDate = new Date(filters.dateRange.from);
        const toDate = new Date(filters.dateRange.to);
        if (rowDate < fromDate || rowDate > toDate) {
          return false;
        }
      }
      return true;
    }) : filteredData;
    
    if (baseData.length === 0) return [];

    const dates = [...new Set(baseData.map(row => row.Date_reported))].sort().reverse();
    
    // Determine number of days based on timeRange
    let daysToShow = 180; // 6 months default
    let groupBy: 'day' | 'month' = 'month';
    
    switch(timeRange) {
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
      // Group by day with per-region breakdown or single region
      const dailyData = new Map<string, {
        kasusHarian?: number; kematian?: number;
        AFR_cases?: number; AMR_cases?: number; EMR_cases?: number;
        EUR_cases?: number; SEAR_cases?: number; WPR_cases?: number;
        AFR_deaths?: number; AMR_deaths?: number; EMR_deaths?: number;
        EUR_deaths?: number; SEAR_deaths?: number; WPR_deaths?: number;
      }>();
      
      baseData
        .filter(row => relevantDates.includes(row.Date_reported))
        .forEach(row => {
          const existing = dailyData.get(row.Date_reported) || {
            kasusHarian: 0, kematian: 0,
            AFR_cases: 0, AMR_cases: 0, EMR_cases: 0,
            EUR_cases: 0, SEAR_cases: 0, WPR_cases: 0,
            AFR_deaths: 0, AMR_deaths: 0, EMR_deaths: 0,
            EUR_deaths: 0, SEAR_deaths: 0, WPR_deaths: 0,
          };
          
          if (needsRegionBreakdown) {
            // Multi-region mode: break down by region
            const region = row.WHO_region;
            if (region === 'AFR') {
              existing.AFR_cases += (row.New_cases || 0);
              existing.AFR_deaths += (row.New_deaths || 0);
            } else if (region === 'AMR') {
              existing.AMR_cases += (row.New_cases || 0);
              existing.AMR_deaths += (row.New_deaths || 0);
            } else if (region === 'EMR') {
              existing.EMR_cases += (row.New_cases || 0);
              existing.EMR_deaths += (row.New_deaths || 0);
            } else if (region === 'EUR') {
              existing.EUR_cases += (row.New_cases || 0);
              existing.EUR_deaths += (row.New_deaths || 0);
            } else if (region === 'SEAR') {
              existing.SEAR_cases += (row.New_cases || 0);
              existing.SEAR_deaths += (row.New_deaths || 0);
            } else if (region === 'WPR') {
              existing.WPR_cases += (row.New_cases || 0);
              existing.WPR_deaths += (row.New_deaths || 0);
            }
          } else {
            // Single region mode: aggregate cases and deaths
            existing.kasusHarian += (row.New_cases || 0);
            existing.kematian += (row.New_deaths || 0);
          }
          
          dailyData.set(row.Date_reported, existing);
        });

      return Array.from(dailyData.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, stats]) => ({
          date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
          ...stats,
        }));
    } else {
      // Group by month with per-region breakdown or single region
      const monthlyData = new Map<string, {
        kasusHarian?: number; kematian?: number;
        AFR_cases?: number; AMR_cases?: number; EMR_cases?: number;
        EUR_cases?: number; SEAR_cases?: number; WPR_cases?: number;
        AFR_deaths?: number; AMR_deaths?: number; EMR_deaths?: number;
        EUR_deaths?: number; SEAR_deaths?: number; WPR_deaths?: number;
      }>();

      baseData
        .filter(row => relevantDates.includes(row.Date_reported))
        .forEach(row => {
          const month = row.Date_reported.substring(0, 7); // YYYY-MM
          const existing = monthlyData.get(month) || {
            kasusHarian: 0, kematian: 0,
            AFR_cases: 0, AMR_cases: 0, EMR_cases: 0,
            EUR_cases: 0, SEAR_cases: 0, WPR_cases: 0,
            AFR_deaths: 0, AMR_deaths: 0, EMR_deaths: 0,
            EUR_deaths: 0, SEAR_deaths: 0, WPR_deaths: 0,
          };
          
          if (needsRegionBreakdown) {
            // Multi-region mode: break down by region
            const region = row.WHO_region;
            if (region === 'AFR') {
              existing.AFR_cases! += (row.New_cases || 0);
              existing.AFR_deaths! += (row.New_deaths || 0);
            } else if (region === 'AMR') {
              existing.AMR_cases! += (row.New_cases || 0);
              existing.AMR_deaths! += (row.New_deaths || 0);
            } else if (region === 'EMR') {
              existing.EMR_cases! += (row.New_cases || 0);
              existing.EMR_deaths! += (row.New_deaths || 0);
            } else if (region === 'EUR') {
              existing.EUR_cases! += (row.New_cases || 0);
              existing.EUR_deaths! += (row.New_deaths || 0);
            } else if (region === 'SEAR') {
              existing.SEAR_cases! += (row.New_cases || 0);
              existing.SEAR_deaths! += (row.New_deaths || 0);
            } else if (region === 'WPR') {
              existing.WPR_cases! += (row.New_cases || 0);
              existing.WPR_deaths! += (row.New_deaths || 0);
            }
          } else {
            // Single region mode: aggregate cases and deaths
            existing.kasusHarian! += (row.New_cases || 0);
            existing.kematian! += (row.New_deaths || 0);
          }
          
          monthlyData.set(month, existing);
        });

      return Array.from(monthlyData.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, stats]) => ({
          date: new Date(month + '-01').toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
          ...stats,
        }));
    }
  };

  // Get region distribution with optional region filter and time range
  const getRegionData = (selectedRegions?: string[]): RegionData[] => {
    if (filteredData.length === 0) return [];

    const timeRange = filters?.chartTimeRange || '6m';
    const dates = [...new Set(filteredData.map(row => row.Date_reported))].sort().reverse();
    
    // Determine number of days based on timeRange
    let daysToShow = 180; // 6 months default
    switch(timeRange) {
      case '1m':
        daysToShow = 30;
        break;
      case '3m':
        daysToShow = 90;
        break;
      case '6m':
        daysToShow = 180;
        break;
      case '1y':
        daysToShow = 365;
        break;
      case 'all':
        daysToShow = dates.length;
        break;
    }

    const relevantDates = dates.slice(0, daysToShow);
    const timeRangeData = filteredData.filter(row => relevantDates.includes(row.Date_reported));

    const regionMap = new Map<string, number>();
    timeRangeData.forEach(row => {
      const region = row.WHO_region || 'Unknown';
      // Filter by selected regions if provided
      if (selectedRegions && !selectedRegions.includes(region)) {
        return;
      }
      regionMap.set(region, (regionMap.get(region) || 0) + (row.New_cases || 0));
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

  // Get age distribution based on selected regions and time range
  const getAgeData = (selectedRegions?: string[]): AgeData[] => {
    const needsRegionBreakdown = !filters || filters.region === 'all';
    const baseData = needsRegionBreakdown ? data.filter(row => {
      if (filters?.dateRange?.from && filters?.dateRange?.to) {
        const rowDate = new Date(row.Date_reported);
        const fromDate = new Date(filters.dateRange.from);
        const toDate = new Date(filters.dateRange.to);
        if (rowDate < fromDate || rowDate > toDate) {
          return false;
        }
      }
      return true;
    }) : filteredData;
    
    if (baseData.length === 0) return [];

    const timeRange = filters?.chartTimeRange || '6m';
    const dates = [...new Set(baseData.map(row => row.Date_reported))].sort().reverse();
    
    // Determine number of days based on timeRange
    let daysToShow = 180; // 6 months default
    switch(timeRange) {
      case '1m':
        daysToShow = 30;
        break;
      case '3m':
        daysToShow = 90;
        break;
      case '6m':
        daysToShow = 180;
        break;
      case '1y':
        daysToShow = 365;
        break;
      case 'all':
        daysToShow = dates.length;
        break;
    }

    const relevantDates = dates.slice(0, daysToShow);
    const timeRangeData = baseData.filter(row => relevantDates.includes(row.Date_reported));

    if (needsRegionBreakdown) {
      // Multi-region mode: calculate per region based on time range
      const regionTotals: Record<string, number> = {
        AFR: 0, AMR: 0, EMR: 0, EUR: 0, SEAR: 0, WPR: 0
      };

      timeRangeData.forEach(row => {
        const region = row.WHO_region;
        if (region && regionTotals.hasOwnProperty(region)) {
          regionTotals[region] += (row.New_cases || 0);
        }
      });

      // WHO COVID-19 age distribution patterns (approximate)
      return [
        {
          age: '0-17',
          AFR: Math.round(regionTotals.AFR * 0.04),
          AMR: Math.round(regionTotals.AMR * 0.04),
          EMR: Math.round(regionTotals.EMR * 0.04),
          EUR: Math.round(regionTotals.EUR * 0.04),
          SEAR: Math.round(regionTotals.SEAR * 0.04),
          WPR: Math.round(regionTotals.WPR * 0.04),
        },
        {
          age: '18-30',
          AFR: Math.round(regionTotals.AFR * 0.16),
          AMR: Math.round(regionTotals.AMR * 0.16),
          EMR: Math.round(regionTotals.EMR * 0.16),
          EUR: Math.round(regionTotals.EUR * 0.16),
          SEAR: Math.round(regionTotals.SEAR * 0.16),
          WPR: Math.round(regionTotals.WPR * 0.16),
        },
        {
          age: '31-45',
          AFR: Math.round(regionTotals.AFR * 0.23),
          AMR: Math.round(regionTotals.AMR * 0.23),
          EMR: Math.round(regionTotals.EMR * 0.23),
          EUR: Math.round(regionTotals.EUR * 0.23),
          SEAR: Math.round(regionTotals.SEAR * 0.23),
          WPR: Math.round(regionTotals.WPR * 0.23),
        },
        {
          age: '46-60',
          AFR: Math.round(regionTotals.AFR * 0.34),
          AMR: Math.round(regionTotals.AMR * 0.34),
          EMR: Math.round(regionTotals.EMR * 0.34),
          EUR: Math.round(regionTotals.EUR * 0.34),
          SEAR: Math.round(regionTotals.SEAR * 0.34),
          WPR: Math.round(regionTotals.WPR * 0.34),
        },
        {
          age: '60+',
          AFR: Math.round(regionTotals.AFR * 0.23),
          AMR: Math.round(regionTotals.AMR * 0.23),
          EMR: Math.round(regionTotals.EMR * 0.23),
          EUR: Math.round(regionTotals.EUR * 0.23),
          SEAR: Math.round(regionTotals.SEAR * 0.23),
          WPR: Math.round(regionTotals.WPR * 0.23),
        },
      ];
    } else {
      // Single region mode: calculate total for selected region based on time range
      const totalCases = timeRangeData.reduce((sum, row) => sum + (row.New_cases || 0), 0);

      return [
        { age: '0-17', cases: Math.round(totalCases * 0.04) },
        { age: '18-30', cases: Math.round(totalCases * 0.16) },
        { age: '31-45', cases: Math.round(totalCases * 0.23) },
        { age: '46-60', cases: Math.round(totalCases * 0.34) },
        { age: '60+', cases: Math.round(totalCases * 0.23) },
      ];
    }
  };

  // Get latest table data with filters
  const getTableData = (limit: number = 10) => {
    if (filteredData.length === 0) return [];

    const latestDate = filteredData.reduce((max, row) => {
      return row.Date_reported > max ? row.Date_reported : max;
    }, '');

    return filteredData
      .filter(row => row.Date_reported === latestDate)
      .sort((a, b) => (b.Cumulative_cases || 0) - (a.Cumulative_cases || 0))
      .slice(0, limit)
      .map(row => ({
        date_reported: row.Date_reported,
        country_code: row.Country_code,
        country: row.Country,
        who_region: row.WHO_region,
        new_cases: row.New_cases || 0,
        cumulative_cases: row.Cumulative_cases || 0,
        new_deaths: row.New_deaths || 0,
        cumulative_deaths: row.Cumulative_deaths || 0,
      }));
  };

  return {
    data,
    loading,
    error,
    stats: getStats,
    getTrendData,
    getRegionData,
    getAgeData,
    getTableData,
  };
}
