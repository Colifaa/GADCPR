import { create } from 'zustand';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useMetricsStore } from './metrics';

export interface Report {
  id: string;
  title: string;
  type: 'performance' | 'users' | 'content' | 'complete';
  dateRange: {
    from: string;
    to: string;
  };
  dataImportance: 'usuarios_registrados' | 'tiempo_web' | 'vistas_usuario' | 'contenido_tendencia' | 'retención_usuarios';
  includeCharts: boolean;
  generatedAt: Date;
  status: 'generating' | 'ready' | 'error';
  previewData?: {
    summary: {
      totalUsers: number;
      totalViews: number;
      avgTimeSpent: number;
      topContent: string;
    };
    chartData: any[];
  };
}

export type ReportFormat = 'pdf' | 'png' | 'jpg';

interface ReportsState {
  reports: Report[];
  currentReport: Report | null;
  isGenerating: boolean;
  
  // Actions
  generateReport: (reportData: Omit<Report, 'id' | 'generatedAt' | 'status'>) => Promise<void>;
  downloadReport: (reportId: string, format: ReportFormat) => Promise<void>;
  deleteReport: (reportId: string) => void;
  setCurrentReport: (report: Report | null) => void;
  getReportById: (id: string) => Report | undefined;
}

// Función para simular la generación de datos del informe
const generateReportPreviewData = (type: Report['type'], dataImportance: Report['dataImportance']) => {
  // Obtener datos actuales del store de métricas para mayor coherencia
  const metricsState = useMetricsStore.getState();
  // Datos base más coherentes según el tipo de informe
  // Usar datos reales del store de métricas cuando estén disponibles
  const totalRegistrations = metricsState.recentUsers.reduce((acc, day) => acc + day.registrations, 0);
  const totalViews = metricsState.userViews.reduce((acc, day) => acc + day.views, 0);
  const avgTimeSpent = metricsState.webUsage.reduce((acc, day) => acc + day.timeSpent, 0) / metricsState.webUsage.length;
  const topTopic = metricsState.trendingTopics[0]?.topic || 'Marketing Digital';

  let baseUsers = totalRegistrations > 0 ? totalRegistrations * 15 : 2000; // Multiplicar por factor para simular histórico
  let baseViews = totalViews > 0 ? totalViews * 5 : 15000; // Factor para simular más días
  let baseTime = avgTimeSpent > 0 ? avgTimeSpent : 45;
  let content = topTopic;

  // Ajustar datos según el tipo de importancia
  switch (dataImportance) {
    case 'usuarios_registrados':
      baseUsers = Math.floor(Math.random() * 3000) + 2000;
      baseViews = baseUsers * 7; // 7 vistas por usuario en promedio
      content = 'Registro de Usuarios';
      break;
    case 'tiempo_web':
      baseTime = Math.floor(Math.random() * 30) + 45;
      baseViews = Math.floor(Math.random() * 20000) + 15000;
      content = 'Tiempo de Permanencia';
      break;
    case 'vistas_usuario':
      baseViews = Math.floor(Math.random() * 30000) + 20000;
      baseUsers = Math.floor(baseViews / 8); // 8 vistas por usuario
      content = 'Visualización de Contenido';
      break;
    case 'contenido_tendencia':
      baseViews = Math.floor(Math.random() * 25000) + 18000;
      content = 'Tendencias de Contenido';
      break;
    case 'retención_usuarios':
      baseUsers = Math.floor(Math.random() * 2500) + 1800;
      baseViews = baseUsers * 6;
      content = 'Retención de Usuarios';
      break;
  }

  // Ajustar datos según el tipo de informe
  switch (type) {
    case 'users':
      baseUsers *= 1.2;
      content = 'Análisis de Usuarios';
      break;
    case 'content':
      baseViews *= 1.3;
      content = 'Análisis de Contenido';
      break;
    case 'performance':
      baseTime += 10;
      content = 'Rendimiento del Sistema';
      break;
  }

  const baseData = {
    summary: {
      totalUsers: Math.floor(baseUsers),
      totalViews: Math.floor(baseViews),
      avgTimeSpent: Math.floor(baseTime),
      topContent: content,
    },
    chartData: (() => {
      // Intentar usar datos reales de métricas si están disponibles
      if (metricsState.userViews.length > 0) {
        return metricsState.userViews.map((day) => ({
          date: day.date,
          value: dataImportance === 'vistas_usuario' ? day.views : 
                 dataImportance === 'usuarios_registrados' ? day.uniqueVisitors :
                 dataImportance === 'tiempo_web' ? metricsState.webUsage.find(w => w.date === day.date)?.timeSpent || baseTime :
                 day.views,
          users: day.uniqueVisitors,
          timeSpent: metricsState.webUsage.find(w => w.date === day.date)?.timeSpent || baseTime
        }));
      }
      
      // Fallback a datos generados si no hay datos de métricas
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const baseValue = Math.floor(baseViews / 30);
        const variation = Math.sin(i * 0.5) * (baseValue * 0.3);
        const randomFactor = (Math.random() - 0.5) * (baseValue * 0.2);
        
        return {
          date: date.toISOString().split('T')[0],
          value: Math.max(Math.floor(baseValue + variation + randomFactor), 0),
          users: Math.max(Math.floor((baseValue + variation + randomFactor) / 8), 0),
          timeSpent: Math.max(Math.floor(baseTime + (Math.random() - 0.5) * 20), 10)
        };
      }).reverse();
    })(),
  };

  return baseData;
};

