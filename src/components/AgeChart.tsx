import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useFilters } from "@/contexts/FilterContext";

interface AgeData {
  age: string;
  cases?: number;
  AFR?: number;
  AMR?: number;
  EMR?: number;
  EUR?: number;
  SEAR?: number;
  WPR?: number;
}

interface AgeChartProps {
  data: AgeData[];
  onRegionFilterChange?: (regions: string[]) => void;
}

const REGION_COLORS: Record<string, string> = {
  'all': 'hsl(var(--primary))',
  'AFR': 'hsl(25, 45%, 35%)',       // Dark Brown for Africa
  'AMR': 'hsl(var(--success))',     // Green for Americas
  'EMR': 'hsl(var(--warning))',     // Orange for Eastern Mediterranean
  'EUR': 'hsl(var(--primary))',     // Blue for Europe
  'SEAR': 'hsl(328, 100%, 54%)',    // Fuschia for South-East Asia
  'WPR': 'hsl(300, 47%, 75%)',      // Plum for Western Pacific
};

const REGION_NAMES: Record<string, string> = {
  'AFR': 'Afrika',
  'AMR': 'Amerika',
  'EMR': 'Mediterania Timur',
  'EUR': 'Eropa',
  'SEAR': 'Asia Tenggara',
  'WPR': 'Pasifik Barat',
};

// Format large numbers to K (thousands) or M (millions)
const formatYAxis = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

// Format numbers with thousand separator for tooltip
const formatTooltipValue = (value: number) => {
  return value.toLocaleString('id-ID');
};

export function AgeChart({ data }: AgeChartProps) {
  const { filters } = useFilters();

  const regionLabels: Record<string, string> = {
    'all': 'Semua Wilayah',
    'AFR': 'Africa',
    'AMR': 'Americas',
    'EMR': 'Eastern Mediterranean',
    'EUR': 'Europe',
    'SEAR': 'South-East Asia',
    'WPR': 'Western Pacific',
  };

  const getFilterText = () => {
    return regionLabels[filters.region] || 'Semua Wilayah';
  };

  const barColor = REGION_COLORS[filters.region] || REGION_COLORS['all'];
  const showMultiRegion = filters.region === 'all';
  const regions = ['AFR', 'AMR', 'EMR', 'EUR', 'SEAR', 'WPR'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Kasus Berdasarkan Kelompok Usia</CardTitle>
          {!showMultiRegion && (
            <Badge variant="secondary" className="text-xs">
              Filter: {getFilterText()}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="age"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number) => formatTooltipValue(value)}
            />
            <Legend />
            {showMultiRegion ? (
              // Multi-region mode: show stacked bars per region
              regions.map((region) => (
                <Bar
                  key={region}
                  dataKey={region}
                  fill={REGION_COLORS[region]}
                  name={REGION_NAMES[region]}
                  radius={[8, 8, 0, 0]}
                  stackId="a"
                />
              ))
            ) : (
              // Single region mode: show one bar
              <Bar 
                dataKey="cases" 
                fill={barColor} 
                name="Jumlah Kasus" 
                radius={[8, 8, 0, 0]} 
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
