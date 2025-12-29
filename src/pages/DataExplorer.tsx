import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter, ChevronDown, ChevronUp, Calendar, MapPin } from "lucide-react";
import { FilterProvider, useFilters } from "@/contexts/FilterContext";
import { useCovidData } from "@/hooks/useCovidData";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Papa from "papaparse";

const REGION_NAMES = {
  'AFR': 'Afrika',
  'AMR': 'Amerika',
  'EMR': 'Mediterania Timur',
  'EUR': 'Eropa',
  'SEAR': 'Asia Tenggara',
  'WPR': 'Pasifik Barat',
};

const DataExplorerContent = () => {
  const { filters } = useFilters();
  const { data, loading } = useCovidData(filters);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("Date_reported");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Filter and search data
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let result = [...data];

    // Apply region filter
    if (selectedRegion !== "all") {
      result = result.filter(row => row.WHO_region === selectedRegion);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(row => 
        row.Country?.toLowerCase().includes(query) ||
        row.Country_code?.toLowerCase().includes(query) ||
        row.WHO_region?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortField as keyof typeof a];
      let bValue = b[sortField as keyof typeof b];

      // Handle numeric fields
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string fields
      const aStr = String(aValue || '');
      const bStr = String(bValue || '');
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return result;
  }, [data, selectedRegion, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Export to CSV
  const handleExport = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `covid19-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset filters
  const handleReset = () => {
    setSearchQuery("");
    setSelectedRegion("all");
    setSortField("Date_reported");
    setSortDirection("desc");
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6 bg-gradient-to-br from-background via-background to-muted/20">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="h-20 bg-muted animate-pulse rounded"></div>
                <Card>
                  <CardContent className="p-6">
                    <div className="h-12 bg-muted animate-pulse rounded"></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 space-y-2">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-background to-muted/20 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Data Rinci (Live)</h1>
                  <p className="text-muted-foreground mt-1">
                    Eksplorasi {filteredData.length.toLocaleString('id-ID')} data COVID-19 secara detail dengan filter dan pencarian
                  </p>
                </div>
                <Button onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Filter & Pencarian Data</CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      Reset Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Cari negara, kode negara..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    <Select value={selectedRegion} onValueChange={(value) => {
                      setSelectedRegion(value);
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Wilayah WHO" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Wilayah</SelectItem>
                        {Object.entries(REGION_NAMES).map(([code, name]) => (
                          <SelectItem key={code} value={code}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(searchQuery || selectedRegion !== "all") && (
                    <div className="flex gap-2 mt-4">
                      <span className="text-sm text-muted-foreground">Filter aktif:</span>
                      {searchQuery && (
                        <Badge variant="secondary" className="gap-1">
                          <Search className="h-3 w-3" />
                          {searchQuery}
                        </Badge>
                      )}
                      {selectedRegion !== "all" && (
                        <Badge variant="secondary" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          {REGION_NAMES[selectedRegion as keyof typeof REGION_NAMES]}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('Date_reported')}>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Tanggal
                              <SortIcon field="Date_reported" />
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('Country')}>
                            <div className="flex items-center gap-2">
                              Negara
                              <SortIcon field="Country" />
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('Country_code')}>
                            <div className="flex items-center gap-2">
                              Kode
                              <SortIcon field="Country_code" />
                            </div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('WHO_region')}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Wilayah
                              <SortIcon field="WHO_region" />
                            </div>
                          </TableHead>
                          <TableHead className="text-right cursor-pointer" onClick={() => handleSort('New_cases')}>
                            <div className="flex items-center justify-end gap-2">
                              Kasus Baru
                              <SortIcon field="New_cases" />
                            </div>
                          </TableHead>
                          <TableHead className="text-right cursor-pointer" onClick={() => handleSort('Cumulative_cases')}>
                            <div className="flex items-center justify-end gap-2">
                              Total Kasus
                              <SortIcon field="Cumulative_cases" />
                            </div>
                          </TableHead>
                          <TableHead className="text-right cursor-pointer" onClick={() => handleSort('New_deaths')}>
                            <div className="flex items-center justify-end gap-2">
                              Kematian Baru
                              <SortIcon field="New_deaths" />
                            </div>
                          </TableHead>
                          <TableHead className="text-right cursor-pointer" onClick={() => handleSort('Cumulative_deaths')}>
                            <div className="flex items-center justify-end gap-2">
                              Total Kematian
                              <SortIcon field="Cumulative_deaths" />
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((row, index) => (
                          <TableRow key={`${row.Country_code}-${row.Date_reported}-${index}`}>
                            <TableCell className="font-medium">
                              {new Date(row.Date_reported).toLocaleDateString('id-ID', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </TableCell>
                            <TableCell>{row.Country}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{row.Country_code}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {REGION_NAMES[row.WHO_region as keyof typeof REGION_NAMES] || row.WHO_region}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {row.New_cases > 0 && (
                                <span className="text-orange-600 dark:text-orange-400 font-medium">
                                  +{row.New_cases.toLocaleString('id-ID')}
                                </span>
                              )}
                              {row.New_cases === 0 && <span className="text-muted-foreground">0</span>}
                              {row.New_cases < 0 && (
                                <span className="text-blue-600 dark:text-blue-400">
                                  {row.New_cases.toLocaleString('id-ID')}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {row.Cumulative_cases.toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell className="text-right">
                              {row.New_deaths > 0 && (
                                <span className="text-red-600 dark:text-red-400 font-medium">
                                  +{row.New_deaths.toLocaleString('id-ID')}
                                </span>
                              )}
                              {row.New_deaths === 0 && <span className="text-muted-foreground">0</span>}
                              {row.New_deaths < 0 && (
                                <span className="text-blue-600 dark:text-blue-400">
                                  {row.New_deaths.toLocaleString('id-ID')}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {row.Cumulative_deaths.toLocaleString('id-ID')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length.toLocaleString('id-ID')} data
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      {/* Page numbers */}
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default function DataExplorer() {
  return (
    <FilterProvider>
      <DataExplorerContent />
    </FilterProvider>
  );
}
