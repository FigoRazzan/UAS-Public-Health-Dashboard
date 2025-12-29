# Public Health Dashboard - COVID-19 Global Monitoring

<div align="center">

![Dashboard Preview](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

**Real-time COVID-19 Global Data Monitoring & Analytics Platform with RBAC**

[Report Bug](https://github.com/FigoRazzan/UAS-Public-Health-Dashboard/issues) • [Request Feature](https://github.com/FigoRazzan/UAS-Public-Health-Dashboard/issues)

</div>

---

## 📋 Tentang Proyek

**Public Health Dashboard** adalah aplikasi web interaktif untuk memantau dan menganalisis data COVID-19 global secara real-time. Dashboard ini menyediakan visualisasi komprehensif terhadap tren kasus harian, distribusi regional, demografi umur, dan statistik kematian dari data resmi WHO (World Health Organization).

Proyek ini dikembangkan sebagai bagian dari mata kuliah **FB-499 INFORMATIKA TERAPAN BB** di Institut Teknologi Nasional (ITENAS) Bandung.

### 🎯 Fitur Utama

- **� Authentication & Authorization**
  - Sistem login/register dengan Supabase Auth
  - Role-Based Access Control (RBAC): Admin & Public User
  - Protected routes dengan middleware
  - Session management & auto-refresh

- **👨‍💼 Admin Panel**
  - CSV upload untuk update data COVID-19
  - Audit logs untuk tracking aktivitas admin
  - User management & role assignment
  - Data source management

- **�📊 Visualisasi Data Interaktif**
  - Tren kasus harian per wilayah dengan line chart
  - Distribusi kasus per wilayah WHO dengan pie chart
  - Analisis demografis berdasarkan kelompok usia dengan bar chart
  - Tabel detail data negara dengan sorting & pagination

- **🔍 Sistem Filter Canggih**
  - Filter rentang tanggal dengan date picker interaktif (max 2 tahun)
  - Filter berdasarkan 6 wilayah WHO (Afrika, Amerika, Eropa, dll)
  - Time range selector (1 bulan, 3 bulan, 6 bulan, 1 tahun, semua)
  - Multi-mode visualization (per wilayah atau agregat)

- **⚡ Performa Optimal**
  - Supabase PostgreSQL untuk data storage
  - Server-side filtering & aggregation
  - Responsive design untuk semua device
  - Framer Motion untuk smooth animations

- **📈 KPI Dashboard**
  - Total kasus terkonfirmasi
  - Total kematian dengan CFR (Case Fatality Rate)
  - Tingkat kesembuhan
  - Trend analysis 7 hari terakhir

## 👥 Tim Pengembang

Proyek ini dikembangkan oleh mahasiswa Informatika ITENAS:

<table>
<thead>
<tr>
<th>NRP</th>
<th>Nama</th>
<th>Role</th>
</tr>
</thead>
<tbody>
<tr>
<td>15-2022-044</td>
<td>Dimas Bratakusumah</td>
<td>Project Lead / Health Informatics Analyst</td>
</tr>
<tr>
<td>15-2022-064</td>
<td>Muhammad Figo Razzan Fadillah</td>
<td>Application Developer / Data Engineer</td>
</tr>
<tr>
<td>15-2022-150</td>
<td>Dian Raisa Gumilar</td>
<td>Data Analyst / Visualization Specialist</td>
</tr>
<tr>
<td>15-2022-217</td>
<td>Mochamad Ramdhan</td>
<td>System Architect / Developer</td>
</tr>
<tr>
<td>15-2022-250</td>
<td>R Jayani Maulana S</td>
<td>Public Health Data Specialist</td>
</tr>
</tbody>
</table>

**Mata Kuliah:** FB-499 INFORMATIKA TERAPAN BB  
**Institusi:** Institut Teknologi Nasional (ITENAS) Bandung  
**Tahun Akademik:** 2024/2025

## 📊 Sumber Data

Dashboard menggunakan dataset resmi dari:

- **Dataset:** WHO COVID-19 Global Daily Data
- **Sumber:** World Health Organization (WHO)
- **Storage:** Supabase PostgreSQL Database
- **Jumlah Records:** 500,000+ rows
- **Periode:** 1 Januari 2020 - 31 Desember 2024
- **Update:** Admin dapat upload CSV untuk update data

**Data Coverage:**
- 6 Wilayah WHO (AFR, AMR, EMR, EUR, SEAR, WPR)
- 200+ negara dan teritorial
- Data harian: kasus baru, kematian, kasus kumulatif
- Metadata: kode negara, tanggal pelaporan

## 🛠️ Teknologi yang Digunakan

### Backend & Database
- **Supabase** - Backend as a Service (BaaS)
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Database security
- **Supabase Auth** - Authentication system

### Frontend Framework & Library
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.3.1** - Build tool & dev server
- **React Router 6.26.2** - Client-side routing

### UI Components & Styling
- **Shadcn/ui** - Komponen UI modern
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Data Visualization
- **Recharts 2.14.1** - Chart library untuk visualisasi
- **TanStack React Query 5.59.16** - Data fetching & caching

### Data Processing
- **Papaparse 5.4.1** - CSV parsing
- **Date-fns 4.1.0** - Date manipulation

### State Management
- **React Context API** - Global state management
- **React Hooks (useMemo, useEffect)** - Performance optimization

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Instalasi & Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** atau **bun** package manager
- **Git**
- **Supabase Account** (untuk database)

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/FigoRazzan/UAS-Public-Health-Dashboard.git

# 2. Masuk ke direktori proyek
cd UAS-Public-Health-Dashboard

# 3. Install dependencies
npm install
# atau dengan bun
bun install

# 4. Setup environment variables
# Buat file .env dan isi dengan:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 5. Jalankan development server
npm run dev
# atau dengan bun
bun dev

# 6. Buka browser di http://localhost:8080
```

### Setup Supabase Database

1. **Create Supabase Project**
2. **Run SQL Migration** (lihat `backend/schema.sql`)
3. **Enable Row Level Security (RLS)**
4. **Setup Auth Policies**
5. **Upload initial CSV data via Admin Panel**

### Build untuk Production

```bash
# Build aplikasi
npm run build

# Preview build
npm run preview
```

## 📱 Cara Menggunakan

### 1. **Authentication**
   - Register akun baru atau login
   - Default role: Public User
   - Admin dapat assign role via database

### 2. **Filter Data**
   - Pilih rentang tanggal (max 2 tahun)
   - Pilih wilayah WHO (atau "Semua Wilayah")
   - Klik tombol Reset untuk kembali ke default

### 3. **Analisis Tren**
   - Gunakan time range selector (1m, 3m, 6m, 1y, all)
   - Hover pada chart untuk detail data
   - Chart akan update otomatis sesuai filter

### 4. **Admin Features** (Admin only)
   - Upload CSV untuk update data
   - View audit logs
   - Manage data sources

## 🎨 Fitur Visualisasi

### 1. Tren Kasus Harian per Wilayah
- **Multi-region mode:** 6 garis berbeda per wilayah
- **Single-region mode:** 2 garis (kasus & kematian)
- **Color coding:** Setiap wilayah punya warna unik
- **Format:** K (ribuan) dan M (jutaan)

### 2. Distribusi Kasus per Wilayah
- **Pie chart** dengan percentage
- **Smart labeling:** Hanya tampilkan label > 5%
- **Interactive tooltip** dengan format ribuan
- **Legend** untuk semua wilayah

### 3. Kasus Berdasarkan Kelompok Usia
- **Stacked bar chart** untuk multi-region
- **Single bar chart** untuk region spesifik
- **5 kelompok usia:** 0-17, 18-30, 31-45, 46-60, 60+
- **Color coding** konsisten per wilayah

### 4. KPI Cards
- **Real-time metrics** dengan trend indicator
- **Percentage change** 7 hari terakhir
- **CFR calculation** (Case Fatality Rate)
- **Icon indicators** untuk visual clarity

## 🔧 Struktur Proyek

```
UAS-Public-Health-Dashboard/
├── public/
│   ├── Foto/                        # Team profile photos
│   └── robots.txt
├── src/
│   ├── components/                  # React components
│   │   ├── ui/                      # Shadcn UI components
│   │   ├── AdminPanel.tsx           # Admin CSV upload
│   │   ├── AgeChart.tsx             # Bar chart kelompok usia
│   │   ├── DataTable.tsx            # Tabel data negara
│   │   ├── DashboardHeader.tsx      # Header with user menu
│   │   ├── DistributionChart.tsx    # Pie chart distribusi
│   │   ├── FilterBar.tsx            # Komponen filter
│   │   ├── KPICard.tsx              # KPI metrics card
│   │   ├── TeamMemberCard.tsx       # Team member card
│   │   └── TrendChart.tsx           # Line chart tren
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Authentication state
│   │   ├── FilterContext.tsx        # Global filter state
│   │   └── ThemeContext.tsx         # Theme (dark/light)
│   ├── hooks/
│   │   └── useCovidDataSupabase.ts  # Supabase data fetching
│   ├── lib/
│   │   └── utils.ts                 # Helper functions
│   ├── pages/
│   │   ├── Index.tsx                # Dashboard utama
│   │   ├── Landing.tsx              # Landing page
│   │   ├── Login.tsx                # Login page
│   │   ├── Register.tsx             # Register page
│   │   ├── AuditLogs.tsx            # Admin audit logs
│   │   ├── DataExplorer.tsx         # Data exploration
│   │   ├── Pengaturan.tsx           # Settings page
│   │   └── SumberData.tsx           # Data source info
│   ├── services/
│   │   ├── adminService.ts          # Admin operations
│   │   └── covidDataService.ts      # COVID data operations
│   ├── App.tsx                      # Root component
│   └── main.tsx                     # Entry point
├── backend/
│   └── schema.sql                   # Supabase database schema
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🌟 Highlight Teknis

### 1. **Role-Based Access Control (RBAC)**
```typescript
// Row Level Security di Supabase
CREATE POLICY "Public users can read data"
ON covid_data FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can insert data"
ON covid_data FOR INSERT
TO authenticated
USING (is_admin());
```

### 2. **Authentication Flow**
```typescript
// Login dengan Supabase Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

// Auto-refresh session
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') setUser(session?.user);
});
```

### 3. **Performance Optimization**
```typescript
// Memoization untuk avoid re-calculation
const filteredData = useMemo(() => {
  return data.filter(/* ... */);
}, [data, filters]);
```

### 4. **Dynamic Visualization**
```typescript
// Chart berubah berdasarkan filter
{showMultiRegion ? (
  regions.map(region => <Line dataKey={`${region}_cases`} />)
) : (
  <Line dataKey="kasusHarian" />
)}
```

## � Security Features

- **Row Level Security (RLS)** - Database-level access control
- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Client-side route protection
- **Audit Logging** - Track all admin actions
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization

## 🤝 Kontribusi

Kontribusi sangat diterima! Untuk kontribusi major:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Kontak

**Repository:** [github.com/FigoRazzan/UAS-Public-Health-Dashboard](https://github.com/FigoRazzan/UAS-Public-Health-Dashboard)

**Institusi:** Institut Teknologi Nasional (ITENAS) Bandung

---

<div align="center">

**Dibuat dengan ❤️ oleh Tim Informatika ITENAS**

*Untuk Mata Kuliah FB-499 INFORMATIKA TERAPAN BB*

</div>
