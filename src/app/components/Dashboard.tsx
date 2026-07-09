import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Wrench, CheckCircle, Plus, Search, CalendarDays,
  AlertCircle, RefreshCw, Wifi, ChevronDown, ChevronUp,
  FileText, Clock
} from 'lucide-react';
import { mockClients, mockWorkOrders, mockBudgets, mockVehicles, WorkOrder } from '../lib/mockData';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AuthService } from '../lib/auth';

const mockAgenda = [
  { id: '1', plate: 'AA123BB', client: 'Juan Pérez', service: 'Service completo', hasOT: true },
  { id: '2', plate: 'AB456CD', client: 'María López', service: 'Diagnóstico frenos', hasOT: false },
  { id: '3', plate: 'AC789EF', client: 'Carlos Ruiz', service: 'Entrega vehículo', hasOT: true },
  { id: '4', plate: 'AD012GH', client: 'Laura Gómez', service: 'Cambio de aceite', hasOT: false },
];

export function Dashboard() {
  const [workOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState<Record<string, boolean>>({});
  const toggleMobile = (key: string) => setMobileOpen(prev => ({ ...prev, [key]: !prev[key] }));
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const isTecnico = currentUser?.role === 'tecnico';

  const today = new Date().toISOString().split('T')[0];

  const activeOrders = workOrders.filter(wo => !wo.deleted && !wo.archived && (wo.status === 'abierta' || wo.status === 'en_progreso'));
  const vehiclesReady = workOrders.filter(wo => wo.status === 'cerrada' && wo.closedAt === today);
  const otsWithoutBudget = activeOrders.filter(wo => !mockBudgets.some(b => b.workOrderId === wo.id));
  const budgetsPendingApproval = mockBudgets.filter(b => b.status === 'enviado');
  const agendaWithoutOT = mockAgenda.filter(a => !a.hasOT);
  const totalPending = otsWithoutBudget.length + budgetsPendingApproval.length + agendaWithoutOT.length;

  const filteredOrders = activeOrders.filter(wo => {
    if (!searchTerm) return true;
    const client = mockClients.find(c => c.id === wo.clientId);
    const vehicle = mockVehicles.find(v => v.id === wo.vehicleId);
    return (
      client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.id.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="bg-white rounded-xl border p-5 space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Inicio</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestioná el trabajo diario del taller desde un solo lugar.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/ordenes" state={{ openNew: true }} className="shrink-0">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-11 px-4 gap-2 font-semibold whitespace-nowrap">
              <Plus className="size-4" />Nueva orden de trabajo
            </Button>
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por patente, cliente u OT..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 text-base h-11 w-full"
            />
          </div>
        </div>
      </div>

      {/* ── 4 expandable cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">

        {/* Turnos de hoy */}
        <Card className="flex flex-col overflow-hidden">
          <div className="flex">
            <Link to="/calendario" className="flex-1 block bg-teal-500 hover:bg-teal-600 transition-colors px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-white/80" />
                  <p className="text-sm font-semibold text-white">Turnos de hoy</p>
                </div>
                <span className="text-2xl font-bold text-white">{mockAgenda.length}</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => toggleMobile('turnos')}
              className="lg:hidden bg-teal-600 hover:bg-teal-700 px-2 flex items-center transition-colors"
            >
              {mobileOpen.turnos
                ? <ChevronUp className="size-4 text-white" />
                : <ChevronDown className="size-4 text-white" />}
            </button>
          </div>
          <div className={`${mobileOpen.turnos ? 'block' : 'hidden'} lg:block`}>
            <div className="flex items-center justify-between px-4 py-1.5 border-b bg-gray-50">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Wifi className="size-3 text-green-500" />Google Calendar
              </span>
              <button
                type="button"
                onClick={() => toast.success('Calendario sincronizado')}
                className="text-xs text-muted-foreground hover:text-teal-600 flex items-center gap-0.5 transition-colors"
              >
                <RefreshCw className="size-3" />Sincronizar
              </button>
            </div>
            <div className="flex-1 divide-y divide-gray-100">
              {mockAgenda.map((event, i) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => navigate('/ordenes', { state: event.hasOT ? undefined : { openNew: true } })}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-teal-50/40 transition-colors text-left"
                >
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded shrink-0 w-7 text-center">
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{event.client}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      <span className="font-mono">{event.plate}</span> · {event.service}
                    </p>
                  </div>
                  <span className={`text-xs font-medium shrink-0 ${event.hasOT ? 'text-indigo-600' : 'text-green-600'}`}>
                    {event.hasOT ? 'Ver OT' : 'Crear OT'}
                  </span>
                </button>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t">
              <Link to="/calendario" className="text-xs text-teal-600 hover:underline">Ver agenda completa →</Link>
            </div>
          </div>
        </Card>

        {/* OTs activas */}
        <Card className="flex flex-col overflow-hidden">
          <div className="flex">
            <Link to="/ordenes" className="flex-1 block bg-indigo-500 hover:bg-indigo-600 transition-colors px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="size-4 text-white/80" />
                  <p className="text-sm font-semibold text-white">OTs activas</p>
                </div>
                <span className="text-2xl font-bold text-white">{activeOrders.length}</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => toggleMobile('ots')}
              className="lg:hidden bg-indigo-600 hover:bg-indigo-700 px-2 flex items-center transition-colors"
            >
              {mobileOpen.ots
                ? <ChevronUp className="size-4 text-white" />
                : <ChevronDown className="size-4 text-white" />}
            </button>
          </div>
          <div className={`${mobileOpen.ots ? 'block' : 'hidden'} lg:block flex-1 divide-y divide-gray-100`}>
            {activeOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No hay órdenes activas</p>
            ) : (
              activeOrders.map(order => {
                const client = mockClients.find(c => c.id === order.clientId);
                const vehicle = mockVehicles.find(v => v.id === order.vehicleId);
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => navigate('/ordenes')}
                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-blue-50/40 transition-colors text-left"
                  >
                    <span className="font-mono text-xs font-semibold bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                      {vehicle?.licensePlate ?? '—'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{client?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{order.description}</p>
                    </div>
                    <Badge className={`border-0 text-xs shrink-0 ${order.status === 'en_progreso' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.status === 'en_progreso' ? 'En progreso' : 'Abierta'}
                    </Badge>
                  </button>
                );
              })
            )}
          </div>
          <div className={`${mobileOpen.ots ? 'block' : 'hidden'} lg:block px-4 py-2.5 border-t`}>
            <Link to="/ordenes" className="text-xs text-blue-600 hover:underline">Ver todas →</Link>
          </div>
        </Card>

        {/* Pendientes */}
        <Card className="flex flex-col overflow-hidden">
          <div className="flex">
            <Link to="/ordenes" className={`flex-1 block transition-colors px-4 py-3 ${totalPending > 0 ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-400 hover:bg-gray-500'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-white/80" />
                  <p className="text-sm font-semibold text-white">Pendientes</p>
                </div>
                <span className="text-2xl font-bold text-white">{totalPending}</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => toggleMobile('pendientes')}
              className={`lg:hidden px-2 flex items-center transition-colors ${totalPending > 0 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-500 hover:bg-gray-600'}`}
            >
              {mobileOpen.pendientes
                ? <ChevronUp className="size-4 text-white" />
                : <ChevronDown className="size-4 text-white" />}
            </button>
          </div>
          <div className={`${mobileOpen.pendientes ? 'block' : 'hidden'} lg:block flex-1 divide-y divide-gray-100`}>
            {totalPending === 0 ? (
              <div className="flex items-center gap-2 px-4 py-4">
                <CheckCircle className="size-4 text-green-500 shrink-0" />
                <p className="text-xs text-muted-foreground">Todo al día.</p>
              </div>
            ) : (
              <>
                {agendaWithoutOT.map((event, i) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => navigate('/ordenes', { state: { openNew: true } })}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-amber-50/50 transition-colors text-left"
                  >
                    <div>
                      <p className="text-xs font-medium text-amber-800">Turno #{i + 1} sin OT</p>
                      <p className="text-xs text-muted-foreground"><span className="font-mono">{event.plate}</span> · {event.client}</p>
                    </div>
                    <span className="text-xs text-indigo-600 font-medium shrink-0 ml-2">Crear OT</span>
                  </button>
                ))}
                {budgetsPendingApproval.map(b => {
                  const client = mockClients.find(c => c.id === b.clientId);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => navigate('/ordenes')}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50/50 transition-colors text-left"
                    >
                      <div>
                        <p className="text-xs font-medium text-blue-800">Presupuesto pendiente</p>
                        <p className="text-xs text-muted-foreground">{client?.name} · Sin aprobación</p>
                      </div>
                      <span className="text-xs text-indigo-600 font-medium shrink-0 ml-2">Ver OT</span>
                    </button>
                  );
                })}
                {otsWithoutBudget.map(wo => {
                  const client = mockClients.find(c => c.id === wo.clientId);
                  const vehicle = mockVehicles.find(v => v.id === wo.vehicleId);
                  return (
                    <button
                      key={wo.id}
                      type="button"
                      onClick={() => navigate('/ordenes')}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-amber-50/50 transition-colors text-left"
                    >
                      <div>
                        <p className="text-xs font-medium text-amber-800">OT sin presupuesto</p>
                        <p className="text-xs text-muted-foreground"><span className="font-mono">{vehicle?.licensePlate}</span> · {client?.name}</p>
                      </div>
                      <span className="text-xs text-indigo-600 font-medium shrink-0 ml-2">Ver OT</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </Card>

        {/* Listos para entregar */}
        <Card className="flex flex-col overflow-hidden">
          <div className="flex">
            <Link to="/ordenes" className="flex-1 block bg-green-500 hover:bg-green-600 transition-colors px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-white/80" />
                  <p className="text-sm font-semibold text-white">Listos para entregar</p>
                </div>
                <span className="text-2xl font-bold text-white">{vehiclesReady.length}</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => toggleMobile('listos')}
              className="lg:hidden bg-green-600 hover:bg-green-700 px-2 flex items-center transition-colors"
            >
              {mobileOpen.listos
                ? <ChevronUp className="size-4 text-white" />
                : <ChevronDown className="size-4 text-white" />}
            </button>
          </div>
          <div className={`${mobileOpen.listos ? 'block' : 'hidden'} lg:block flex-1 divide-y divide-gray-100`}>
            {vehiclesReady.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">Sin vehículos listos hoy</p>
            ) : (
              vehiclesReady.map(order => {
                const client = mockClients.find(c => c.id === order.clientId);
                const vehicle = mockVehicles.find(v => v.id === order.vehicleId);
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => navigate('/ordenes')}
                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-green-50/40 transition-colors text-left"
                  >
                    <span className="font-mono text-xs font-semibold bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                      {vehicle?.licensePlate ?? '—'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{client?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{vehicle?.brand} {vehicle?.model}</p>
                    </div>
                    <span className="text-xs text-indigo-600 font-medium shrink-0">Ver OT</span>
                  </button>
                );
              })
            )}
          </div>
        </Card>
      </div>


    </div>
  );
}
