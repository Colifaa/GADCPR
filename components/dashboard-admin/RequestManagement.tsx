'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAdminStore, SupportRequest } from '@/store/admin';
import { useNotificationStore } from '@/store/notifications';
import { useSupportStore } from '@/store/support';
import { Card, CardContent } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
  Search,
  Eye,
  MessageCircle,
  Settings,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Paperclip,
  User,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 10;

export function RequestManagement() {
  const { supportRequests, respondToRequest } = useAdminStore();
  const { notifySupportResponse } = useNotificationStore();
  const { contactRequests, respondToContactRequest } = useSupportStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<SupportRequest['type'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [response, setResponse] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Combinar solicitudes del admin con las del formulario de contacto
  const allRequests = useMemo(() => {
    const contactRequestsFormatted = contactRequests.map(req => ({
      id: req.id,
      userId: 'contact-user',
      userName: req.name,
      userEmail: req.email,
      userPhone: req.phone,
      type: req.type,
      title: req.subject,
      description: req.message,
      status: req.status,
      createdAt: req.createdAt,
      respondedAt: req.respondedAt,
      adminResponse: req.adminResponse,
      adminId: req.adminId,
    }));
    
    return [...supportRequests, ...contactRequestsFormatted];
  }, [supportRequests, contactRequests]);

  // Filtrar solicitudes por estado
  const pendingRequests = useMemo(() => 
    allRequests.filter(req => req.status === 'pending'),
    [allRequests]
  );

  const respondedRequests = useMemo(() => 
    allRequests.filter(req => req.status === 'responded'),
    [allRequests]
  );

  // Filtrar y paginar solicitudes pendientes
  const filteredPendingRequests = useMemo(() => {
    let filtered = pendingRequests;
    
    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(req => req.type === selectedType);
    }
    
    return filtered;
  }, [pendingRequests, searchTerm, selectedType]);

  // Filtrar solicitudes respondidas
  const filteredRespondedRequests = useMemo(() => {
    let filtered = respondedRequests;
    
    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [respondedRequests, searchTerm]);

  const totalPendingPages = Math.ceil(filteredPendingRequests.length / ITEMS_PER_PAGE);
  const totalRespondedPages = Math.ceil(filteredRespondedRequests.length / ITEMS_PER_PAGE);

  const paginatedPendingRequests = filteredPendingRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginatedRespondedRequests = filteredRespondedRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getTypeIcon = (type: SupportRequest['type']) => {
    switch (type) {
      case 'technical_problem':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'configuration_assistance':
        return <Settings className="h-5 w-5 text-blue-500" />;
      case 'general_consultation':
        return <HelpCircle className="h-5 w-5 text-green-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: SupportRequest['type']) => {
    switch (type) {
      case 'technical_problem':
        return 'Problema técnico';
      case 'configuration_assistance':
        return 'Asistencia en la configuración';
      case 'general_consultation':
        return 'Consulta general';
      default:
        return type;
    }
  };

  const handleOpenRequest = (request: SupportRequest) => {
    setSelectedRequest(request);
    setResponse('');
    setShowRequestModal(true);
  };

  const handleSendResponse = () => {
    if (selectedRequest && response.trim()) {
      // Si es una consulta del formulario de contacto, actualizar el store de support
      if (selectedRequest.id.startsWith('contact-')) {
        respondToContactRequest(selectedRequest.id, response.trim(), 'admin-1');
      } else {
        // Es una consulta del admin store
        respondToRequest(selectedRequest.id, response.trim(), 'admin-1');
      }
      
      // Enviar notificación de respuesta de soporte
      notifySupportResponse(selectedRequest.id);
      
      setShowRequestModal(false);
      setResponse('');
      setSelectedRequest(null);
      setShowSuccessDialog(true);
    }
  };

  const handleTabChange = (value: string) => {
    setCurrentPage(1);
    setSearchTerm('');
    setSelectedType('all');
  };

  const renderPaginationNumbers = (currentPage: number, totalPages: number) => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const RequestCard = ({ request }: { request: SupportRequest }) => (
    <Card key={request.id} className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getTypeIcon(request.type)}
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {getTypeLabel(request.type)}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {format(request.createdAt, 'dd/MM/yyyy - HH:mm')}
              </p>
            </div>
          </div>
          {request.status === 'pending' && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
              <Clock className="h-3 w-3 mr-1" />
              Pendiente
            </Badge>
          )}
          {request.status === 'responded' && (
            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              Respondida
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Usuario: {request.userName}
            </p>
            <p className="text-xs text-gray-500">
              {request.userEmail} {request.userPhone && `• ${request.userPhone}`}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {request.description}
            </p>
          </div>

          {request.attachmentUrl && (
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <Paperclip className="h-3 w-3" />
              <span>Archivo adjunto</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenRequest(request)}
            className="group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver más
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por usuario, email o descripción..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        
        <Select
          value={selectedType}
          onValueChange={(value) => {
            setSelectedType(value as SupportRequest['type'] | 'all');
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="technical_problem">Problema técnico</SelectItem>
            <SelectItem value="configuration_assistance">Asistencia en la configuración</SelectItem>
            <SelectItem value="general_consultation">Consulta general</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="pending" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pendientes ({pendingRequests.length})</span>
          </TabsTrigger>
          <TabsTrigger value="responded" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Respondidas ({respondedRequests.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Pendientes */}
        <TabsContent value="pending" className="space-y-6">
          {filteredPendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No hay solicitudes pendientes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || selectedType !== 'all' 
                  ? 'No se encontraron solicitudes con los filtros aplicados'
                  : 'Todas las solicitudes han sido respondidas'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {paginatedPendingRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>

              {/* Paginación */}
              {totalPendingPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex space-x-1">
                    {renderPaginationNumbers(currentPage, totalPendingPages).map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-3 py-2 text-gray-500">...</span>
                        ) : (
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page as number)}
                            className="w-10 h-10"
                          >
                            {page}
                          </Button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPendingPages, currentPage + 1))}
                    disabled={currentPage === totalPendingPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Tab Respondidas */}
        <TabsContent value="responded" className="space-y-6">
          {filteredRespondedRequests.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No hay solicitudes respondidas
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'No se encontraron solicitudes con los filtros aplicados' : 'Aún no se han respondido solicitudes'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {paginatedRespondedRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>

              {/* Paginación */}
              {totalRespondedPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex space-x-1">
                    {renderPaginationNumbers(currentPage, totalRespondedPages).map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-3 py-2 text-gray-500">...</span>
                        ) : (
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page as number)}
                            className="w-10 h-10"
                          >
                            {page}
                          </Button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalRespondedPages, currentPage + 1))}
                    disabled={currentPage === totalRespondedPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Solicitud */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedRequest && getTypeIcon(selectedRequest.type)}
              <span>{selectedRequest && getTypeLabel(selectedRequest.type)}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Información del usuario */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Información del usuario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Nombre:</span>
                    <span>{selectedRequest.userName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Correo:</span>
                    <span className="text-blue-600">{selectedRequest.userEmail}</span>
                  </div>
                  {selectedRequest.userPhone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Teléfono:</span>
                      <span>{selectedRequest.userPhone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Fecha:</span>
                    <span>{format(selectedRequest.createdAt, 'dd/MM/yyyy - HH:mm')}</span>
                  </div>
                </div>
              </div>

              {/* Descripción del problema */}
              <div>
                <h3 className="font-medium mb-3">Descripción del problema o solicitud</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedRequest.description}
                  </p>
                </div>
              </div>

              {/* Archivo adjunto */}
              {selectedRequest.attachmentUrl && (
                <div>
                  <h3 className="font-medium mb-3 flex items-center">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Archivo adjunto
                  </h3>
                  <div className="border rounded-lg p-4">
                    <img
                      src={selectedRequest.attachmentUrl}
                      alt="Archivo adjunto"
                      className="max-w-full h-auto rounded border"
                    />
                  </div>
                </div>
              )}

              {/* Respuesta del admin (si ya fue respondida) */}
              {selectedRequest.status === 'responded' && selectedRequest.adminResponse && (
                <div>
                  <h3 className="font-medium mb-3 text-green-600">Respuesta del administrador</h3>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedRequest.adminResponse}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Respondida el {selectedRequest.respondedAt && format(selectedRequest.respondedAt, 'dd/MM/yyyy - HH:mm')}
                    </p>
                  </div>
                </div>
              )}

              {/* Campo para responder (solo si está pendiente) */}
              {selectedRequest.status === 'pending' && (
                <div>
                  <h3 className="font-medium mb-3">Responder</h3>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Escribe tu respuesta aquí..."
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      rows={4}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowRequestModal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSendResponse}
                        disabled={!response.trim()}
                        className="flex items-center space-x-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Enviar respuesta</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center">Respuesta enviada</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              La solicitud ha sido marcada como respondida y se ha enviado la respuesta al usuario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center">
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Aceptar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 