'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocalDB } from '@/hooks/use-local-db';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Eye, Trash2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DatabaseManager() {
  const { getUsers, exportData, importData, clearDB } = useLocalDB();
  const { toast } = useToast();
  const [jsonData, setJsonData] = useState('');
  const [showData, setShowData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = () => {
    try {
      const data = exportData();
      setJsonData(data);
      setShowData(true);
      
      // También descargar como archivo
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-db-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "¡Éxito!",
        description: "Base de datos exportada correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar la base de datos.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!jsonData.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa los datos JSON para importar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = importData(jsonData);
      
      if (success) {
        toast({
          title: "¡Éxito!",
          description: "Base de datos importada correctamente.",
        });
        setJsonData('');
        setShowData(false);
      } else {
        throw new Error('Error al importar los datos');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al importar la base de datos. Verifica el formato JSON.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar toda la base de datos? Esta acción no se puede deshacer.')) {
      try {
        clearDB();
        toast({
          title: "Base de datos limpiada",
          description: "Todos los datos han sido eliminados.",
        });
        setJsonData('');
        setShowData(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo limpiar la base de datos.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewData = () => {
    try {
      const data = exportData();
      setJsonData(data);
      setShowData(!showData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la base de datos.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonData(content);
        setShowData(true);
      };
      reader.readAsText(file);
    }
  };

  const userCount = getUsers().length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Gestor de Base de Datos JSON
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Administra tu base de datos local de usuarios almacenada en JSON.
        </p>
      </div>

      {/* Información de la Base de Datos */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de la Base de Datos</CardTitle>
          <CardDescription>
            Información actual sobre tu base de datos local.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total de usuarios registrados
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userCount}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewData}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showData ? 'Ocultar' : 'Ver'} Datos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exportar Datos */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Base de Datos</CardTitle>
          <CardDescription>
            Descarga tu base de datos como archivo JSON para respaldo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exportar y Descargar JSON
          </Button>
        </CardContent>
      </Card>

      {/* Importar Datos */}
      <Card>
        <CardHeader>
          <CardTitle>Importar Base de Datos</CardTitle>
          <CardDescription>
            Carga datos desde un archivo JSON o pégalos directamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Seleccionar Archivo JSON
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          
          <Alert>
            <AlertDescription>
              <strong>Advertencia:</strong> Importar datos reemplazará completamente la base de datos actual.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Visualizar/Editar Datos */}
      {showData && (
        <Card>
          <CardHeader>
            <CardTitle>Datos de la Base de Datos</CardTitle>
            <CardDescription>
              Visualiza o edita los datos JSON directamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder="Datos JSON..."
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex space-x-2">
              <Button 
                onClick={handleImport} 
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Datos
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setJsonData('')}
                className="flex-1 sm:flex-none"
              >
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Limpiar Base de Datos */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-400">
            Zona de Peligro
          </CardTitle>
          <CardDescription>
            Acciones irreversibles que afectarán tu base de datos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleClear}
            className="w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar Toda la Base de Datos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 