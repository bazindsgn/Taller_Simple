import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockClients, mockVehicles, mockWorkOrders, Invoice, PaymentItem } from '../lib/mockData';
import { Receipt, CheckCircle, Clock, FileText, Download, Edit, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const INITIAL_PAYMENTS: Invoice[] = [
  {
    id: '1',
    workOrderId: '1',
    clientId: '1',
    vehicleId: '1',
    invoiceNumber: 'A-0001-00000001',
    items: [
      { id: '1-1', description: 'Reparación paragolpes', quantity: 1, unitPrice: 50000, total: 50000 },
      { id: '1-2', description: 'Pintura completa', quantity: 1, unitPrice: 35000, total: 35000 },
    ],
    totalAmount: 85000,
    taxAmount: 17850,
    createdAt: '2026-03-16',
    status: 'pagada',
    afipStatus: 'autorizada',
    invoiceType: 'B',
    customerTaxCondition: 'Consumidor Final',
  },
  {
    id: '2',
    workOrderId: '2',
    clientId: '2',
    vehicleId: '2',
    items: [
      { id: '2-1', description: 'Pintura completa del vehículo', quantity: 1, unitPrice: 205000, total: 205000 },
    ],
    totalAmount: 205000,
    taxAmount: 43050,
    createdAt: '2026-03-19',
    status: 'enviada',
    invoiceType: 'A',
    customerTaxCondition: 'Responsable Inscripto',
  },
  {
    id: '3',
    workOrderId: '3',
    clientId: '3',
    vehicleId: '3',
    items: [
      { id: '3-1', description: 'Service completo', quantity: 1, unitPrice: 0, total: 0 },
      { id: '3-2', description: 'Cambio de aceite', quantity: 1, unitPrice: 0, total: 0 },
    ],
    totalAmount: 0,
    taxAmount: 0,
    createdAt: '2026-03-21',
    status: 'borrador',
  },
];

export function Invoices() {
  const [payments, setPayments] = useState<Invoice[]>(INITIAL_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'borrador' | 'pendiente' | 'enviada' | 'pagada'>('all');
  const [editPaymentOpen, setEditPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Invoice | null>(null);
  const [editingItems, setEditingItems] = useState<PaymentItem[]>([]);
  const [invoiceType, setInvoiceType] = useState<'A' | 'B' | 'C'>('B');
  const [customerTaxCondition, setCustomerTaxCondition] = useState('Consumidor Final');

  const filteredPayments = payments.filter(payment => {
    if (payment.deleted) return false;
    const client = mockClients.find(c => c.id === payment.clientId);
    const vehicle = mockVehicles.find(v => v.id === payment.vehicleId);
    const matchesSearch =
      client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditPayment = (payment: Invoice) => {
    setSelectedPayment(payment);
    setEditingItems([...payment.items]);
    setInvoiceType(payment.invoiceType || 'B');
    setCustomerTaxCondition(payment.customerTaxCondition || 'Consumidor Final');
    setEditPaymentOpen(true);
  };

  const handleUpdateItem = (itemId: string, field: 'unitPrice' | 'quantity', value: number) => {
    setEditingItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    }));
  };

  const handleSavePayment = () => {
    if (!selectedPayment) return;
    const totalAmount = editingItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = invoiceType === 'A' ? totalAmount * 0.21 : 0;

    setPayments(prev => prev.map(p =>
      p.id === selectedPayment.id
        ? {
            ...p,
            items: editingItems,
            totalAmount,
            taxAmount,
            invoiceType,
            customerTaxCondition,
            status: p.status === 'borrador' ? 'pendiente' as const : p.status,
          }
        : p
    ));
    toast.success('Cobranza actualizada');
    setEditPaymentOpen(false);
  };

  const handleGenerateInvoice = (payment: Invoice) => {
    const invoiceNumber = `${invoiceType}-0001-${String(payments.length + 1).padStart(8, '0')}`;
    setPayments(prev => prev.map(p =>
      p.id === payment.id
        ? { ...p, invoiceNumber, afipStatus: 'autorizada' as const }
        : p
    ));
    toast.success('Factura generada y autorizada por AFIP (simulación)');
  };

  const handleMarkAsPaid = (paymentId: string) => {
    setPayments(prev => prev.map(p =>
      p.id === paymentId ? { ...p, status: 'pagada' as const } : p
    ));
    toast.success('Cobranza marcada como pagada');
  };

  const handleDownloadInvoice = (payment: Invoice) => {
    toast.info(`Descargando factura ${payment.invoiceNumber || 'sin número'}...`);
  };

  const handleDeletePayment = (paymentId: string) => {
    setPayments(prev => prev.map(p =>
      p.id === paymentId ? { ...p, deleted: true } : p
    ));
    toast.success('Cobranza eliminada');
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'borrador':
        return <Badge className="bg-gray-100 text-gray-700 border-0">Borrador</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Pendiente</Badge>;
      case 'enviada':
        return <Badge className="bg-blue-100 text-blue-800 border-0">Enviada</Badge>;
      case 'pagada':
        return <Badge className="bg-green-100 text-green-800 border-0">Cobrada</Badge>;
    }
  };

  const totalBorradores = payments.filter(p => p.status === 'borrador' && !p.deleted).length;
  const totalPendientes = payments.filter(p => (p.status === 'pendiente' || p.status === 'enviada') && !p.deleted).length;
  const totalCobradas = payments.filter(p => p.status === 'pagada' && !p.deleted).length;
  const totalPorCobrar = payments.filter(p => p.status !== 'pagada' && p.status !== 'borrador' && !p.deleted).reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Borradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{totalBorradores}</div>
            <p className="text-xs text-muted-foreground mt-1">Pendientes de completar</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Pendientes de Cobro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalPendientes}</div>
            <p className="text-xs text-muted-foreground mt-1">${totalPorCobrar.toLocaleString('es-AR')}</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Cobradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalCobradas}</div>
            <p className="text-xs text-muted-foreground mt-1">Este mes</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Facturado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${payments.filter(p => p.status === 'pagada' && !p.deleted).reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Cobranzas */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <CardTitle>Cobranzas y Facturación</CardTitle>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <Input
              placeholder="Buscar por cliente, patente o número de factura..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-sm text-muted-foreground">Filtrar por estado:</Label>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === 'borrador' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('borrador')}
                  className={statusFilter === 'borrador' ? 'bg-gray-600 hover:bg-gray-700' : ''}
                >
                  Borradores
                </Button>
                <Button
                  variant={statusFilter === 'pendiente' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('pendiente')}
                  className={statusFilter === 'pendiente' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                >
                  Pendientes
                </Button>
                <Button
                  variant={statusFilter === 'enviada' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('enviada')}
                  className={statusFilter === 'enviada' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                >
                  Enviadas
                </Button>
                <Button
                  variant={statusFilter === 'pagada' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('pagada')}
                  className={statusFilter === 'pagada' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  Cobradas
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente / Vehículo</TableHead>
                  <TableHead>Orden de Trabajo</TableHead>
                  <TableHead>N° Factura</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map(payment => {
                  const client = mockClients.find(c => c.id === payment.clientId);
                  const vehicle = mockVehicles.find(v => v.id === payment.vehicleId);
                  const workOrder = mockWorkOrders.find(wo => wo.id === payment.workOrderId);

                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client?.name}</p>
                          {vehicle && (
                            <p className="text-xs text-muted-foreground">
                              {vehicle.brand} {vehicle.model} • {vehicle.licensePlate}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {workOrder && (
                          <div className="text-sm">
                            <span className="font-mono">#{workOrder.id}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.invoiceNumber ? (
                          <span className="font-mono text-sm">{payment.invoiceNumber}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Sin generar</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.totalAmount > 0 ? (
                          <span className="font-semibold">${payment.totalAmount.toLocaleString('es-AR')}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Sin precio</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString('es-AR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {/* Editar / Completar */}
                          {(payment.status === 'borrador' || payment.status === 'pendiente') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPayment(payment)}
                            >
                              <Edit className="size-4 mr-1" />
                              {payment.status === 'borrador' ? 'Completar' : 'Editar'}
                            </Button>
                          )}

                          {/* Generar Factura */}
                          {payment.status === 'pendiente' && !payment.invoiceNumber && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-300"
                              onClick={() => handleGenerateInvoice(payment)}
                            >
                              <Receipt className="size-4 mr-1" />
                              Facturar
                            </Button>
                          )}

                          {/* Marcar como cobrada */}
                          {(payment.status === 'pendiente' || payment.status === 'enviada') && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-300"
                              onClick={() => handleMarkAsPaid(payment.id)}
                            >
                              <CheckCircle className="size-4 mr-1" />
                              Cobrado
                            </Button>
                          )}

                          {/* Descargar factura */}
                          {payment.invoiceNumber && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => handleDownloadInvoice(payment)}
                              title="Descargar factura"
                            >
                              <Download className="size-4 text-blue-600" />
                            </Button>
                          )}

                          {/* Eliminar */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => handleDeletePayment(payment.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron cobranzas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de edición */}
      <Dialog open={editPaymentOpen} onOpenChange={setEditPaymentOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPayment?.status === 'borrador' ? 'Completar Cobranza' : 'Editar Cobranza'}
            </DialogTitle>
            <DialogDescription>
              Orden de Trabajo #{selectedPayment?.workOrderId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Items */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold">Ítems del Servicio</Label>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="w-24">Cant.</TableHead>
                      <TableHead className="w-32">Precio Unit.</TableHead>
                      <TableHead className="w-32">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editingItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={e => handleUpdateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${item.total.toLocaleString('es-AR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <tfoot className="bg-gray-50 border-t">
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                      <TableCell className="font-bold text-lg">
                        ${editingItems.reduce((sum, item) => sum + item.total, 0).toLocaleString('es-AR')}
                      </TableCell>
                    </TableRow>
                  </tfoot>
                </Table>
              </div>
            </div>

            {/* Datos de facturación (opcional) */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-sm">Datos de Facturación (Opcional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceType">Tipo de Factura</Label>
                  <Select value={invoiceType} onValueChange={(value: 'A' | 'B' | 'C') => setInvoiceType(value)}>
                    <SelectTrigger id="invoiceType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A - Responsable Inscripto</SelectItem>
                      <SelectItem value="B">B - Consumidor Final</SelectItem>
                      <SelectItem value="C">C - Exento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxCondition">Condición Fiscal del Cliente</Label>
                  <Input
                    id="taxCondition"
                    value={customerTaxCondition}
                    onChange={e => setCustomerTaxCondition(e.target.value)}
                    placeholder="Ej: Responsable Inscripto"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Completar estos datos es necesario si desea generar la factura oficial para AFIP.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditPaymentOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePayment}>
                <DollarSign className="size-4 mr-2" />
                Guardar Cobranza
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
