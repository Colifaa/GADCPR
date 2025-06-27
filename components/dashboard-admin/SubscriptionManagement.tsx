'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStore } from '@/store/admin';
import { Subscription } from '@/store/admin';
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CreditCard
} from 'lucide-react';

export function SubscriptionManagement() {
  const { subscriptions, cancelSubscription } = useAdminStore();

  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const subscriptionsPerPage = 10;

  // Filtrar y paginar suscripciones
  const { paginatedSubscriptions, totalPages, totalSubscriptions } = useMemo(() => {
    // Filtrar suscripciones
    const filtered = subscriptions.filter((subscription) => {
      const matchesSearch = 
        subscription.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subscription.userPhone && subscription.userPhone.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });

    // Calcular paginación
    const total = filtered.length;
    const pages = Math.ceil(total / subscriptionsPerPage);
    const startIndex = (currentPage - 1) * subscriptionsPerPage;
    const endIndex = startIndex + subscriptionsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      paginatedSubscriptions: paginated,
      totalPages: pages,
      totalSubscriptions: total
    };
  }, [subscriptions, searchTerm, currentPage, subscriptionsPerPage]);

  // Resetear a primera página cuando cambia la búsqueda
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Paginación
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generar números de página
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Paga';
      case 'inactive':
        return 'Inactiva';
      case 'cancelled':
        return 'Cancelada';
      case 'expired':
        return 'Expirada';
      default:
        return status;
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'Gratis';
      case 'pro':
        return 'Pro';
      case 'enterprise':
        return 'Enterprise';
      default:
        return plan;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Suscripciones</h2>
        <p className="text-gray-600 dark:text-gray-400">Gestiona todas las suscripciones de los usuarios</p>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex justify-between items-center">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {paginatedSubscriptions.length} de {totalSubscriptions} suscripciones
        </div>
      </div>

      {/* Tabla de suscripciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Lista de Suscripciones</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Nombre</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Email</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Suscripción</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Teléfono</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-center">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="font-medium">{subscription.userName}</TableCell>
                    <TableCell className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      {subscription.userEmail}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(subscription.status)} variant="secondary">
                        {getStatusLabel(subscription.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {subscription.userPhone || 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelSubscription(subscription.id)}
                        disabled={subscription.status === 'cancelled' || subscription.status === 'expired'}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 disabled:text-gray-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedSubscriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No se encontraron suscripciones
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          {/* Botón anterior */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-10 w-10 p-0 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Números de página */}
          <div className="flex space-x-1">
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-2 text-gray-500">...</span>
                ) : (
                  <div
                    className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                      page === currentPage 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                    }`}
                    onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Botón siguiente */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-10 w-10 p-0 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 