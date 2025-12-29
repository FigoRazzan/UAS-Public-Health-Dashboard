import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useFilters } from "@/contexts/FilterContext";

interface RegionData {
  name: string;
  value: number;
}

interface DistributionChartProps {
  data: RegionData[];
  onRegionFilterChange?: (regions: string[]) => void;
}

const COLORS = [
  "hsl(var(--primary))",     // Blue for Europe
  "hsl(var(--success))",     // Green for Americas
  "hsl(var(--warning))",     // Orange for Eastern Mediterranean
  "hsl(var(--danger))",      // Red for Africa
  "hsl(var(--accent))",      // Accent for South-East Asia
  "hsl(145, 65%, 45%)",      // Green for Western Pacific
];

const REGION_COLORS: Record<string, string> = {
  'Europe': 'hsl(var(--primary))',
  'Americas': 'hsl(var(--success))',
  'Eastern Mediterranean': 'hsl(var(--warning))',
  'Africa': 'hsl(25, 45%, 35%)',
  'South-East Asia': 'hsl(328, 100%, 54%)',
  'Western Pacific': 'hsl(300, 47%, 75%)',
};

export function DistributionChart({ data }: DistributionChartProps) {
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

  // Custom label function that only shows label if percentage > 5%
  const renderCustomLabel = (entry: any) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const percentage = (entry.value / total) * 100;
    
    // Only show label if percentage is greater than 5%
    if (percentage > 5) {
      return `${entry.name} (${percentage.toFixed(1)}%)`;
    }
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Distribusi Kasus per Wilayah</CardTitle>
          <Badge variant="secondary" className="text-xs">
            Filter: {getFilterText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={renderCustomLabel}
              labelLine={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={REGION_COLORS[entry.name] || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number) => {
                const total = data.reduce((sum, item) => sum + item.value, 0);
                const percentage = (value / total) * 100;
                return [`${value.toLocaleString('id-ID')} (${percentage.toFixed(1)}%)`, 'Kasus'];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
