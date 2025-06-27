'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Download, Loader2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Report } from '@/store/reports';

interface ReportForm {
  title: string;
  type: Report['type'];
  dateFrom: string;
  dateTo: string;
  dataImportance: Report['dataImportance'];
  includeCharts: boolean;
}

interface ReportsSectionProps {
  reports: Report[];
  reportForm: ReportForm;
  isGenerating: boolean;
  onReportFormChange: (form: ReportForm) => void;
  onGenerateReport: () => void;
  onPreviewReport: (report: Report) => void;
  onDownloadClick: (reportId: string) => void;
}

export function ReportsSection({
  reports,
  reportForm,
  isGenerating,
  onReportFormChange,
  onGenerateReport,
  onPreviewReport,
  onDownloadClick
}: ReportsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 6;

  const handleFormReset = () => {
    onReportFormChange({
      title: '',
      type: 'complete',
      dateFrom: '',
      dateTo: '',
      dataImportance: 'usuarios_registrados',
      includeCharts: true
    });
  };

  // Lógica de paginación
  const { paginatedReports, totalPages, startIndex, endIndex } = useMemo(() => {
    const total = Math.ceil(reports.length / reportsPerPage);
    const start = (currentPage - 1) * reportsPerPage;
    const end = start + reportsPerPage;
    const paginated = reports.slice(start, end);
    
    return {
      paginatedReports: paginated,
      totalPages: total,
      startIndex: start + 1,
      endIndex: Math.min(end, reports.length)
    };
  }, [reports, currentPage, reportsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con título */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Generar informes</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Crea reportes detallados de las métricas de la plataforma
        </p>
      </div>

      {/* Formulario principal */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid gap-6">
            {/* ¿Qué tipo de informe desea? */}
            <div className="space-y-2">
              <Label className="text-base font-medium">¿Qué tipo de informe desea?</Label>
              <Select 
                value={reportForm.type} 
                onValueChange={(value) => onReportFormChange({...reportForm, type: value as Report['type']})}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Completo</SelectItem>
                  <SelectItem value="performance">Desempeño</SelectItem>
                  <SelectItem value="users">Usuarios</SelectItem>
                  <SelectItem value="content">Contenido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Período */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Período</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Desde</Label>
                  <Input
                    type="date"
                    value={reportForm.dateFrom}
                    onChange={(e) => onReportFormChange({...reportForm, dateFrom: e.target.value})}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Hasta</Label>
                  <Input
                    type="date"
                    value={reportForm.dateTo}
                    onChange={(e) => onReportFormChange({...reportForm, dateTo: e.target.value})}
                    max={new Date().toISOString().split('T')[0]}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* ¿Qué datos son de importancia? */}
            <div className="space-y-2">
              <Label className="text-base font-medium">¿Qué datos son de importancia?</Label>
              <Select 
                value={reportForm.dataImportance} 
                onValueChange={(value) => onReportFormChange({...reportForm, dataImportance: value as Report['dataImportance']})}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuarios_registrados">Usuarios registrados en el último mes</SelectItem>
                  <SelectItem value="tiempo_web">Tiempo en la web</SelectItem>
                  <SelectItem value="vistas_usuario">Vistas de usuario</SelectItem>
                  <SelectItem value="contenido_tendencia">Contenido en tendencia</SelectItem>
                  <SelectItem value="retención_usuarios">Retención de usuarios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Checkbox para incluir gráficos */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCharts"
                checked={reportForm.includeCharts}
                onCheckedChange={(checked) => onReportFormChange({...reportForm, includeCharts: checked as boolean})}
              />
              <Label htmlFor="includeCharts" className="text-base font-medium cursor-pointer">
                Incluir gráficos en el informe
              </Label>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={handleFormReset}
                className="px-8"
              >
                Cancelar
              </Button>
              <Button 
                onClick={onGenerateReport} 
                disabled={!reportForm.dateFrom || !reportForm.dateTo || isGenerating}
                className="px-8"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  'Generar informe'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informes Anteriores */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Informes anteriores</h3>
            {reports.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Mostrando {startIndex}-{endIndex} de {reports.length} informes
              </p>
            )}
          </div>
          
          {/* Navegación de páginas en el header */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="h-8 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-8 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Grid de informes responsive */}
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No hay informes disponibles
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Genera tu primer informe para verlo aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {paginatedReports.map((report) => (
            <Card key={report.id} className="relative group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {/* Header del informe */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-sm">
                          {report.type === 'complete' ? 'Completo' : 
                           report.type === 'performance' ? 'Desempeño' : 
                           report.type === 'users' ? 'Usuarios' : 
                           'Contenido'}
                        </h4>
                        <Badge 
                          variant={report.status === 'ready' ? 'default' : report.status === 'generating' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {report.status === 'ready' ? 'Listo' : report.status === 'generating' ? 'Generando' : 'Error'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(report.generatedAt, 'dd/MM/yy')}
                      </p>
                      {/* Mostrar si incluye gráficos */}
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs text-gray-400">
                          {report.includeCharts ? '📊 Con gráficos' : '📄 Solo texto'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex items-center space-x-1">
                      {report.status === 'ready' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onPreviewReport(report)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onDownloadClick(report.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {report.status === 'generating' && (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      )}
                    </div>
                  </div>

                  {/* Contenido del informe */}
                  <div className="text-sm space-y-2">
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                      {report.type === 'complete' || report.type === 'users' ? (
                        report.dataImportance === 'usuarios_registrados' ? 
                        'Durante el mes pasado, se registraron 2,000 nuevos usuarios en la plataforma, lo que marca un crecimiento del 15% respecto al mes anterior. Un análisis demográfico muestra que el 40% de los nuevos registros corresponde...' :
                        'A lo largo del último mes, se registraron 1,800 nuevos usuarios en la plataforma, lo que representa un aumento del 20% en comparación con el mes anterior.'
                      ) : (
                        'En el presente informe, se analizarán las métricas de visitas a nuestra plataforma web durante el período de [fecha de inicio] a [fecha de finalización]. Este análisis proporciona una visión comprensiva del comportamiento de los usuarios y el rendimiento general del sitio.'
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* Navegación de páginas en el footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1"
            >
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 