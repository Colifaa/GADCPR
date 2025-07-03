"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, Printer, Video, CheckCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useVideoScriptsStore } from "@/store/video-scripts"

export default function ScriptViewPage() {
  const params = useParams()
  const router = useRouter()
  const scriptId = params.id as string
  
  const { scripts } = useVideoScriptsStore()
  const script = scripts.find(s => s.id === scriptId)

  if (!script) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Guión no encontrado</h1>
            <p className="text-gray-600 mb-6">El guión que buscas no existe o ha sido eliminado.</p>
            <Button onClick={() => router.push('/selecciones/podcast/contents')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(script.content)
    // Aquí podrías agregar una notificación de éxito
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([script.content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${script.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${script.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              .header { border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
              .content { white-space: pre-wrap; }
              .badges { margin: 10px 0; }
              .badge { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; margin-right: 8px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${script.title}</h1>
              <p>Generado el ${script.createdAt.toLocaleDateString('es-ES')}</p>
              <div class="badges">
                <span class="badge">Tono: ${script.tone}</span>
                <span class="badge">Estilo: ${script.style}</span>
                <span class="badge">Enfoque: ${script.focus}</span>
                <span class="badge">Duración: ${script.duration}</span>
              </div>
            </div>
            <div class="content">${script.content}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
        {/* Header con botón volver */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/selecciones/podcast/contents')}
            className="flex items-center space-x-2 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-medium">Guión generado</span>
          </div>
        </div>

        {/* Título y metadata */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            {script.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <Badge variant="outline" className="border-purple-200 text-purple-700">
              Tono: {script.tone}
            </Badge>
            <Badge variant="outline" className="border-green-200 text-green-700">
              Estilo: {script.style}
            </Badge>
            <Badge variant="outline" className="border-orange-200 text-orange-700">
              Enfoque: {script.focus}
            </Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              Duración: {script.duration}
            </Badge>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Generado {script.createdAt.toLocaleDateString('es-ES')}
            </span>
          </div>
        </div>

        {/* Contenido del guión */}
        <Card className="shadow-lg border-0 bg-white mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Video className="w-5 h-5 mr-2 text-purple-600" />
                Tu Guión Generado
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                {script.content}
              </pre>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1 hover:bg-blue-50 hover:border-blue-300"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Guión
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1 hover:bg-green-50 hover:border-green-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1 hover:bg-purple-50 hover:border-purple-300"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Guión generado por IA • {script.createdAt.toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
} 