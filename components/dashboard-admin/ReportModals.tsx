'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Report, ReportFormat } from '@/store/reports';

interface ReportModalsProps {
  // Vista previa
  showPreview: boolean;
  currentReport: Report | null;
  onPreviewClose: () => void;
  
  // Selección de formato
  showFormatDialog: boolean;
  selectedFormat: ReportFormat | '';
  onFormatChange: (format: ReportFormat) => void;
  onFormatDialogClose: () => void;
  onConfirmDownload: () => void;
  
  // Éxito
  showSuccessDialog: boolean;
  onSuccessClose: () => void;
  
  // Acciones
  onDownloadClick: (reportId: string) => void;
}

export function ReportModals({
  showPreview,
  currentReport,
  onPreviewClose,
  showFormatDialog,
  selectedFormat,
  onFormatChange,
  onFormatDialogClose,
  onConfirmDownload,
  showSuccessDialog,
  onSuccessClose,
  onDownloadClick
}: ReportModalsProps) {
  return (
    <>
      {/* Modal de Vista Previa */}
      <Dialog open={showPreview && !!currentReport} onOpenChange={onPreviewClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Informe detallado</DialogTitle>
            <DialogDescription>
              {currentReport && currentReport.title}
            </DialogDescription>
          </DialogHeader>
          
          {currentReport && currentReport.previewData && (
            <div className="space-y-6 py-4">
              <div className="text-center">
                <h2 className="text-lg font-bold">{currentReport.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(currentReport.generatedAt, 'dd/MM/yyyy')}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Métricas de detalladas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentReport.previewData.summary.totalUsers.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Usuarios registrados en los meses del año
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {currentReport.previewData.summary.totalViews.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Roles de los usuarios
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Países con más usuarios registrados</h4>
                  <div className="space-y-2">
                    {['España', 'México', 'Argentina', 'Colombia'].map((country, index) => (
                      <div key={country} className="flex justify-between text-sm">
                        <span>{country}</span>
                        <span className="text-blue-600">{Math.floor(Math.random() * 100) + 20}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Uso de recursos</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasa asignada</span>
                      <span className="text-yellow-600">75%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tasa completada</span>
                      <span className="text-green-600">25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button onClick={() => currentReport && onDownloadClick(currentReport.id)}>
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Selección de Formato */}
      <Dialog open={showFormatDialog} onOpenChange={onFormatDialogClose}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Seleccionar formato de descarga</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={selectedFormat} onValueChange={onFormatChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>PDF</span>
                  </div>
                </SelectItem>
                <SelectItem value="png">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>PNG</span>
                  </div>
                </SelectItem>
                <SelectItem value="jpg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>JPG</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={onFormatDialogClose}>
              Cancelar
            </Button>
            <Button 
              onClick={onConfirmDownload} 
              disabled={!selectedFormat}
            >
              Descargar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={onSuccessClose}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <AlertDialogTitle>Su trabajo se ha descargado con éxito</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex justify-center">
            <AlertDialogAction onClick={onSuccessClose}>
              Aceptar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 