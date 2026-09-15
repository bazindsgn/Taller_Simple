import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { mockClients, mockWorkOrders, mockBudgets, mockVehicles, Client, WorkOrder, Budget, Invoice } from '../lib/mockData';
import { Trash2, RotateCcw, AlertTriangle, Users, FileText, DollarSign, Receipt, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Simulated deleted items (in real app these would come from global state/DB)
const DELETED_CLIENTS: Client[] = [
  { id: 'd1', name: 'Pedro Gómez', phone: '+54 9 11 4444-5555', email: 'pedro.g@email.com', address: 'Belgrano 321, CABA', taxId: '20-44444444-4', createdAt: '2026-02-10', deleted: true },
];
const DELETED_ORDERS: WorkOrder[] = [
  { id: 'd1', clientId: '1', vehicleId: '1', description: 'Cambio de aceite y filtros', status: 'cerrada', createdAt: '2026-02-20', createdBy: '2', totalAmount: 15000, deleted: true },
];
const DELETED_BUDGETS: Budget[] = [
  { id: 'd1', workOrderId: '2', clientId: '2', vehicleId: '2', items: [{ id: 'di1', description: 'Pintura lateral', quantity: 1, unitPrice: 90000, total: 90000 }], totalAmount: 90000, status: 'borrador', createdAt: '2026-02-18', deleted: true },
];
const DELETED_INVOICES: Invoice[] = [
  { id: 'd1', budgetId: '1', clientId: '3', invoiceNumber: 'A-0001-00000099', totalAmount: 55000, taxAmount: 11550, createdAt: '2026-02-05', status: 'pendiente', deleted: true },
];

const DAYS_UNTIL_DELETE = 14;

function daysLeft(deletedDate: string): number {
  const deleted = new Date(deletedDate);
  const expiry = new Date(deleted);
  expiry.setDate(expiry.getDate() + DAYS_UNTIL_DELETE);
  const now = new Date();
  return Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function DaysLeftBadge({ createdAt }: { createdAt: string }) {
  const days = daysLeft(createdAt);
  if (days <= 3) return <Badge className="bg-red-100 text-red-800 border-0 text-xs">{days}d para borrar</Badge>;
  if (days <= 7) return <Badge className="bg-orange-100 text-orange-800 border-0 text-xs">{days}d para borrar</Badge>;
  return <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">{days}d para borrar</Badge>;
}

export function Papelera() {
  const [deletedClients, setDeletedClients] = useState<Client[]>(DELETED_CLIENTS);
  const [deletedOrders, setDeletedOrders] = useState<WorkOrder[]>(DELETED_ORDERS);
  const [deletedBudgets, setDeletedBudgets] = useState<Budget[]>(DELETED_BUDGETS);
  const [deletedInvoices, setDeletedInvoices] = useState<Invoice[]>(DELETED_INVOICES);

  const totalItems = deletedClients.length + deletedOrders.length + deletedBudgets.length + deletedInvoices.length;

  const handleRestoreClient = (id: string) => {
    setDeletedClients(prev => prev.filter(c => c.id !== id));
    toast.success('Cliente restaurado correctamente');
  };
  const handlePermanentDeleteClient = (id: string) => {
    setDeletedClients(prev => prev.filter(c => c.id !== id));
    toast.success('Cliente eliminado permanentemente');
  };

  const handleRestoreOrder = (id: string) => {
    setDeletedOrders(prev => prev.filter(o => o.id !== id));
    toast.success('Orden restaurada correctamente');
  };
  const handlePermanentDeleteOrder = (id: string) => {
    setDeletedOrders(prev => prev.filter(o => o.id !== id));
    toast.success('Orden eliminada permanentemente');
  };

  const handleRestoreBudget = (id: string) => {
    setDeletedBudgets(prev => prev.filter(b => b.id !== id));
    toast.success('Presupuesto restaurado correctamente');
  };
  const handlePermanentDeleteBudget = (id: string) => {
    setDeletedBudgets(prev => prev.filter(b => b.id !== id));
    toast.success('Presupuesto eliminado permanentemente');
  };

  const handleRestoreInvoice = (id: string) => {
    setDeletedInvoices(prev => prev.filter(i => i.id !== id));
    toast.success('Factura restaurada correctamente');
  };
  const handlePermanentDeleteInvoice = (id: string) => {
    setDeletedInvoices(prev => prev.filter(i => i.id !== id));
    toast.success('Factura eliminada permanentemente');
  };

  const handleEmptyTrash = () => {
    setDeletedClients([]);
    setDeletedOrders([]);
    setDeletedBudgets([]);
    setDeletedInvoices([]);
    toast.success('Papelera vaciada');
  };

  return (
    <div className="space-y-6">
      {/* Warning banner */}
      <Alert className="bg-red-50 border-red-300">
        <AlertTriangle className="size-5 text-red-600 shrink-0" />
        <AlertDescription className="text-red-800">
          <span className="font-semibold">Atención:</span> Los registros en la papelera se eliminan automáticamente después de <span className="font-bold">{DAYS_UNTIL_DELETE} días</span> sin posibilidad de recuperación. Restaurá los que necesites antes de que expire el plazo.
        </AlertDescription>
      </Alert>

      {/* Summary header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {totalItems === 0 ? 'La papelera está vacía' : `${totalItems} registro${totalItems !== 1 ? 's' : ''} en la papelera`}
          </p>
        </div>
        {totalItems > 0 && (
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
            onClick={handleEmptyTrash}
          >
            <Trash2 className="size-4 mr-2" />
            Vaciar papelera
          </Button>
        )}
      </div>

      {totalItems === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
            <Trash2 className="size-12 text-gray-300" />
            <p className="text-muted-foreground">La papelera está vacía</p>
          </CardContent>
        </Card>
      )}

      {/* ── Clientes eliminados ── */}
      {deletedClients.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-5 text-blue-600" />
              Clientes eliminados
              <Badge variant="secondary">{deletedClients.length}</Badge>
            </CardTitle>
            <CardDescription>Clientes movidos a la papelera</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {deletedClients.map(client => (
              <div key={client.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-red-100 bg-red-50/40">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{client.name}</p>
                    <DaysLeftBadge createdAt={client.createdAt} />
                  </div>
                  <p className="text-xs text-muted-foreground">{client.phone} · {client.email}</p>
                  <p className="text-xs text-muted-foreground">{client.taxId}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50 h-8" onClick={() => handleRestoreClient(client.id)}>
                    <RotateCcw className="size-3.5 mr-1" /> Restaurar
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 h-8" onClick={() => handlePermanentDeleteClient(client.id)}>
                    <Trash2 className="size-3.5 mr-1" /> Borrar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Órdenes de trabajo eliminadas ── */}
      {deletedOrders.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-5 text-orange-600" />
              Órdenes de Trabajo eliminadas
              <Badge variant="secondary">{deletedOrders.length}</Badge>
            </CardTitle>
            <CardDescription>Órdenes de trabajo movidas a la papelera</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {deletedOrders.map(order => {
              const client = mockClients.find(c => c.id === order.clientId);
              const vehicle = mockVehicles.find(v => v.id === order.vehicleId);
              return (
                <div key={order.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-orange-100 bg-orange-50/40">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">OT #{order.id} · {client?.name}</p>
                      <DaysLeftBadge createdAt={order.createdAt} />
                    </div>
                    <p className="text-xs text-muted-foreground">{vehicle?.brand} {vehicle?.model} · {vehicle?.licensePlate}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{order.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="size-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('es-AR')}</span>
                      {order.totalAmount && <span className="text-xs font-medium text-green-600">${order.totalAmount.toLocaleString('es-AR')}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50 h-8" onClick={() => handleRestoreOrder(order.id)}>
                      <RotateCcw className="size-3.5 mr-1" /> Restaurar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 h-8" onClick={() => handlePermanentDeleteOrder(order.id)}>
                      <Trash2 className="size-3.5 mr-1" /> Borrar
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ── Presupuestos eliminados ── */}
      {deletedBudgets.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="size-5 text-violet-600" />
              Presupuestos eliminados
              <Badge variant="secondary">{deletedBudgets.length}</Badge>
            </CardTitle>
            <CardDescription>Presupuestos movidos a la papelera</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {deletedBudgets.map(budget => {
              const client = mockClients.find(c => c.id === budget.clientId);
              const vehicle = mockVehicles.find(v => v.id === budget.vehicleId);
              return (
                <div key={budget.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-violet-100 bg-violet-50/40">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">PRES #{budget.id} · {client?.name}</p>
                      <DaysLeftBadge createdAt={budget.createdAt} />
                    </div>
                    {vehicle && <p className="text-xs text-muted-foreground">{vehicle.brand} {vehicle.model} · {vehicle.licensePlate}</p>}
                    <p className="text-xs text-muted-foreground">{budget.items.map(i => i.description).join(', ')}</p>
                    <p className="text-xs font-medium text-violet-700 mt-0.5">${budget.totalAmount.toLocaleString('es-AR')}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50 h-8" onClick={() => handleRestoreBudget(budget.id)}>
                      <RotateCcw className="size-3.5 mr-1" /> Restaurar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 h-8" onClick={() => handlePermanentDeleteBudget(budget.id)}>
                      <Trash2 className="size-3.5 mr-1" /> Borrar
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ── Facturas eliminadas ── */}
      {deletedInvoices.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="size-5 text-emerald-600" />
              Facturas eliminadas
              <Badge variant="secondary">{deletedInvoices.length}</Badge>
            </CardTitle>
            <CardDescription>Facturas movidas a la papelera</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {deletedInvoices.map(invoice => {
              const client = mockClients.find(c => c.id === invoice.clientId);
              return (
                <div key={invoice.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-emerald-100 bg-emerald-50/40">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm font-mono">{invoice.invoiceNumber}</p>
                      <DaysLeftBadge createdAt={invoice.createdAt} />
                    </div>
                    <p className="text-xs text-muted-foreground">{client?.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{new Date(invoice.createdAt).toLocaleDateString('es-AR')}</span>
                      <span className="text-xs font-medium text-emerald-700">${invoice.totalAmount.toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50 h-8" onClick={() => handleRestoreInvoice(invoice.id)}>
                      <RotateCcw className="size-3.5 mr-1" /> Restaurar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 h-8" onClick={() => handlePermanentDeleteInvoice(invoice.id)}>
                      <Trash2 className="size-3.5 mr-1" /> Borrar
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
