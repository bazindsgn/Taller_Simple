import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { mockBudgets, mockClients, mockVehicles, mockWorkOrders, Budget } from '../lib/mockData';
import {
  Search, FileText, DollarSign, Send, Wrench,
  Archive, ArchiveRestore, LayoutList, Columns3,
  Info, ExternalLink, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { ColumnFilter, DateFilterType } from './ColumnFilter';

type SortField = 'id' | 'client' | 'vehicle' | 'status' | 'date' | 'amount';

function filterByDate(dateStr: string, dateFilter: DateFilterType, customFrom: string, customTo: string): boolean {
  if (dateFilter === 'all') return true;
  const itemDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  switch (dateFilter) {
    case 'today': return dateStr === today.toISOString().split('T')[0];
    case 'week': { const w = new Date(today); w.setDate(w.getDate() - 7); return itemDate >= w; }
    case 'month': return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
    case 'lastMonth': { const lm = new Date(today); lm.setMonth(lm.getMonth() - 1); return itemDate.getMonth() === lm.getMonth() && itemDate.getFullYear() === lm.getFullYear(); }
    case 'custom': { if (!customFrom && !customTo) return true; const f = customFrom ? new Date(customFrom) : new Date(0); const t = customTo ? new Date(customTo + 'T23:59:59') : new Date(); return itemDate >= f && itemDate <= t; }
    default: return true;
  }
}

export function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [pageView, setPageView] = useState<'list' | 'detail'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const navigate = useNavigate();

  const filteredBudgets = budgets.filter(budget => {
    if (budget.status === 'eliminado') return false;
    if (!showArchived && budget.archived) return false;
    if (showArchived && !budget.archived) return false;
    const client = mockClients.find(c => c.id === budget.clientId);
    const vehicle = mockVehicles.find(v => v.id === budget.vehicleId);
    const matchesSearch =
      client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.id.includes(searchTerm);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(budget.status);
    const matchesDate = budget.status === 'borrador' ? true : filterByDate(budget.createdAt, dateFilter, customDateFrom, customDateTo);
    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a, b) => {
    const m = sortDirection === 'asc' ? 1 : -1;
    const clientA = mockClients.find(c => c.id === a.clientId);
    const clientB = mockClients.find(c => c.id === b.clientId);
    const vehicleA = mockVehicles.find(v => v.id === a.vehicleId);
    const vehicleB = mockVehicles.find(v => v.id === b.vehicleId);
    switch (sortField) {
      case 'id': return m * (parseInt(a.id) - parseInt(b.id));
      case 'client': return m * (clientA?.name || '').localeCompare(clientB?.name || '');
      case 'vehicle': return m * (`${vehicleA?.brand} ${vehicleA?.model}`).localeCompare(`${vehicleB?.brand} ${vehicleB?.model}`);
      case 'amount': return m * (a.totalAmount - b.totalAmount);
      case 'status': return m * a.status.localeCompare(b.status);
      case 'date': return m * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default: return 0;
    }
  });

  const borradorCount = budgets.filter(b => b.status === 'borrador').length;
  const enviadoCount = budgets.filter(b => b.status === 'enviado').length;
  const aprobadoCount = budgets.filter(b => b.status === 'aprobado').length;

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field as SortField);
    setSortDirection(direction);
  };

  const handleApproveBudget = (budgetId: string) => {
    setBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, status: 'aprobado' } : b));
    toast.success('Presupuesto marcado como aprobado');
  };

  const handleSendBudget = (budgetId: string) => {
    setBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, status: 'enviado', sentAt: new Date().toISOString().split('T')[0] } : b));
    toast.success('Presupuesto enviado al cliente');
  };

  const handleArchive = (id: string, archive: boolean) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, archived: archive } : b));
    toast.success(archive ? 'Presupuesto archivado' : 'Presupuesto restaurado');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'borrador': return <Badge className="bg-gray-100 text-gray-700 border-0">Borrador</Badge>;
      case 'enviado': return <Badge className="bg-blue-100 text-blue-800 border-0">Enviado</Badge>;
      case 'aprobado': return <Badge className="bg-green-100 text-green-800 border-0">Aprobado</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-700 border-0">{status}</Badge>;
    }
  };

  const cfProps = { currentSortField: sortField, currentSortDirection: sortDirection, onSort: handleSort };

  const statusOptions = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'aprobado', label: 'Aprobado' },
  ];

  // ── Detail page view ──
  if (pageView === 'detail' && selectedBudget) {
    const client = mockClients.find(c => c.id === selectedBudget.clientId);
    const vehicle = mockVehicles.find(v => v.id === selectedBudget.vehicleId);
    const workOrder = mockWorkOrders.find(wo => wo.id === selectedBudget.workOrderId);
    return (
      <div className="max-w-2xl space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setPageView('list')} className="gap-1.5 text-muted-foreground hover:text-gray-800">
            <ArrowLeft className="size-4" />Volver a presupuestos
          </Button>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Presupuesto #{selectedBudget.id}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {client?.name}
              {vehicle && <> · <span className="font-mono font-semibold">{vehicle.licensePlate}</span> {vehicle.brand} {vehicle.model}</>}
            </p>
          </div>
          {getStatusBadge(selectedBudget.status)}
        </div>

        {workOrder ? (
          <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <ExternalLink className="size-4 text-indigo-600 shrink-0" />
            <span className="text-sm text-indigo-800">
              Asociado a la <button className="font-semibold underline" onClick={() => navigate('/ordenes')}>Orden de Trabajo #{workOrder.id}</button>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="text-sm text-amber-800">Sin OT asignada. Los presupuestos siempre deben estar vinculados a una OT.</span>
          </div>
        )}

        <div className="bg-white rounded-xl border p-5 space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ítems del presupuesto</p>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-muted-foreground">
                <tr><th className="text-left px-3 py-2">Descripción</th><th className="text-center px-3 py-2">Cant.</th><th className="text-right px-3 py-2 w-24">Precio</th><th className="text-right px-3 py-2 w-24">Total</th></tr>
              </thead>
              <tbody>
                {selectedBudget.items.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                    <td className="px-3 py-2">{item.description}</td>
                    <td className="px-3 py-2 text-center">{item.quantity}</td>
                    <td className="px-3 py-2 text-right">${item.unitPrice.toLocaleString('es-AR')}</td>
                    <td className="px-3 py-2 text-right font-medium">${item.total.toLocaleString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-indigo-50 border-t">
                <tr>
                  <td colSpan={3} className="px-3 py-2 text-right font-semibold">Total</td>
                  <td className="px-3 py-2 text-right font-bold text-indigo-700 text-base">${selectedBudget.totalAmount.toLocaleString('es-AR')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {selectedBudget.comments && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Notas</p>
              <p className="text-sm bg-gray-50 rounded-lg p-3 border">{selectedBudget.comments}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {selectedBudget.status === 'borrador' && (
            <Button variant="outline" className="gap-2" onClick={() => { handleSendBudget(selectedBudget.id); setSelectedBudget(prev => prev ? { ...prev, status: 'enviado' } : prev); }}>
              <Send className="size-4" />Marcar como enviado
            </Button>
          )}
          {selectedBudget.status === 'enviado' && (
            <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => { handleApproveBudget(selectedBudget.id); setSelectedBudget(prev => prev ? { ...prev, status: 'aprobado' } : prev); }}>
              <DollarSign className="size-4" />Aprobar presupuesto
            </Button>
          )}
          {workOrder && (
            <Button variant="outline" className="gap-2" onClick={() => navigate('/ordenes')}>
              <Wrench className="size-4" />Ver OT asociada
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Info banner ── */}
      <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <Info className="size-4 text-indigo-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-indigo-800">Los presupuestos siempre están asociados a una OT</p>
          <p className="text-xs text-indigo-600 mt-0.5">
            Para crear un presupuesto, ingresá a la Orden de Trabajo correspondiente. Esta sección es solo de consulta.
          </p>
          <Button
            size="sm"
            variant="link"
            className="h-6 px-0 text-xs text-indigo-700 font-semibold mt-1 gap-1"
            onClick={() => navigate('/ordenes')}
          >
            <Wrench className="size-3" />
            Ir a Órdenes de Trabajo
          </Button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Borradores</p>
              <div className="bg-gray-100 p-1.5 rounded-lg"><FileText className="size-3.5 text-gray-600" /></div>
            </div>
            <p className="text-2xl font-bold">{borradorCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">en elaboración</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Enviados</p>
              <div className="bg-blue-100 p-1.5 rounded-lg"><Send className="size-3.5 text-blue-600" /></div>
            </div>
            <p className="text-2xl font-bold">{enviadoCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">esperando aprobación</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Aprobados</p>
              <div className="bg-green-100 p-1.5 rounded-lg"><DollarSign className="size-3.5 text-green-600" /></div>
            </div>
            <p className="text-2xl font-bold">{aprobadoCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">cliente confirmó</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main card ── */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-base">Presupuestos</CardTitle>
            <div className="inline-flex rounded-lg border bg-background p-1">
              <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="gap-1.5 text-xs">
                <LayoutList className="size-3.5" />Lista
              </Button>
              <Button variant={viewMode === 'kanban' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('kanban')} className="gap-1.5 text-xs">
                <Columns3 className="size-3.5" />Kanban
              </Button>
            </div>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Buscar por cliente, patente o ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant={showArchived ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
              className={showArchived ? 'bg-amber-600 hover:bg-amber-700 text-white text-xs' : 'text-amber-700 border-amber-300 hover:bg-amber-50 text-xs'}
            >
              <Archive className="size-3.5 mr-1.5" />
              {showArchived ? 'Viendo archivados' : 'Ver archivados'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><ColumnFilter {...cfProps} label="ID" sortField="id" /></TableHead>
                    <TableHead><ColumnFilter {...cfProps} label="Cliente" sortField="client" /></TableHead>
                    <TableHead><ColumnFilter {...cfProps} label="Vehículo" sortField="vehicle" /></TableHead>
                    <TableHead><ColumnFilter {...cfProps} label="Monto" sortField="amount" /></TableHead>
                    <TableHead>
                      <ColumnFilter {...cfProps} label="Estado" sortField="status" statusOptions={statusOptions} selectedStatuses={selectedStatuses} onStatusChange={setSelectedStatuses} />
                    </TableHead>
                    <TableHead>
                      <ColumnFilter {...cfProps} label="Fecha" sortField="date" showDateFilter dateFilter={dateFilter} onDateFilterChange={setDateFilter} customDateFrom={customDateFrom} customDateTo={customDateTo} onCustomDateFromChange={setCustomDateFrom} onCustomDateToChange={setCustomDateTo} />
                    </TableHead>
                    <TableHead>OT Asociada</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBudgets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        No se encontraron presupuestos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBudgets.map(budget => {
                      const client = mockClients.find(c => c.id === budget.clientId);
                      const vehicle = mockVehicles.find(v => v.id === budget.vehicleId);
                      const workOrder = mockWorkOrders.find(wo => wo.id === budget.workOrderId);
                      return (
                        <TableRow
                          key={budget.id}
                          className={`cursor-pointer hover:bg-indigo-50/40 transition-colors ${budget.archived ? 'opacity-60 bg-amber-50/40' : ''}`}
                          onClick={() => { setSelectedBudget(budget); setPageView('detail'); }}
                        >
                          <TableCell className="font-medium text-xs text-muted-foreground">#{budget.id}</TableCell>
                          <TableCell>
                            <p className="font-medium text-sm">{client?.name}</p>
                            {budget.archived && <Badge variant="outline" className="text-xs mt-1 text-amber-600 border-amber-300">Archivado</Badge>}
                          </TableCell>
                          <TableCell>
                            <p className="font-mono text-xs font-semibold">{vehicle?.licensePlate ?? '—'}</p>
                            <p className="text-xs text-muted-foreground">{vehicle?.brand} {vehicle?.model}</p>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600 text-sm">
                            ${budget.totalAmount.toLocaleString('es-AR')}
                          </TableCell>
                          <TableCell>{getStatusBadge(budget.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(budget.createdAt).toLocaleDateString('es-AR')}
                          </TableCell>
                          <TableCell>
                            {workOrder ? (
                              <span className="text-xs text-indigo-600">OT #{workOrder.id}</span>
                            ) : (
                              <span className="text-xs text-amber-600 italic">Sin OT</span>
                            )}
                          </TableCell>
                          <TableCell onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              {budget.status === 'borrador' && (
                                <Button variant="ghost" size="icon" className="size-7" title="Marcar como enviado" onClick={() => handleSendBudget(budget.id)}>
                                  <Send className="size-3.5 text-blue-600" />
                                </Button>
                              )}
                              {budget.status === 'enviado' && (
                                <Button variant="ghost" size="icon" className="size-7" title="Aprobar" onClick={() => handleApproveBudget(budget.id)}>
                                  <DollarSign className="size-3.5 text-green-600" />
                                </Button>
                              )}
                              {budget.archived ? (
                                <Button variant="ghost" size="icon" className="size-7" onClick={() => handleArchive(budget.id, false)}>
                                  <ArchiveRestore className="size-3.5 text-amber-600" />
                                </Button>
                              ) : (
                                <Button variant="ghost" size="icon" className="size-7" onClick={() => handleArchive(budget.id, true)}>
                                  <Archive className="size-3.5 text-muted-foreground" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Kanban view */
            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-max pb-4">
                {[
                  { key: 'borrador', title: 'Borrador', desc: 'En elaboración', bg: 'bg-gray-50', border: 'border-gray-200', cardBorder: 'border-l-gray-400', badge: 'bg-gray-100 text-gray-800' },
                  { key: 'enviado', title: 'Enviado', desc: 'Esperando respuesta', bg: 'bg-blue-50', border: 'border-blue-200', cardBorder: 'border-l-blue-400', badge: 'bg-blue-100 text-blue-800' },
                  { key: 'aprobado', title: 'Aprobado', desc: 'Cliente confirmó', bg: 'bg-green-50', border: 'border-green-200', cardBorder: 'border-l-green-400', badge: 'bg-green-100 text-green-800' },
                ].map(col => {
                  const colBudgets = filteredBudgets.filter(b => b.status === col.key);
                  return (
                    <div key={col.key} className="flex-shrink-0 w-72 space-y-3">
                      <div className={`flex items-center justify-between px-3 py-2 ${col.bg} rounded-lg border ${col.border}`}>
                        <div>
                          <h3 className="font-semibold text-sm">{col.title}</h3>
                          <p className="text-xs text-muted-foreground">{col.desc}</p>
                        </div>
                        <Badge className={`${col.badge} border-0`}>{colBudgets.length}</Badge>
                      </div>
                      <div className="space-y-3">
                        {colBudgets.map(budget => {
                          const client = mockClients.find(c => c.id === budget.clientId);
                          const vehicle = mockVehicles.find(v => v.id === budget.vehicleId);
                          const workOrder = mockWorkOrders.find(wo => wo.id === budget.workOrderId);
                          return (
                            <Card
                              key={budget.id}
                              className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${col.cardBorder}`}
                              onClick={() => { setSelectedBudget(budget); setPageView('detail'); }}
                            >
                              <CardContent className="p-3 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs text-muted-foreground">PRES #{budget.id}</span>
                                  {budget.archived && <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 shrink-0">Archivado</Badge>}
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">{client?.name}</p>
                                  {vehicle && <p className="text-xs text-muted-foreground">{vehicle.brand} {vehicle.model} · <span className="font-mono">{vehicle.licensePlate}</span></p>}
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t text-xs">
                                  <span className="text-muted-foreground">{new Date(budget.createdAt).toLocaleDateString('es-AR')}</span>
                                  <span className="font-semibold text-green-600">${budget.totalAmount.toLocaleString('es-AR')}</span>
                                </div>
                                {workOrder && (
                                  <p className="text-xs text-indigo-600">OT #{workOrder.id}</p>
                                )}
                                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                  {col.key === 'borrador' && (
                                    <Button size="sm" variant="outline" className="flex-1 h-7 text-xs gap-1" onClick={() => handleSendBudget(budget.id)}>
                                      <Send className="size-3" />Enviar
                                    </Button>
                                  )}
                                  {col.key === 'enviado' && (
                                    <Button size="sm" className="flex-1 h-7 text-xs gap-1 bg-green-600 hover:bg-green-700" onClick={() => handleApproveBudget(budget.id)}>
                                      <DollarSign className="size-3" />Aprobar
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                        {colBudgets.length === 0 && (
                          <div className="border border-dashed rounded-lg p-6 text-center text-xs text-muted-foreground">
                            Sin presupuestos en este estado
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
