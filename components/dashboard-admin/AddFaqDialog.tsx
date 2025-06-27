'use client';

import React, { useState } from 'react';
import { useFaqsStore } from '@/store/faqs';
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
import { HelpCircle, Plus } from 'lucide-react';

interface AddFaqDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFaqDialog({ open, onOpenChange }: AddFaqDialogProps) {
  const { addFaq, faqs } = useFaqsStore();
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general' as 'general' | 'billing' | 'technical' | 'account',
    isActive: true,
    order: faqs.length + 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      addFaq(formData);
      
      // Reset form
      setFormData({
        question: '',
        answer: '',
        category: 'general',
        isActive: true,
        order: faqs.length + 2
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error al añadir FAQ:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      isActive: true,
      order: faqs.length + 1
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Añadir Nueva Pregunta Frecuente</span>
          </DialogTitle>
          <DialogDescription>
            Crea una nueva pregunta frecuente que será visible para los usuarios.
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
              disabled={isSubmitting || !formData.question.trim() || !formData.answer.trim()}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  <span>Añadiendo...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Añadir FAQ</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 