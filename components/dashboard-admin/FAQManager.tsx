'use client';

import React, { useState } from 'react';
import { useFaqsStore, type Faq } from '@/store/faqs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  HelpCircle,
  GripVertical,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AddFaqDialog } from './AddFaqDialog';
import { EditFaqDialog } from './EditFaqDialog';

export function FAQManager() {
  const { 
    faqs, 
    deleteFaq, 
    toggleFaqStatus, 
    getFaqsByCategory 
  } = useFaqsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  // Filtrar FAQs
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && faq.isActive) ||
      (statusFilter === 'inactive' && !faq.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => a.order - b.order);

  const getCategoryLabel = (category: string) => {
    const labels = {
      general: 'General',
      billing: 'Facturación',
      technical: 'Técnico',
      account: 'Cuenta'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      billing: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      technical: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      account: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const handleDeleteFaq = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta pregunta frecuente?')) {
      deleteFaq(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Preguntas Frecuentes</span>
              </CardTitle>
              <CardDescription>
                Administra las preguntas frecuentes que verán los usuarios
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Añadir FAQ</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Filtros y búsqueda */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar preguntas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="billing">Facturación</SelectItem>
                <SelectItem value="technical">Técnico</SelectItem>
                <SelectItem value="account">Cuenta</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{faqs.length}</div>
              <div className="text-sm text-blue-600/80 dark:text-blue-400/80">Total FAQs</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {faqs.filter(f => f.isActive).length}
              </div>
              <div className="text-sm text-green-600/80 dark:text-green-400/80">Activas</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {faqs.filter(f => f.category === 'technical').length}
              </div>
              <div className="text-sm text-purple-600/80 dark:text-purple-400/80">Técnicas</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {faqs.filter(f => f.category === 'billing').length}
              </div>
              <div className="text-sm text-orange-600/80 dark:text-orange-400/80">Facturación</div>
            </div>
          </div>

          {/* Lista de FAQs */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No se encontraron preguntas frecuentes
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'Intenta ajustar tus filtros de búsqueda'
                    : 'Comienza añadiendo tu primera pregunta frecuente'
                  }
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div 
                  key={faq.id} 
                  className={`group border rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
                    !faq.isActive ? 'opacity-60 bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header con orden, categoría y estado */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <GripVertical className="h-4 w-4" />
                          <span className="text-sm font-medium">#{faq.order}</span>
                        </div>
                        <Badge className={getCategoryColor(faq.category)}>
                          {getCategoryLabel(faq.category)}
                        </Badge>
                        <Badge variant={faq.isActive ? 'default' : 'secondary'}>
                          {faq.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>

                      {/* Pregunta */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                        {faq.question}
                      </h3>

                      {/* Respuesta */}
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Creado: {format(faq.createdAt, 'dd MMM yyyy', { locale: es })}</span>
                        {faq.updatedAt > faq.createdAt && (
                          <span>Actualizado: {format(faq.updatedAt, 'dd MMM yyyy', { locale: es })}</span>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFaqStatus(faq.id)}
                        className={faq.isActive ? 'text-gray-600 hover:text-gray-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {faq.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingFaq(faq)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Diálogos */}
      <AddFaqDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
      
      {editingFaq && (
        <EditFaqDialog
          faq={editingFaq}
          open={!!editingFaq}
          onOpenChange={(open) => !open && setEditingFaq(null)}
        />
      )}
    </div>
  );
} 