import { Calendar, MapPin, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useFilters } from "@/contexts/FilterContext";
import { DateRange } from "react-day-picker";
import { useState } from "react";

export function FilterBar() {
  const { filters, setDateRange, setRegion, setDataType } = useFilters();
  const [month, setMonth] = useState<Date>(filters.dateRange?.from || new Date(2020, 0));
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(filters.dateRange?.from);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(filters.dateRange?.to);
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Generate years from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = new Date(month.getFullYear(), parseInt(monthIndex));
    setMonth(newMonth);
  };

  const handleYearChange = (year: string) => {
    const newMonth = new Date(parseInt(year), month.getMonth());
    setMonth(newMonth);
  };

  const goToPreviousMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (isSelectingStart) {
      setTempStartDate(date);
      setIsSelectingStart(false);
    } else {
      setTempEndDate(date);
    }
  };

  const handleApplyDates = () => {
    if (tempStartDate && tempEndDate) {
      let startDate = tempStartDate;
      let endDate = tempEndDate;

      // Ensure start date is before end date
      if (startDate > endDate) {
        [startDate, endDate] = [endDate, startDate];
      }

      // Check if range exceeds 2 years (730 days)
      const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff > 730) {
        toast.error('Rentang tanggal terlalu besar', {
          description: 'Maksimal rentang tanggal adalah 2 tahun (730 hari). Silakan pilih rentang yang lebih kecil.',
          duration: 4000,
        });
        return;
      }

      setDateRange({ from: startDate, to: endDate });
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    // Reset to default date range (last 2 years)
    const defaultEnd = new Date();
    const defaultStart = new Date();
    defaultStart.setFullYear(defaultEnd.getFullYear() - 2);

    setTempStartDate(defaultStart);
    setTempEndDate(defaultEnd);
    setIsSelectingStart(true);
    setMonth(defaultStart);

    // Apply the default dates immediately
    setDateRange({ from: defaultStart, to: defaultEnd });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg bg-card p-4 border">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "dd MMM yyyy", { locale: id })} -{" "}
                    {format(filters.dateRange.to, "dd MMM yyyy", { locale: id })}
                  </>
                ) : (
                  format(filters.dateRange.from, "dd MMM yyyy", { locale: id })
                )
              ) : (
                <span>Pilih Rentang Tanggal</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover" align="start">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between gap-2 mb-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={goToPreviousMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-2">
                  <Select
                    value={month.getMonth().toString()}
                    onValueChange={handleMonthChange}
                  >
                    <SelectTrigger className="w-[120px] h-7">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {months.map((m, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={month.getFullYear().toString()}
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="w-[90px] h-7">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={goToNextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-3 border-b bg-muted/50">
              <div className="flex gap-2 mb-2">
                <Button
                  variant={isSelectingStart ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsSelectingStart(true)}
                  className="flex-1"
                >
                  Mulai: {tempStartDate ? format(tempStartDate, "dd/MM/yyyy") : "Pilih"}
                </Button>
                <Button
                  variant={!isSelectingStart ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsSelectingStart(false)}
                  className="flex-1"
                >
                  Selesai: {tempEndDate ? format(tempEndDate, "dd/MM/yyyy") : "Pilih"}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {isSelectingStart ? "👆 Pilih tanggal mulai" : "👆 Pilih tanggal selesai"}
              </div>
            </div>

            <CalendarComponent
              mode="range"
              month={month}
              onMonthChange={setMonth}
              selected={tempStartDate && tempEndDate ? { from: tempStartDate, to: tempEndDate } : undefined}
              onSelect={(range) => {
                if (!range) return;

                if (isSelectingStart) {
                  // Selecting start date
                  if ('from' in range && range.from) {
                    setTempStartDate(range.from);
                    setIsSelectingStart(false); // Auto switch to end date selection
                  }
                } else {
                  // Selecting end date
                  if ('to' in range && range.to) {
                    setTempEndDate(range.to);
                  } else if ('from' in range && range.from) {
                    setTempEndDate(range.from);
                  }
                }
              }}
              numberOfMonths={2}
              locale={id}
              className="pointer-events-auto"
            />

            <div className="p-3 border-t flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleApplyDates}
                disabled={!tempStartDate || !tempEndDate}
                className="flex-1 bg-primary hover:bg-primary-dark"
              >
                Terapkan
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <Select value={filters.region} onValueChange={setRegion}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Pilih Wilayah WHO" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">Semua Wilayah</SelectItem>
            <SelectItem value="AFR">AFR - Africa</SelectItem>
            <SelectItem value="AMR">AMR - Americas</SelectItem>
            <SelectItem value="EMR">EMR - Eastern Mediterranean</SelectItem>
            <SelectItem value="EUR">EUR - Europe</SelectItem>
            <SelectItem value="SEAR">SEAR - South-East Asia</SelectItem>
            <SelectItem value="WPR">WPR - Western Pacific</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <Select value={filters.dataType} onValueChange={setDataType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipe Data" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="covid">COVID-19</SelectItem>
            <SelectItem value="dengue">Dengue</SelectItem>
            <SelectItem value="all">Semua</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="ml-auto text-sm text-muted-foreground">
        Filter aktif diterapkan secara otomatis
      </div>
    </div>
  );
}
