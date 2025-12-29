# Panduan Fitur Filter Dashboard COVID-19

## Fitur Filter yang Telah Diimplementasikan

### 1. **Filter Tanggal (Date Range)**
- **Lokasi**: FilterBar di bagian atas dashboard
- **Fungsi**: Memfilter data berdasarkan rentang tanggal
- **Cara Penggunaan**:
  - Klik tombol tanggal di FilterBar
  - Pilih tanggal mulai (from) dan tanggal akhir (to)
  - Filter akan otomatis diterapkan pada semua komponen
- **Efek**: 
  - KPI Cards menampilkan statistik dari rentang tanggal yang dipilih
  - Chart dan tabel menyesuaikan dengan periode yang dipilih

### 2. **Filter Wilayah WHO**
- **Lokasi**: FilterBar di bagian atas dashboard
- **Fungsi**: Memfilter data berdasarkan wilayah WHO
- **Pilihan**:
  - Semua Wilayah
  - AFR - Africa
  - AMR - Americas
  - EMR - Eastern Mediterranean
  - EUR - Europe
  - SEAR - South-East Asia
  - WPR - Western Pacific
- **Cara Penggunaan**:
  - Klik dropdown "Pilih Wilayah WHO"
  - Pilih wilayah yang diinginkan
  - Filter otomatis diterapkan
- **Efek**: Semua data (KPI, chart, tabel) hanya menampilkan data dari wilayah yang dipilih

### 3. **Filter Tipe Data**
- **Lokasi**: FilterBar di bagian atas dashboard
- **Fungsi**: Memfilter berdasarkan tipe penyakit (untuk pengembangan future)
- **Pilihan**:
  - COVID-19
  - Dengue (untuk future development)
  - Semua
- **Note**: Saat ini hanya COVID-19 yang tersedia di dataset

### 4. **Filter Rentang Waktu Chart (Time Range Selector)**
- **Lokasi**: Di dalam komponen "Tren Kasus Harian"
- **Fungsi**: Mengubah periode tampilan chart tren
- **Pilihan**:
  - 1 Bulan: Menampilkan data harian 30 hari terakhir
  - 3 Bulan: Menampilkan data per bulan 3 bulan terakhir
  - 6 Bulan: Menampilkan data per bulan 6 bulan terakhir (default)
  - 1 Tahun: Menampilkan data per bulan 1 tahun terakhir
  - Semua: Menampilkan seluruh data yang tersedia
- **Cara Penggunaan**:
  - Klik tombol rentang waktu di atas chart
  - Chart akan langsung berubah sesuai periode yang dipilih
- **Efek**: Chart "Tren Kasus Harian" menyesuaikan tampilan sesuai periode

### 5. **Filter Wilayah di Chart Distribusi**
- **Lokasi**: Di dalam komponen "Distribusi Kasus per Wilayah"
- **Fungsi**: Memilih wilayah mana saja yang ingin ditampilkan di pie chart
- **Cara Penggunaan**:
  - Centang/uncheck checkbox wilayah di atas pie chart
  - Bisa memilih satu atau lebih wilayah
  - Chart akan langsung update menampilkan wilayah yang dipilih
- **Pilihan Checkbox**:
  - ☑ Africa
  - ☑ Americas
  - ☑ E. Mediterranean
  - ☑ Europe
  - ☑ S-E Asia
  - ☑ W. Pacific
- **Efek**: Pie chart hanya menampilkan distribusi dari wilayah yang dicentang

### 6. **Filter pada Data Table**
- **Lokasi**: Komponen "Data Rinci (Live)"
- **Fungsi**: Tabel secara otomatis menampilkan data yang sudah terfilter
- **Efek**: 
  - Menampilkan top 10 negara dengan kasus tertinggi
  - Data disesuaikan dengan filter tanggal dan wilayah yang aktif
  - Sortir otomatis dari kasus tertinggi ke terendah

## Cara Kerja Sistem Filter

### Architecture
1. **FilterContext**: Global state management untuk semua filter
2. **useFilters Hook**: Custom hook untuk mengakses dan mengubah filter
3. **useCovidData Hook**: Menerima filter dan memproses data sesuai filter

### Flow Data
```
FilterBar (UI) 
  ↓
FilterContext (State Management)
  ↓
useCovidData Hook (Data Processing)
  ↓
Charts & Tables (Display)
```

### Auto-Apply Filter
- Semua filter diterapkan secara **otomatis** dan **real-time**
- Tidak perlu tombol "Terapkan Filter" - langsung update saat filter berubah
- Semua komponen (KPI Cards, Charts, Tables) tersinkronisasi dengan filter yang sama

## Komponen yang Terpengaruh Filter

### 1. KPI Cards
- Total Kasus Terkonfirmasi
- Total Kematian
- Total Sembuh (estimasi)
- Tingkat Kematian (CFR)
- Trend (perbandingan 7 hari terakhir)

### 2. Tren Kasus Harian Chart
- Menampilkan data sesuai filter tanggal dan wilayah
- Rentang waktu dapat disesuaikan dengan time range selector
- Menampilkan kasus baru dan kematian baru

### 3. Distribusi Kasus per Wilayah Chart
- Menampilkan distribusi berdasarkan filter tanggal
- Wilayah dapat dipilih melalui checkbox
- Pie chart update secara real-time

### 4. Kasus Berdasarkan Kelompok Usia Chart
- Estimasi distribusi usia berdasarkan pola WHO
- Menyesuaikan dengan total kasus yang terfilter

### 5. Data Rinci (Live) Table
- Top 10 negara dengan kasus tertinggi
- Data disesuaikan dengan semua filter aktif
- Menampilkan: tanggal, kode negara, negara, wilayah WHO, kasus baru, total kasus, kematian baru, total kematian

## Tips Penggunaan

1. **Reset Filter**: Refresh halaman untuk mereset semua filter ke default
2. **Kombinasi Filter**: Gunakan kombinasi filter untuk analisis spesifik
   - Contoh: Pilih wilayah "EUR" + rentang tanggal "Jan 2020 - Dec 2020" untuk melihat kasus COVID-19 di Eropa tahun 2020
3. **Chart Time Range**: Gunakan time range yang berbeda untuk melihat pola:
   - 1 Bulan: Untuk melihat tren harian detail
   - 6 Bulan - 1 Tahun: Untuk melihat pola musiman
   - Semua: Untuk melihat evolusi pandemi dari awal
4. **Region Selection**: Pilih beberapa wilayah untuk membandingkan distribusi kasus

## Technical Details

### Filter State Structure
```typescript
{
  dateRange: { from: Date, to: Date },
  region: 'all' | 'AFR' | 'AMR' | 'EMR' | 'EUR' | 'SEAR' | 'WPR',
  dataType: 'covid' | 'dengue' | 'all',
  chartTimeRange: '1m' | '3m' | '6m' | '1y' | 'all',
  selectedRegions: ['AFR', 'AMR', 'EMR', 'EUR', 'SEAR', 'WPR']
}
```

### Performance
- Data filtering dilakukan di client-side
- Menggunakan React hooks untuk optimasi re-render
- Context API untuk state management yang efisien

## Future Enhancements
- Export filtered data to CSV/Excel
- Save filter presets
- URL-based filters untuk sharing
- Advanced filters (negara spesifik, range kasus, dll)
- Date comparison (membandingkan periode yang berbeda)