// Datos mock para informes existentes
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Informe de Desempeño - Enero 2024',
    type: 'performance',
    dateRange: {
      from: '2024-01-01',
      to: '2024-01-31',
    },
    dataImportance: 'usuarios_registrados',
    includeCharts: true,
    generatedAt: new Date('2024-01-31'),
    status: 'ready',
    previewData: generateReportPreviewData('performance', 'usuarios_registrados'),
  },
  {
    id: '2',
    title: 'Análisis de Usuarios - Diciembre 2023',
    type: 'users',
    dateRange: {
      from: '2023-12-01',
      to: '2023-12-31',
    },
    dataImportance: 'retención_usuarios',
    includeCharts: true,
    generatedAt: new Date('2023-12-31'),
    status: 'ready',
    previewData: generateReportPreviewData('users', 'retención_usuarios'),
  },
  {
    id: '3',
    title: 'Informe de Contenido - Noviembre 2023',
    type: 'content',
    dateRange: {
      from: '2023-11-01',
      to: '2023-11-30',
    },
    dataImportance: 'contenido_tendencia',
    includeCharts: false,
    generatedAt: new Date('2023-11-30'),
    status: 'ready',
    previewData: generateReportPreviewData('content', 'contenido_tendencia'),
  },
];

export const useReportsStore = create<ReportsState>((set, get) => ({
  reports: mockReports,
  currentReport: null,
  isGenerating: false,

  generateReport: async (reportData) => {
    set({ isGenerating: true });
    
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      generatedAt: new Date(),
      status: 'generating',
    };

    // Añadir el nuevo informe en estado de generación
    set((state) => ({
      reports: [newReport, ...state.reports],
    }));

    // Simular proceso de generación
    setTimeout(() => {
      const completeReport: Report = {
        ...newReport,
        status: 'ready',
        previewData: generateReportPreviewData(reportData.type, reportData.dataImportance),
      };

      set((state) => ({
        reports: state.reports.map((report) =>
          report.id === newReport.id ? completeReport : report
        ),
        currentReport: completeReport,
        isGenerating: false,
      }));
    }, 2000);
  },

  downloadReport: async (reportId, format) => {
    const report = get().getReportById(reportId);
    if (!report) return;

    try {
      if (format === 'pdf') {
        // Generar PDF real usando jsPDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;

        // Configurar fuentes
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(20);
        
        // Título
        pdf.text(report.title, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;
        
        // Fecha
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.text(
          `Generado el ${report.generatedAt.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}`,
          pageWidth / 2,
          yPosition,
          { align: 'center' }
        );
        yPosition += 20;

        // Línea divisoria
        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(1);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 15;

        // Resumen Ejecutivo
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text('Resumen Ejecutivo', 20, yPosition);
        yPosition += 15;

        // Métricas principales
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        const metrics = [
          `Usuarios Totales: ${report.previewData?.summary.totalUsers.toLocaleString() || '0'}`,
          `Vistas Totales: ${report.previewData?.summary.totalViews.toLocaleString() || '0'}`,
          `Tiempo Promedio: ${report.previewData?.summary.avgTimeSpent || '0'} min`,
          `Contenido Principal: ${report.previewData?.summary.topContent || 'N/A'}`
        ];

        metrics.forEach((metric) => {
          pdf.text(`• ${metric}`, 25, yPosition);
          yPosition += 8;
        });
        yPosition += 10;

        // Análisis Detallado
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text('Análisis Detallado', 20, yPosition);
        yPosition += 15;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.text(`Período: ${new Date(report.dateRange.from).toLocaleDateString('es-ES')} - ${new Date(report.dateRange.to).toLocaleDateString('es-ES')}`, 25, yPosition);
        yPosition += 10;

        // Contenido basado en el tipo de datos
        let analysisText = '';
        switch (report.dataImportance) {
          case 'usuarios_registrados':
            analysisText = 'Durante el período analizado, se registraron nuevos usuarios en la plataforma, lo que marca un crecimiento significativo respecto al período anterior. El análisis demográfico muestra una distribución equilibrada en diferentes segmentos de edad, con una tendencia positiva en la retención de usuarios nuevos.';
            break;
          case 'tiempo_web':
            analysisText = 'El tiempo promedio de permanencia en la plataforma ha mostrado una tendencia positiva durante el período evaluado. Los usuarios están dedicando más tiempo a interactuar con el contenido, lo que indica un mayor compromiso y satisfacción con la experiencia ofrecida.';
            break;
          case 'vistas_usuario':
            analysisText = 'Las métricas de visualización muestran un comportamiento favorable en el consumo de contenido. Se observa un incremento en las páginas vistas por sesión y una mejora en la profundidad de navegación de los usuarios.';
            break;
          case 'contenido_tendencia':
            analysisText = 'El análisis de contenido en tendencia revela patrones interesantes en las preferencias de los usuarios. Los temas más populares han mantenido su relevancia, mientras que emergen nuevas categorías con potencial de crecimiento.';
            break;
          case 'retención_usuarios':
            analysisText = 'Los datos de retención de usuarios indican una mejora sostenida en la fidelización. Las estrategias implementadas han resultado efectivas para mantener el compromiso de los usuarios a largo plazo.';
            break;
        }

        // Dividir el texto en líneas que quepan en la página
        const splitText = pdf.splitTextToSize(analysisText, pageWidth - 50);
        splitText.forEach((line: string) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 25, yPosition);
          yPosition += 6;
        });
        yPosition += 15;

        // Sección de gráficos si está habilitada
        if (report.includeCharts) {
          if (yPosition > pageHeight - 50) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(16);
          pdf.text('Gráficos y Visualizaciones', 20, yPosition);
          yPosition += 15;

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
          pdf.text('Los gráficos detallados muestran las tendencias principales durante el período analizado:', 25, yPosition);
          yPosition += 10;

          // Crear un gráfico simple usando canvas
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 200;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Fondo blanco
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Dibujar un gráfico de ejemplo
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const data = report.previewData?.chartData || [];
            if (data.length > 0) {
              const maxValue = Math.max(...data.map((d: any) => d.value));
              const stepX = canvas.width / (data.length - 1);
              
              data.forEach((point: any, index: number) => {
                const x = index * stepX;
                const y = canvas.height - (point.value / maxValue) * (canvas.height - 40) - 20;
                
                if (index === 0) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              });
            }
            
            ctx.stroke();
            
            // Convertir canvas a imagen y añadir al PDF
            const imgData = canvas.toDataURL('image/png');
            
            if (yPosition > pageHeight - 80) {
              pdf.addPage();
              yPosition = 20;
            }
            
            pdf.addImage(imgData, 'PNG', 25, yPosition, 160, 80);
            yPosition += 90;
          }
        }

        // Conclusiones
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text('Conclusiones y Recomendaciones', 20, yPosition);
        yPosition += 15;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        const conclusionText = 'Basándose en los datos analizados, se pueden extraer conclusiones valiosas para la toma de decisiones estratégicas. Las métricas principales muestran una tendencia positiva que sugiere un crecimiento sostenible de la plataforma. Se recomienda continuar con las estrategias actuales mientras se exploran nuevas oportunidades de mejora en la experiencia del usuario.';
        
        const splitConclusion = pdf.splitTextToSize(conclusionText, pageWidth - 50);
        splitConclusion.forEach((line: string) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 25, yPosition);
          yPosition += 6;
        });

        // Pie de página
        const totalPages = pdf.internal.pages.length - 1;
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.text(
            `Generado por Scritto - Sistema de Análisis | Página ${i} de ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
          );
        }

        // Descargar el PDF
        pdf.save(`${report.title.replace(/\s+/g, '_')}.pdf`);
        
      } else if (format === 'png' || format === 'jpg') {
        // Para imágenes, crear un DOM temporal y usar html2canvas
        const container = document.createElement('div');
        container.style.width = '800px';
        container.style.padding = '40px';
        container.style.backgroundColor = '#ffffff';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';

        container.innerHTML = `
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; font-size: 28px; margin-bottom: 10px;">${report.title}</h1>
            <p style="color: #6b7280; font-size: 14px;">
              Generado el ${report.generatedAt.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div style="border-bottom: 2px solid #3b82f6; margin-bottom: 30px;"></div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #374151; font-size: 20px; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 15px;">
              Resumen Ejecutivo
            </h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
              <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 5px;">
                  ${report.previewData?.summary.totalUsers.toLocaleString() || '0'}
                </div>
                <div style="color: #6b7280; font-size: 14px;">Usuarios Totales</div>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 5px;">
                  ${report.previewData?.summary.totalViews.toLocaleString() || '0'}
                </div>
                <div style="color: #6b7280; font-size: 14px;">Vistas Totales</div>
              </div>
            </div>
          </div>
          
                     ${report.includeCharts ? `
             <div style="margin-bottom: 30px;">
               <h2 style="color: #374151; font-size: 20px; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 15px;">
                 Visualización de Datos
               </h2>
               <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                 <canvas id="reportChart" width="700" height="300" style="max-width: 100%;"></canvas>
               </div>
             </div>
           ` : ''}
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>Este informe fue generado automáticamente por el sistema de análisis de Scritto</p>
            <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')} - Formato: ${format.toUpperCase()}</p>
          </div>
        `;

        document.body.appendChild(container);

        // Si incluye gráficos, dibujar el gráfico real en el canvas
        if (report.includeCharts) {
          const chartCanvas = container.querySelector('#reportChart') as HTMLCanvasElement;
          if (chartCanvas && report.previewData?.chartData) {
            const ctx = chartCanvas.getContext('2d');
            if (ctx) {
              const data = report.previewData.chartData;
              const canvas = chartCanvas;
              const padding = 40;
              const chartWidth = canvas.width - padding * 2;
              const chartHeight = canvas.height - padding * 2;

              // Limpiar canvas
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              if (data.length > 0) {
                const maxValue = Math.max(...data.map((d: any) => d.value));
                const minValue = Math.min(...data.map((d: any) => d.value));
                const valueRange = maxValue - minValue || 1;

                // Dibujar líneas de cuadrícula
                ctx.strokeStyle = '#e5e7eb';
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 2]);
                
                for (let i = 0; i <= 5; i++) {
                  const y = padding + (chartHeight / 5) * i;
                  ctx.beginPath();
                  ctx.moveTo(padding, y);
                  ctx.lineTo(padding + chartWidth, y);
                  ctx.stroke();
                }

                // Dibujar ejes
                ctx.setLineDash([]);
                ctx.strokeStyle = '#374151';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(padding, padding);
                ctx.lineTo(padding, padding + chartHeight);
                ctx.lineTo(padding + chartWidth, padding + chartHeight);
                ctx.stroke();

                // Dibujar línea del gráfico
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 3;
                ctx.beginPath();

                data.forEach((point: any, index: number) => {
                  const x = padding + (chartWidth / (data.length - 1)) * index;
                  const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
                  
                  if (index === 0) {
                    ctx.moveTo(x, y);
                  } else {
                    ctx.lineTo(x, y);
                  }
                });
                ctx.stroke();

                // Dibujar puntos
                ctx.fillStyle = '#3b82f6';
                data.forEach((point: any, index: number) => {
                  const x = padding + (chartWidth / (data.length - 1)) * index;
                  const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
                  
                  ctx.beginPath();
                  ctx.arc(x, y, 4, 0, 2 * Math.PI);
                  ctx.fill();
                });

                // Etiquetas del eje Y
                ctx.fillStyle = '#6b7280';
                ctx.font = '12px Arial';
                ctx.textAlign = 'right';
                for (let i = 0; i <= 5; i++) {
                  const value = maxValue - (valueRange / 5) * i;
                  const y = padding + (chartHeight / 5) * i + 4;
                  ctx.fillText(Math.round(value).toLocaleString(), padding - 10, y);
                }

                // Etiquetas del eje X (fechas)
                ctx.textAlign = 'center';
                data.forEach((point: any, index: number) => {
                  if (index % 2 === 0) { // Mostrar solo algunas fechas para evitar solapamiento
                    const x = padding + (chartWidth / (data.length - 1)) * index;
                    const date = new Date(point.date);
                    const dateLabel = `${date.getDate()}/${date.getMonth() + 1}`;
                    ctx.fillText(dateLabel, x, padding + chartHeight + 20);
                  }
                });

                // Título del gráfico
                ctx.fillStyle = '#1f2937';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Tendencia de Datos - Últimos 7 días', canvas.width / 2, 25);
              }
            }
          }
        }

        try {
          const canvas = await html2canvas(container, {
            background: '#ffffff',
            scale: 2,
            logging: false,
            useCORS: true
          } as any);

          document.body.removeChild(container);

          // Descargar la imagen
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${report.title.replace(/\s+/g, '_')}.${format}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          }, `image/${format}`, 0.95);
        } catch (error) {
          document.body.removeChild(container);
          throw error;
        }
      }
      
      console.log(`Informe ${report.title} descargado exitosamente en formato ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error al descargar el informe:', error);
      alert('Error al generar el archivo. Por favor, inténtelo de nuevo.');
    }
  },

  deleteReport: (reportId) => {
    set((state) => ({
      reports: state.reports.filter((report) => report.id !== reportId),
      currentReport: state.currentReport?.id === reportId ? null : state.currentReport,
    }));
  },

  setCurrentReport: (report) => {
    set({ currentReport: report });
  },

  getReportById: (id) => {
    return get().reports.find((report) => report.id === id);
  },
})); 