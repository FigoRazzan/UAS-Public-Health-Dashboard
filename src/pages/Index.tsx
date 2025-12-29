import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { KPICard } from "@/components/KPICard";
import { FilterBar } from "@/components/FilterBar";
import { TrendChart } from "@/components/TrendChart";
import { DistributionChart } from "@/components/DistributionChart";
import { AgeChart } from "@/components/AgeChart";
import { DataTable } from "@/components/DataTable";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Activity, Users, Heart, TrendingUp } from "lucide-react";
import { useCovidDataSupabase as useCovidData } from "@/hooks/useCovidDataSupabase";
import { FilterProvider, useFilters } from "@/contexts/FilterContext";

const DashboardContent = () => {
  const { filters } = useFilters();
  const { loading, error, stats, getTrendData, getRegionData, getAgeData, getTableData } = useCovidData(filters);

  const trendData = getTrendData(filters.chartTimeRange);

  // Use main region filter for both charts
  const regionFilter = filters.region === 'all'
    ? ['AFR', 'AMR', 'EMR', 'EUR', 'SEAR', 'WPR']
    : [filters.region];

  const regionData = getRegionData(regionFilter);
  const ageData = getAgeData(regionFilter);
  const tableData = getTableData(10);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6 space-y-6">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-8 w-80 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
                </div>
                <SidebarTrigger />
              </div>

              {/* Filter Bar Skeleton */}
              <div className="bg-card border rounded-lg p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="h-10 w-48 bg-muted animate-pulse rounded"></div>
                  <div className="h-10 w-48 bg-muted animate-pulse rounded"></div>
                  <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
                </div>
              </div>

              {/* KPI Cards Skeleton */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card border rounded-lg p-6 space-y-3 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-32 bg-muted rounded"></div>
                      <div className="h-8 w-8 bg-muted rounded"></div>
                    </div>
                    <div className="h-8 w-28 bg-muted rounded"></div>
                    <div className="h-4 w-20 bg-muted rounded"></div>
                  </div>
                ))}
              </div>

              {/* Trend Chart Skeleton */}
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-6 w-64 bg-muted animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-8 w-12 bg-muted animate-pulse rounded"></div>
                    ))}
                  </div>
                </div>
                <div className="h-80 bg-muted animate-pulse rounded flex items-end justify-around p-4 gap-1">
                  {/* Animated bars simulating chart loading */}
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-primary/20 rounded-t animate-pulse w-full"
                      style={{
                        height: `${Math.random() * 80 + 20}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Distribution & Age Charts Skeleton */}
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-card border rounded-lg p-6 space-y-4">
                    <div>
                      <div className="h-6 w-56 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-4 w-40 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="h-80 bg-muted animate-pulse rounded flex items-center justify-center">
                      {i === 1 ? (
                        // Pie chart simulation
                        <div className="relative w-48 h-48 rounded-full border-8 border-primary/20 animate-spin" style={{ animationDuration: '3s' }}>
                          <div className="absolute inset-0 rounded-full border-t-8 border-primary/40"></div>
                        </div>
                      ) : (
                        // Bar chart simulation
                        <div className="flex items-end justify-around h-64 w-full gap-2 px-8">
                          {[...Array(6)].map((_, idx) => (
                            <div
                              key={idx}
                              className="bg-primary/30 rounded-t w-full animate-pulse"
                              style={{
                                height: `${Math.random() * 80 + 20}%`,
                                animationDelay: `${idx * 0.15}s`,
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Table Skeleton */}
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <div>
                  <div className="h-6 w-48 bg-muted animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-3 border-b animate-pulse">
                      <div className="h-5 w-8 bg-muted rounded"></div>
                      <div className="h-5 w-32 bg-muted rounded"></div>
                      <div className="h-5 w-24 bg-muted rounded"></div>
                      <div className="h-5 w-24 bg-muted rounded"></div>
                      <div className="h-5 w-20 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loading Indicator Overlay */}
              <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent"></div>
                <span className="font-medium">Memuat data COVID-19...</span>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-danger">
          <p className="text-xl font-bold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Ringkasan Eksekutif Wabah</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Pemantauan real-time status kesehatan masyarakat
                </p>
              </div>
              <SidebarTrigger />
            </div>

            <FilterBar />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <KPICard
                title="Total Kasus Terkonfirmasi"
                value={stats.totalCases.toLocaleString('id-ID')}
                trend={{
                  direction: stats.casesTrend >= 0 ? "up" : "down",
                  value: `${stats.casesTrend >= 0 ? '+' : ''}${stats.casesTrend.toFixed(1)}%`
                }}
                icon={Activity}
                variant="primary"
              />
              <KPICard
                title="Total Kematian"
                value={stats.totalDeaths.toLocaleString('id-ID')}
                trend={{
                  direction: stats.deathsTrend >= 0 ? "up" : "down",
                  value: `${stats.deathsTrend >= 0 ? '+' : ''}${stats.deathsTrend.toFixed(1)}%`
                }}
                icon={Users}
                variant="danger"
              />
              <KPICard
                title="Total Sembuh"
                value={stats.totalRecovered.toLocaleString('id-ID')}
                trend={{ direction: "down", value: "-0.5%" }}
                icon={Heart}
                variant="success"
              />
              <KPICard
                title="Tingkat Kematian (CFR)"
                value={`${stats.cfr.toFixed(1)}%`}
                trend={{ direction: "down", value: "-0.2%" }}
                icon={TrendingUp}
                variant="warning"
              />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <TrendChart data={trendData} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <DistributionChart data={regionData} />
              <AgeChart data={ageData} />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
              <DataTable data={tableData} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const Index = () => {
  return (
    <FilterProvider>
      <DashboardContent />
    </FilterProvider>
  );
};

export default Index;
