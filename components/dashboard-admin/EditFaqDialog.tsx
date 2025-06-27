'use client';

import React, { useState, useEffect } from 'react';
import { useFaqsStore, type Faq } from '@/store/faqs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Edit, Save } from 'lucide-react';

interface EditFaqDialogProps {
  faq: Faq;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditFaqDialog({ faq, open, onOpenChange }: EditFaqDialogProps) {
  const { updateFaq } = useFaqsStore();
  
  const [formData, setFormData] = useState({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    isActive: faq.isActive,
    order: faq.order
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar form data cuando cambia el FAQ
  useEffect(() => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive,
      order: faq.order
    });
  }, [faq]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      updateFaq(faq.id, formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error al actualizar FAQ:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form to original values
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive,
      order: faq.order
    });
    onOpenChange(false);
  };

  // Check if form has changes
  const hasChanges = 
    formData.question !== faq.question ||
    formData.answer !== faq.answer ||
    formData.category !== faq.category ||
    formData.isActive !== faq.isActive ||
    formData.order !== faq.order;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Editar Pregunta Frecuente</span>
          </DialogTitle>
          <DialogDescription>
            Modifica la información de esta pregunta frecuente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pregunta */}
          <div className="space-y-2">
            <Label htmlFor="question">Pregunta *</Label>
            <Input
              id="question"
              placeholder="¿Cuál es tu pregunta?"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              required
              className="w-full"
            />
          </div>

          {/* Respuesta */}
          <div className="space-y-2">
            <Label htmlFor="answer">Respuesta *</Label>
            <Textarea
              id="answer"
              placeholder="Escribe la respuesta detallada..."
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              required
              rows={4}
              className="w-full resize-none"
            />
          </div>

          {/* Configuración */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="billing">Facturación</SelectItem>
                  <SelectItem value="technical">Técnico</SelectItem>
                  <SelectItem value="account">Cuenta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orden */}
            <div className="space-y-2">
              <Label htmlFor="order">Orden</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full"
              />
            </div>
          </div>

          {/* Estado activo */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="is-active" className="text-sm font-medium">
                Pregunta activa
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Las preguntas activas serán visibles para los usuarios
              </p>
            </div>
            <Switch
              id="is-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          {/* Información de cambios */}
          {hasChanges && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Tienes cambios sin guardar en esta pregunta frecuente.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.question.trim() || !formData.answer.trim() || !hasChanges}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 