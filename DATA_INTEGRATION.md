# Integrasi Data COVID-19 dari CSV

## Perubahan yang Dilakukan

### 1. Hook Baru: `useCovidData`
Dibuat custom hook baru di `src/hooks/useCovidData.ts` yang:
- Membaca file CSV menggunakan library `papaparse`
- Memproses data WHO COVID-19 global
- Menghitung statistik otomatis:
  - Total kasus terkonfirmasi
  - Total kematian
  - Total sembuh (estimasi)
  - Case Fatality Rate (CFR)
  - Trend perubahan (7 hari terakhir vs 7 hari sebelumnya)

### 2. Komponen yang Diupdate

#### `src/pages/Index.tsx`
- Menggunakan `useCovidData` hook
- Menampilkan loading state saat data sedang dimuat
- Menampilkan error state jika terjadi kesalahan
- Mengirim data real-time ke semua komponen child

#### `src/components/TrendChart.tsx`
- Menerima props `data` dari parent
- Menampilkan tren kasus harian 6 bulan terakhir dari data CSV

#### `src/components/DistributionChart.tsx`
- Menerima props `data` dari parent
- Menampilkan distribusi kasus per wilayah WHO (AFR, AMR, EMR, EUR, SEAR, WPR)

#### `src/components/AgeChart.tsx`
- Menerima props `data` dari parent
- Menampilkan distribusi kasus berdasarkan kelompok usia (estimasi berdasarkan pola WHO)

#### `src/components/DataTable.tsx`
- Menerima props `data` dari parent
- Menampilkan 10 negara dengan kasus tertinggi pada tanggal terakhir

### 3. File CSV
- File `WHO-COVID-19-global-daily-data.csv` dipindahkan ke folder `public/`
- Total: 502,802 baris data
- Kolom: Date_reported, Country_code, Country, WHO_region, New_cases, Cumulative_cases, New_deaths, Cumulative_deaths

## Cara Kerja

1. Saat aplikasi dimuat, hook `useCovidData` akan:
   - Fetch file CSV dari `/WHO-COVID-19-global-daily-data.csv`
   - Parse menggunakan `papaparse`
   - Menyimpan data ke state

2. Hook menyediakan fungsi-fungsi untuk mengolah data:
   - `getStats()`: Menghitung statistik utama (KPI Cards)
   - `getTrendData()`: Mengambil data tren 6 bulan terakhir
   - `getRegionData()`: Mengambil distribusi per wilayah
   - `getAgeData()`: Mengambil distribusi per kelompok usia
   - `getTableData(limit)`: Mengambil data tabel dengan limit tertentu

3. Komponen `Index.tsx` memanggil fungsi-fungsi ini dan mengirim hasilnya sebagai props ke komponen child

## Dependencies Baru

- `papaparse`: Library untuk parsing CSV
- `@types/papaparse`: TypeScript type definitions

## Testing

Buka aplikasi di browser, dashboard akan menampilkan:
- Loading indicator saat data dimuat
- Data real-time dari CSV di semua komponen
- KPI Cards dengan nilai yang dihitung dari data actual
- Chart dan tabel dengan data dari CSV

## Notes

- Data recovered (sembuh) adalah estimasi (95% dari kasus - kematian) karena tidak tersedia di dataset WHO
- Distribusi usia adalah estimasi berdasarkan pola WHO karena tidak ada data detail per usia di dataset
- Trend dihitung berdasarkan perbandingan 7 hari terakhir vs 7 hari sebelumnya
