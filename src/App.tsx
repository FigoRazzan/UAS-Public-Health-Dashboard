import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import DataExplorer from "./pages/DataExplorer";
import SumberData from "./pages/SumberData";
import Pengaturan from "./pages/Pengaturan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/data" element={
                <ProtectedRoute>
                  <DataExplorer />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/sumber" element={
                <ProtectedRoute>
                  <SumberData />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/pengaturan" element={
                <ProtectedRoute>
                  <Pengaturan />
                </ProtectedRoute>
              } />

              {/* Redirect old routes to new dashboard routes */}
              <Route path="/data" element={<Navigate to="/dashboard/data" replace />} />
              <Route path="/sumber" element={<Navigate to="/dashboard/sumber" replace />} />
              <Route path="/pengaturan" element={<Navigate to="/dashboard/pengaturan" replace />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
