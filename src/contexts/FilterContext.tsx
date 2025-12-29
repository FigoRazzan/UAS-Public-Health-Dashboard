import { createContext, useContext, useState, ReactNode } from 'react';
import { DateRange } from 'react-day-picker';

export interface FilterState {
  dateRange: DateRange | undefined;
  region: string;
  dataType: string;
  chartTimeRange: string; // '1m', '3m', '6m', '1y', 'all'
}

interface FilterContextType {
  filters: FilterState;
  setDateRange: (dateRange: DateRange | undefined) => void;
  setRegion: (region: string) => void;
  setDataType: (dataType: string) => void;
  setChartTimeRange: (timeRange: string) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialFilters: FilterState = {
  dateRange: {
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
    to: new Date(),
  },
  region: 'all',
  dataType: 'covid',
  chartTimeRange: '1y', // Default 1 year view
};

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const setDateRange = (dateRange: DateRange | undefined) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const setRegion = (region: string) => {
    setFilters(prev => ({ ...prev, region }));
  };

  const setDataType = (dataType: string) => {
    setFilters(prev => ({ ...prev, dataType }));
  };

  const setChartTimeRange = (timeRange: string) => {
    setFilters(prev => ({ ...prev, chartTimeRange: timeRange }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setDateRange,
        setRegion,
        setDataType,
        setChartTimeRange,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
