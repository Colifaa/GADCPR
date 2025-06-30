'use client';

import React from 'react';
import { usePaymentsStore, type Payment } from '@/store/payments';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw,
  CreditCard,
  Calendar,
  Hash,
  User,
  Mail,
  Receipt
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PaymentReceiptModalProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentReceiptModal({ payment, open, onOpenChange }: PaymentReceiptModalProps) {
  if (!payment) return null;

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'refunded':
        return <RefreshCw className="h-6 w-6 text-blue-500" />;
      default:
        return <Receipt className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'Pago exitoso';
      case 'pending':
        return 'Pago pendiente';
      case 'failed':
        return 'Pago fallido';
      case 'refunded':
        return 'Pago reembolsado';
      default:
        return 'Estado desconocido';
    }
  };

  const getPaymentMethodText = (method: Payment['paymentMethod']) => {
    switch (method) {
      case 'credit_card':
        return 'Tarjeta de Crédito';
      case 'debit_card':
        return 'Tarjeta de Débito';
      case 'paypal':
        return 'PayPal';
      case 'stripe':
        return 'Stripe';
      case 'bank_transfer':
        return 'Transferencia Bancaria';
      default:
        return 'Método desconocido';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {getStatusIcon(payment.status)}
          </div>
          <DialogTitle className="text-2xl font-bold">
            {getStatusText(payment.status)}
          </DialogTitle>
          <DialogDescription className="text-base">
            Detalles completos de la transacción
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Estado y Fecha */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado</span>
              <Badge className={getStatusColor(payment.status)}>
                {getStatusText(payment.status)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Fecha de transacción</span>
              </span>
              <span className="text-sm font-medium">
                {format(payment.createdAt, 'dd MMM yyyy, HH:mm', { locale: es })}
              </span>
            </div>
          </div>

          <Separator />

          {/* Información del Cliente */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Información del Cliente</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Nombre</span>
                </span>
                <span className="text-sm font-medium">{payment.userName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Correo</span>
                </span>
                <span className="text-sm font-medium">{payment.userEmail}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detalles del Pago */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Detalles del Pago</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <Hash className="h-4 w-4" />
                  <span>ID de Transacción</span>
                </span>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {payment.transactionId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Método de Pago</span>
                </span>
                <span className="text-sm font-medium">{getPaymentMethodText(payment.paymentMethod)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items del Pago */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Artículos</h3>
            <div className="space-y-2">
              {payment.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <span className="text-sm font-medium">{item.title}</span>
                    {item.quantity && item.quantity > 1 && (
                      <span className="text-xs text-gray-500 ml-2">x{item.quantity}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(item.amount, payment.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-2xl">
                {formatCurrency(payment.amount, payment.currency)}
              </span>
            </div>
            {payment.metadata?.couponCode && (
              <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                <span>Cupón aplicado: {payment.metadata.couponCode}</span>
              </div>
            )}
          </div>

          {/* Información adicional */}
          {payment.metadata && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Información Adicional</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {payment.metadata.plan && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">Plan: </span>
                      <span className="capitalize">{payment.metadata.plan}</span>
                    </div>
                  )}
                  {payment.metadata.billingPeriod && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">Período: </span>
                      <span className="capitalize">{payment.metadata.billingPeriod === 'monthly' ? 'Mensual' : 'Anual'}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 