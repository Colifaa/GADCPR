'use client';

import React, { useEffect, useState } from 'react';
import { DashboardAdminLayout } from '@/components/layout/DashboardAdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminStore } from '@/store/admin';
import { useMetricsStore } from '@/store/metrics';
import { useReportsStore, Report, ReportFormat } from '@/store/reports';
import { BarChart3, Globe, FileText, Users } from 'lucide-react';

// Importar los componentes modulares
import { SystemStatsCards } from '@/components/dashboard-admin/SystemStatsCards';
import { WebUsageChart } from '@/components/dashboard-admin/WebUsageChart';
import { UserViewsChart } from '@/components/dashboard-admin/UserViewsChart';
import { ContentAnalysisCards } from '@/components/dashboard-admin/ContentAnalysisCards';
import { UserAnalysisCharts } from '@/components/dashboard-admin/UserAnalysisCharts';
import { ReportsSection } from '@/components/dashboard-admin/ReportsSection';
import { ReportModals } from '@/components/dashboard-admin/ReportModals';

interface ReportForm {
  title: string;
  type: Report['type'];
  dateFrom: string;
  dateTo: string;
  dataImportance: Report['dataImportance'];
  includeCharts: boolean;
}

export default function AdminPage() {
  const { systemStats } = useAdminStore();
  const { 
    webUsage, 
    userViews, 
    trendingTopics, 
    leastVisitedTopics, 
    platformStats, 
    recentUsers, 
    userRetention, 
    userActivity, 
    fetchMetrics,
    updateTimeRange 
  } = useMetricsStore();
  
  const { 
    reports, 
    currentReport, 
    isGenerating, 
    generateReport, 
    downloadReport, 
    deleteReport, 
    setCurrentReport 
  } = useReportsStore();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [showPreview, setShowPreview] = useState(false);
  const [showFormatDialog, setShowFormatDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat | ''>('');
  
  // Estados del formulario de reporte
  const [reportForm, setReportForm] = useState<ReportForm>({
    title: '',
    type: 'complete',
    dateFrom: '',
    dateTo: '',
    dataImportance: 'usuarios_registrados',
    includeCharts: true
  });

  // Configuración de gráficos
  const chartConfig = {
    timeSpent: {
      label: "Tiempo (min)",
      color: "#3b82f6",
    },
    sessions: {
      label: "Sesiones",
      color: "#8b5cf6",
    },
    views: {
      label: "Vistas",
      color: "#06b6d4",
    },
    uniqueVisitors: {
      label: "Visitantes únicos",
      color: "#10b981",
    },
    registrations: {
      label: "Registros",
      color: "#f59e0b",
    },
    verified: {
      label: "Verificados",
      color: "#22c55e",
    },
    retention: {
      label: "Retención (%)",
      color: "#ef4444",
    },
    active: {
      label: "Usuarios activos",
      color: "#8b5cf6",
    },
  };

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d') => {
    setTimeRange(range);
    updateTimeRange(range);
  };

  const handleGenerateReport = async () => {
    if (!reportForm.dateFrom || !reportForm.dateTo) return;
    
    // Generar título automáticamente
    const typeNames = {
      complete: 'Completo',
      performance: 'Desempeño',
      users: 'Usuarios',
      content: 'Contenido'
    };
    
    const fromDate = new Date(reportForm.dateFrom);
    const toDate = new Date(reportForm.dateTo);
    const autoTitle = `Informe ${typeNames[reportForm.type]} - ${fromDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`;
    
    await generateReport({
      title: autoTitle,
      type: reportForm.type,
      dateRange: {
        from: reportForm.dateFrom,
        to: reportForm.dateTo,
      },
      dataImportance: reportForm.dataImportance,
      includeCharts: reportForm.includeCharts,
    });
    
    // Resetear el formulario
    setReportForm({
      title: '',
      type: 'complete',
      dateFrom: '',
      dateTo: '',
      dataImportance: 'usuarios_registrados',
      includeCharts: true
    });
  };

  const handlePreviewReport = (report: Report) => {
    setCurrentReport(report);
    setShowPreview(true);
  };

  const handleDownloadClick = (reportId: string) => {
    setSelectedReportId(reportId);
    setSelectedFormat('');
    setShowFormatDialog(true);
  };

  const handleConfirmDownload = async () => {
    if (selectedFormat && selectedReportId) {
      await downloadReport(selectedReportId, selectedFormat);
      setShowFormatDialog(false);
      setShowSuccessDialog(true);
      setSelectedFormat('');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    setShowPreview(false);
  };

  return (
    <DashboardAdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span>Métricas Avanzadas</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Analiza las métricas detalladas de la plataforma y genera informes
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="reports">Informes</TabsTrigger>
          </TabsList>

          {/* Tab de Métricas */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="flex justify-end">
              <div className="flex space-x-2">
                {(['7d', '30d', '90d'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeRangeChange(range)}
                  >
                    {range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
                  </Button>
                ))}
              </div>
            </div>

            {/* System Stats - Resumen rápido */}
            <SystemStatsCards systemStats={systemStats} />

            {/* Estadísticas Generales */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Estadísticas Generales</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <WebUsageChart data={webUsage} chartConfig={chartConfig} />
                <UserViewsChart data={userViews} chartConfig={chartConfig} />
              </div>
            </div>

            {/* Contenido */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Análisis de Contenido</h2>
              </div>
              
              <ContentAnalysisCards 
                trendingTopics={trendingTopics}
                leastVisitedTopics={leastVisitedTopics}
                platformStats={platformStats}
                chartConfig={chartConfig}
              />
            </div>

            {/* Usuarios */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Análisis de Usuarios</h2>
              </div>
              
              <UserAnalysisCharts 
                recentUsers={recentUsers}
                userRetention={userRetention}
                userActivity={userActivity}
                chartConfig={chartConfig}
              />
            </div>
          </TabsContent>

          {/* Tab de Informes */}
          <TabsContent value="reports" className="space-y-6">
            <ReportsSection
              reports={reports}
              reportForm={reportForm}
              isGenerating={isGenerating}
              onReportFormChange={setReportForm}
              onGenerateReport={handleGenerateReport}
              onPreviewReport={handlePreviewReport}
              onDownloadClick={handleDownloadClick}
            />
          </TabsContent>
        </Tabs>

        {/* Modales */}
        <ReportModals
          showPreview={showPreview}
          currentReport={currentReport}
          onPreviewClose={() => setShowPreview(false)}
          showFormatDialog={showFormatDialog}
          selectedFormat={selectedFormat}
          onFormatChange={(format) => setSelectedFormat(format)}
          onFormatDialogClose={() => setShowFormatDialog(false)}
          onConfirmDownload={handleConfirmDownload}
          showSuccessDialog={showSuccessDialog}
          onSuccessClose={handleSuccessClose}
          onDownloadClick={handleDownloadClick}
        />
      </div>
    </DashboardAdminLayout>
  );
}