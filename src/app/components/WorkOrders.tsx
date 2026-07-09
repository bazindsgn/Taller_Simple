import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockWorkOrders, mockClients, mockVehicles, mockBudgets, WorkOrder } from '../lib/mockData';
import {
  Search, FileText, Clock, CheckCircle, Receipt, Mail,
  MessageCircle, LayoutList, Columns3, Trash2, Archive,
  ArchiveRestore, Car, User, Wrench, DollarSign,
  Plus, AlertCircle, Eye, ArrowLeft, Loader2, Check,
  Download, Send, ChevronDown, ChevronUp, Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router';
import { ColumnFilter, DateFilterType } from './ColumnFilter';

type SortField = 'id' | 'name' | 'status' | 'date';
type PageView = 'list' | 'new-form' | 'detail';
type PlateStatus = 'idle' | 'checking' | 'found' | 'not-found' | 'invalid';

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



// ── New OT inline form ──
function NewOTForm({
  onBack,
  onCreated,
}: {
  onBack: () => void;
  onCreated: () => void;
}) {
  const [plate, setPlate] = useState('');
  const [plateStatus, setPlateStatus] = useState<PlateStatus>('idle');
  const [foundVehicle, setFoundVehicle] = useState<typeof mockVehicles[0] | null>(null);
  const [foundClient, setFoundClient] = useState<typeof mockClients[0] | null>(null);
  const [skipPlate, setSkipPlate] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form is unlocked when: plate found (and user confirmed), plate not found, or user skipped plate
  const plateConfirmed = plateStatus === 'not-found' || skipPlate || (plateStatus === 'found');
  const unlocked = plateConfirmed;

  const checkPlate = (value: string) => {
    const clean = value.trim().toUpperCase();
    if (!clean || clean.length < 6) { setPlateStatus('idle'); return; }
    setPlateStatus('checking');
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    checkTimeoutRef.current = setTimeout(() => {
      const vehicle = mockVehicles.find(v => v.licensePlate.toUpperCase() === clean);
      if (vehicle) {
        const client = mockClients.find(c => c.id === vehicle.clientId) ?? null;
        setFoundVehicle(vehicle);
        setFoundClient(client);
        setPlateStatus('found');
      } else {
        setFoundVehicle(null);
        setFoundClient(null);
        setPlateStatus('not-found');
      }
    }, 500);
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/\s/g, '');
    setPlate(val);
    setSkipPlate(false);
    setPlateStatus('idle');
    setFoundVehicle(null);
    setFoundClient(null);
    checkPlate(val);
  };

  const handleSkipPlate = () => {
    setSkipPlate(true);
    setFoundVehicle(null);
    setFoundClient(null);
  };

  const historyOrders = foundVehicle
    ? mockWorkOrders.filter(wo => wo.vehicleId === foundVehicle.id)
    : [];

  const lockedCls = 'opacity-40';

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 text-muted-foreground hover:text-gray-800">
        <ArrowLeft className="size-4" />Volver a órdenes
      </Button>

      <div>
        <h2 className="text-xl font-semibold">Nueva Orden de Trabajo</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ingresá la patente para identificar el vehículo. El resto del formulario se habilitará automáticamente.
        </p>
      </div>

      <form
        onSubmit={e => { e.preventDefault(); toast.success('Orden de trabajo creada exitosamente'); onCreated(); }}
        className="space-y-4"
      >
        {/* ── 1. Vehículo ── */}
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">1. Vehículo</p>

          {/* Plate row */}
          <div className="space-y-2">
            <Label htmlFor="plate" className="text-sm font-medium">
              Patente <span className="text-muted-foreground font-normal text-xs">(sin espacios)</span>
            </Label>

            <div className="flex gap-2 items-center flex-wrap">
              <div className="flex gap-2 items-center">
                <Input
                  id="plate"
                  value={plate}
                  onChange={handlePlateChange}
                  placeholder="Ej: AA123BB"
                  className="font-mono text-base tracking-widest uppercase w-40"
                  maxLength={10}
                  disabled={skipPlate}
                />
                {plateStatus === 'checking' && <Loader2 className="size-4 animate-spin text-muted-foreground shrink-0" />}
                {(plateStatus === 'found' || plateStatus === 'not-found') && <Check className="size-4 text-green-500 shrink-0" />}
              </div>

              {!skipPlate ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSkipPlate}
                  className="text-xs shrink-0"
                >
                  Ingresar sin patente
                </Button>
              ) : (
                <span className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="size-3" />Sin patente — completá los datos manualmente
                </span>
              )}
            </div>

            {/* Inline plate feedback */}
            {plateStatus === 'not-found' && !skipPlate && (
              <p className="text-xs text-green-700 flex items-center gap-1.5">
                <Check className="size-3.5 shrink-0" />
                Patente disponible. Completá los datos del vehículo y del cliente.
              </p>
            )}

            {plateStatus === 'found' && foundVehicle && !skipPlate && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 space-y-2">
                <p className="text-xs font-semibold text-green-800 flex items-center gap-1.5">
                  <Check className="size-3.5" />Vehículo encontrado — datos cargados automáticamente
                </p>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
                  <div><span className="text-muted-foreground">Patente</span><p className="font-mono font-bold">{foundVehicle.licensePlate}</p></div>
                  <div><span className="text-muted-foreground">Vehículo</span><p className="font-medium">{foundVehicle.brand} {foundVehicle.model}</p></div>
                  <div><span className="text-muted-foreground">Cliente</span><p className="font-medium">{foundClient?.name}</p></div>
                </div>
                {historyOrders.length > 0 && (
                  <button type="button" onClick={() => setShowHistory(p => !p)} className="text-xs text-indigo-600 underline underline-offset-2">
                    {showHistory ? 'Ocultar' : 'Ver'} historial ({historyOrders.length} OT{historyOrders.length > 1 ? 's' : ''})
                  </button>
                )}
                {showHistory && (
                  <div className="border rounded overflow-hidden mt-1">
                    {historyOrders.map((wo, i) => (
                      <div key={wo.id} className={`flex items-center gap-3 px-3 py-2 text-xs ${i > 0 ? 'border-t' : ''}`}>
                        <span className="text-muted-foreground shrink-0">#{wo.id}</span>
                        <span className="flex-1 truncate">{wo.description}</span>
                        <span className="text-muted-foreground shrink-0">{new Date(wo.createdAt).toLocaleDateString('es-AR')}</span>
                        <Badge className={`border-0 text-xs shrink-0 ${wo.status === 'cerrada' ? 'bg-green-100 text-green-800' : wo.status === 'en_progreso' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {wo.status === 'cerrada' ? 'Cerrada' : wo.status === 'en_progreso' ? 'En progreso' : 'Abierta'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rest of vehicle fields — locked until unlocked */}
          <fieldset disabled={!unlocked} className={`border-0 p-0 m-0 grid grid-cols-2 gap-3 transition-opacity duration-300 ${unlocked ? '' : lockedCls}`}>
            {plateStatus === 'found' && foundVehicle ? (
              /* Pre-filled read-only fields when vehicle found */
              <>
                {[
                  ['Marca', foundVehicle.brand],
                  ['Modelo', foundVehicle.model],
                  ['Año', foundVehicle.year?.toString()],
                  ['Color', foundVehicle.color],
                  ['VIN / Chasis', foundVehicle.vin],
                ].map(([label, value]) => (
                  <div key={label} className="space-y-1.5">
                    <Label className="text-xs">{label}</Label>
                    <Input value={value ?? ''} readOnly className="bg-gray-50 text-muted-foreground" />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <Label className="text-xs">KM actual</Label>
                  <Input type="number" placeholder="Ej: 82500" />
                </div>
              </>
            ) : (
              /* Empty editable fields */
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">Marca {unlocked && <span className="text-red-500">*</span>}</Label>
                  <Input placeholder="Ej: Volkswagen" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Modelo {unlocked && <span className="text-red-500">*</span>}</Label>
                  <Input placeholder="Ej: Golf" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Año</Label>
                  <Input type="number" placeholder="2020" min="1900" max="2030" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Color</Label>
                  <Input placeholder="Ej: Blanco" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">VIN / Chasis</Label>
                  <Input placeholder="Número de chasis" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Motor</Label>
                  <Input placeholder="Ej: 1.4 TSI" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Código de radio</Label>
                  <Input placeholder="Ej: 1234" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Código de llave</Label>
                  <Input placeholder="Ej: KL9900" />
                </div>
              </>
            )}
          </fieldset>

          {!unlocked && (
            <p className="text-xs text-muted-foreground text-center py-1">
              Ingresá la patente para habilitar estos campos
            </p>
          )}
        </div>

        {/* ── 2. Cliente ── */}
        <fieldset disabled={!unlocked} className={`bg-white rounded-xl border p-5 space-y-4 transition-opacity duration-300 ${unlocked ? '' : lockedCls}`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">2. Cliente</p>
            {!unlocked && <span className="text-xs text-muted-foreground">Bloqueado hasta ingresar patente</span>}
          </div>

          {plateStatus === 'found' && foundClient ? (
            /* Pre-filled client when vehicle found */
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Razón social / Nombre', foundClient.name],
                ['Teléfono', foundClient.phone],
                ['Email', foundClient.email],
                ['Dirección', foundClient.address],
                ['CUIT', foundClient.taxId],
              ].map(([label, value]) => (
                <div key={label} className="space-y-1.5">
                  <Label className="text-xs">{label}</Label>
                  <Input value={value ?? ''} readOnly className="bg-gray-50 text-muted-foreground" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">Razón social / Nombre <span className="text-red-500">*</span></Label>
                <Input placeholder="Nombre completo o empresa" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Condición fiscal</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Responsable Inscripto</SelectItem>
                    <SelectItem value="B">Consumidor Final</SelectItem>
                    <SelectItem value="C">Exento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Teléfono</Label>
                <Input placeholder="11 2345-6789" type="tel" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input placeholder="cliente@email.com" type="email" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Dirección</Label>
                <Input placeholder="Calle 123" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Número</Label>
                <Input placeholder="456" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Piso / Dpto</Label>
                <Input placeholder="2 B" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Localidad</Label>
                <Input placeholder="Ej: Palermo" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Provincia</Label>
                <Input placeholder="Ej: Buenos Aires" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Código postal</Label>
                <Input placeholder="1425" />
              </div>
            </div>
          )}
        </fieldset>

        {/* ── 3. Datos de la OT ── */}
        <fieldset disabled={!unlocked} className={`bg-white rounded-xl border p-5 space-y-4 transition-opacity duration-300 ${unlocked ? '' : lockedCls}`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">3. Datos de la OT</p>
            {!unlocked && <span className="text-xs text-muted-foreground">Bloqueado hasta ingresar patente</span>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Fecha de ingreso <span className="text-red-500">*</span></Label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">KM al ingreso</Label>
              <Input type="number" placeholder="Ej: 82500" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Servicio solicitado <span className="text-red-500">*</span></Label>
              <Input placeholder="Ej: Service completo, cambio de frenos..." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Estado inicial</Label>
              <Select defaultValue="abierta">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="abierta">Abierta</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Total OT (opcional)</Label>
              <Input type="number" placeholder="0.00" step="0.01" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Descripción del trabajo</Label>
              <Textarea placeholder="Detallar el trabajo a realizar..." rows={3} />
            </div>
          </div>
        </fieldset>

        {/* ── Submit ── */}
        <div className="flex items-center justify-between bg-white rounded-xl border p-4">
          <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
          <Button
            type="submit"
            disabled={!unlocked}
            className="bg-indigo-600 hover:bg-indigo-700 gap-2 disabled:opacity-40"
          >
            <FileText className="size-4" />Crear Orden de Trabajo
          </Button>
        </div>
      </form>
    </div>
  );
}

// ── OT Detail Page ──
function OTDetailPage({
  order,
  onBack,
  onUpdateStatus,
  postCloseNotice,
  onDismissNotice,
  navigate,
}: {
  order: WorkOrder;
  onBack: () => void;
  onUpdateStatus: (id: string, status: WorkOrder['status']) => void;
  postCloseNotice: { order: WorkOrder; client: any } | null;
  onDismissNotice: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const client = mockClients.find(c => c.id === order.clientId);
  const vehicle = mockVehicles.find(v => v.id === order.vehicleId);
  const budget = mockBudgets.find(b => b.workOrderId === order.id);

  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showPdfOptions, setShowPdfOptions] = useState(false);
  const [budgetItems, setBudgetItems] = useState([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 },
  ]);
  const [invoiceDraft, setInvoiceDraft] = useState(false);

  const addBudgetItem = () =>
    setBudgetItems(prev => [...prev, { id: String(prev.length + 1), description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  const removeBudgetItem = (id: string) =>
    setBudgetItems(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);
  const updateItem = (id: string, field: string, raw: string) => {
    setBudgetItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: field === 'description' ? raw : parseFloat(raw) || 0 };
      if (field === 'quantity' || field === 'unitPrice') updated.total = updated.quantity * updated.unitPrice;
      return updated;
    }));
  };
  const budgetTotal = budgetItems.reduce((s, i) => s + i.total, 0);

  const statusBadge = () => {
    switch (order.status) {
      case 'abierta': return <Badge className="bg-yellow-100 text-yellow-800 border-0">Abierta</Badge>;
      case 'en_progreso': return <Badge className="bg-blue-100 text-blue-800 border-0">En Progreso</Badge>;
      case 'cerrada': return <Badge className="bg-green-100 text-green-800 border-0">Cerrada</Badge>;
    }
  };

  // Determine next logical action
  const nextAction = !budget ? 'presupuesto'
    : budget.status === 'aprobado' ? 'factura'
    : 'pdf';

  const whatsappUrl = client?.phone
    ? `https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${client.name}, le informamos sobre su vehículo ${vehicle?.licensePlate}.`)}`
    : null;

  return (
    <div className="max-w-3xl space-y-5">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 text-muted-foreground hover:text-gray-800">
        <ArrowLeft className="size-4" />Volver a órdenes
      </Button>

      {/* Header */}
      <div className="bg-white rounded-xl border p-4 space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold">OT #{order.id}</h2>
              {statusBadge()}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-mono font-bold">{vehicle?.licensePlate}</span>
              {' · '}{vehicle?.brand} {vehicle?.model}
              {' · '}{client?.name}
            </p>
          </div>
          {order.status !== 'cerrada' && (
            <div className="flex gap-2 shrink-0 flex-wrap">
              {order.status === 'abierta' && (
                <Button variant="outline" size="sm" onClick={() => onUpdateStatus(order.id, 'en_progreso')}>
                  <Clock className="size-4 mr-1.5" />Marcar En Progreso
                </Button>
              )}
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => onUpdateStatus(order.id, 'cerrada')}>
                <CheckCircle className="size-4 mr-1.5" />Cerrar Orden
              </Button>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {/* Primary adaptive action */}
          {nextAction === 'presupuesto' && (
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"
              onClick={() => { setShowBudgetForm(true); setShowInvoiceForm(false); setShowPdfOptions(false); }}
            >
              <DollarSign className="size-4" />Armar presupuesto
            </Button>
          )}
          {nextAction === 'factura' && (
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"
              onClick={() => { setShowInvoiceForm(true); setShowBudgetForm(false); setShowPdfOptions(false); }}
            >
              <Receipt className="size-4" />Armar factura
            </Button>
          )}

          {/* Always visible secondaries */}
          {!showBudgetForm && nextAction !== 'presupuesto' && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setShowBudgetForm(true); setShowInvoiceForm(false); setShowPdfOptions(false); }}>
              <DollarSign className="size-4" />Presupuesto
            </Button>
          )}
          {!showInvoiceForm && nextAction !== 'factura' && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setShowInvoiceForm(true); setShowBudgetForm(false); setShowPdfOptions(false); }}>
              <Receipt className="size-4" />Factura
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => { setShowPdfOptions(p => !p); setShowBudgetForm(false); setShowInvoiceForm(false); }}
          >
            <Download className="size-4" />Exportar PDF
            {showPdfOptions ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </Button>
          {whatsappUrl ? (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 text-green-700 border-green-300 hover:bg-green-50">
                <MessageCircle className="size-4" />Enviar por WhatsApp
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground" disabled title="El cliente no tiene teléfono cargado">
              <MessageCircle className="size-4" />WhatsApp
            </Button>
          )}
        </div>

        {/* WhatsApp warning if no phone */}
        {!client?.phone && (
          <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <Phone className="size-3.5 shrink-0 mt-0.5" />
            <span>Este cliente no tiene teléfono cargado. Agregá un teléfono para poder enviar por WhatsApp.</span>
          </div>
        )}

        {/* PDF options panel */}
        {showPdfOptions && (
          <div className="border rounded-xl p-3 space-y-2 bg-gray-50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Seleccioná qué exportar</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Exportar OT', desc: 'Datos completos de la orden' },
                { label: 'Exportar presupuesto', desc: 'Ítems y totales', disabled: !budget },
                { label: 'Exportar factura', desc: 'Documento de cobro', disabled: !invoiceDraft },
              ].map(({ label, desc, disabled }) => (
                <button
                  key={label}
                  disabled={disabled}
                  onClick={() => { toast.success(`${label} generado (simulación)`); setShowPdfOptions(false); }}
                  className={`flex flex-col items-start px-3 py-2 rounded-lg border text-left transition-colors ${
                    disabled
                      ? 'opacity-40 cursor-not-allowed bg-white border-gray-200'
                      : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer'
                  }`}
                >
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Budget inline form / section */}
      {(showBudgetForm || budget) && (
        <div className="bg-white rounded-xl border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <DollarSign className="size-3.5" />Presupuesto
            </p>
            {budget && (
              <Badge className={budget.status === 'aprobado' ? 'bg-green-100 text-green-800 border-0' : budget.status === 'enviado' ? 'bg-blue-100 text-blue-800 border-0' : 'bg-gray-100 text-gray-800 border-0'}>
                {budget.status === 'borrador' ? 'Borrador' : budget.status === 'enviado' ? 'Enviado' : 'Aprobado'}
              </Badge>
            )}
          </div>

          {budget ? (
            /* Existing budget */
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-muted-foreground">
                  <tr><th className="text-left px-3 py-2">Ítem</th><th className="text-center px-3 py-2">Cant.</th><th className="text-right px-3 py-2">P. Unit.</th><th className="text-right px-3 py-2">Total</th></tr>
                </thead>
                <tbody>
                  {budget.items.map((item, i) => (
                    <tr key={item.id} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                      <td className="px-3 py-2">{item.description}</td>
                      <td className="px-3 py-2 text-center">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">${item.unitPrice.toLocaleString('es-AR')}</td>
                      <td className="px-3 py-2 text-right font-medium">${item.total.toLocaleString('es-AR')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-indigo-50 border-t">
                  <tr><td colSpan={3} className="px-3 py-2 text-right font-semibold text-sm">Total</td><td className="px-3 py-2 text-right font-bold text-indigo-700">${budget.totalAmount.toLocaleString('es-AR')}</td></tr>
                </tfoot>
              </table>
            </div>
          ) : showBudgetForm ? (
            /* Inline budget creation form */
            <form onSubmit={e => { e.preventDefault(); toast.success('Presupuesto guardado'); setShowBudgetForm(false); }} className="space-y-3">
              <div className="space-y-2">
                {budgetItems.map((item, i) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Input
                        placeholder="Descripción"
                        value={item.description}
                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                        className="text-sm h-8"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" placeholder="Cant." min="1" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', e.target.value)} className="text-sm h-8 text-center" />
                    </div>
                    <div className="col-span-3">
                      <Input type="number" placeholder="Precio unit." min="0" step="0.01" value={item.unitPrice || ''} onChange={e => updateItem(item.id, 'unitPrice', e.target.value)} className="text-sm h-8" />
                    </div>
                    <div className="col-span-1 text-right text-sm font-medium text-gray-600">
                      ${item.total.toLocaleString('es-AR')}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {budgetItems.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => removeBudgetItem(item.id)}>
                          <Trash2 className="size-3.5 text-red-400" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs" onClick={addBudgetItem}>
                <Plus className="size-3.5" />Agregar ítem
              </Button>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-semibold">Total: <span className="text-indigo-700">${budgetTotal.toLocaleString('es-AR')}</span></span>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowBudgetForm(false)}>Cancelar</Button>
                  <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-1.5">
                    <Check className="size-4" />Guardar presupuesto
                  </Button>
                </div>
              </div>
            </form>
          ) : null}
        </div>
      )}

      {/* Invoice section */}
      {(showInvoiceForm || invoiceDraft) && (
        <div className="bg-white rounded-xl border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Receipt className="size-3.5" />Factura
            </p>
            {invoiceDraft && <Badge className="bg-indigo-100 text-indigo-800 border-0">Borrador</Badge>}
          </div>

          {invoiceDraft ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[['Cliente', client?.name], ['CUIT', client?.taxId || '—'], ['Condición', client?.invoiceType || 'Consumidor Final'], ['Vehículo', `${vehicle?.brand} ${vehicle?.model}`], ['Patente', vehicle?.licensePlate], ['OT', `#${order.id}`]].map(([l, v]) => (
                  <div key={l as string} className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">{l}</p>
                    <p className="text-sm font-medium">{v}</p>
                  </div>
                ))}
              </div>
              {budget && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <span className="text-green-800 font-medium">Total a facturar: </span>
                  <span className="text-green-700 font-bold">${budget.totalAmount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.success('Factura generada (simulación)')}>
                  <FileText className="size-4" />Emitir factura
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success('Enviando por email...')}>
                  <Mail className="size-4" />Enviar por email
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {!budget && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  Para armar la factura primero necesitás tener un presupuesto aprobado.
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {[['Cliente', client?.name], ['CUIT', client?.taxId || '—'], ['Vehículo', `${vehicle?.brand} ${vehicle?.model}`], ['Patente', vehicle?.licensePlate]].map(([l, v]) => (
                  <div key={l as string} className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">{l}</p>
                    <p className="text-sm font-medium">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700" onClick={() => setInvoiceDraft(true)}>
                  <Receipt className="size-4" />Armar factura para esta OT
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowInvoiceForm(false)}>Cancelar</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehículo */}
        <div className="bg-white rounded-xl border p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"><Car className="size-3.5" />Vehículo</p>
          <div className="grid grid-cols-2 gap-2">
            {([['Patente', vehicle?.licensePlate, true], ['Marca', vehicle?.brand], ['Modelo', vehicle?.model], ['Año', vehicle?.year?.toString()], ['Color', vehicle?.color], ['VIN', vehicle?.vin]] as [string, string | undefined, boolean?][]).map(([label, value, mono]) => (
              <div key={label} className="space-y-0.5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cliente */}
        <div className="bg-white rounded-xl border p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"><User className="size-3.5" />Cliente</p>
          <div className="grid grid-cols-2 gap-2">
            {([['Nombre', client?.name], ['Teléfono', client?.phone], ['Email', client?.email], ['CUIT', client?.taxId], ['Dirección', client?.address]] as [string, string | undefined][]).map(([label, value]) => (
              <div key={label} className="space-y-0.5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value ?? '—'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trabajo / Servicio */}
        <div className="bg-white rounded-xl border p-4 space-y-3 md:col-span-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"><Wrench className="size-3.5" />Trabajo / Servicio</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="space-y-0.5"><p className="text-xs text-muted-foreground">Fecha ingreso</p><p className="text-sm">{new Date(order.createdAt).toLocaleDateString('es-AR')}</p></div>
            {order.closedAt && <div className="space-y-0.5"><p className="text-xs text-muted-foreground">Fecha cierre</p><p className="text-sm">{new Date(order.closedAt).toLocaleDateString('es-AR')}</p></div>}
            {order.totalAmount && <div className="space-y-0.5"><p className="text-xs text-muted-foreground">Total OT</p><p className="text-sm font-bold text-green-600">${order.totalAmount.toLocaleString('es-AR')}</p></div>}
          </div>
          <div className="space-y-1"><p className="text-xs text-muted-foreground">Descripción</p><p className="text-sm bg-gray-50 rounded-lg p-3 border">{order.description}</p></div>
        </div>
      </div>

      {/* Post-close notice */}
      {postCloseNotice && postCloseNotice.order.id === order.id && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-5 text-green-600" />
              <p className="font-semibold text-green-800">Orden cerrada correctamente</p>
            </div>
            <Button variant="ghost" size="icon" className="size-7" onClick={onDismissNotice}>
              <span className="text-muted-foreground text-lg leading-none">×</span>
            </Button>
          </div>
          <p className="text-sm text-green-700">Se generó un borrador de cobranza. ¿Querés notificar al cliente?</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50" onClick={() => { onDismissNotice(); toast.success('Email enviado'); }}>
              <Mail className="size-4" />Avisar por Email
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 border-green-300 text-green-700 hover:bg-green-50" onClick={() => { onDismissNotice(); toast.success('WhatsApp enviado'); }}>
              <MessageCircle className="size-4" />Avisar por WhatsApp
            </Button>
            <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700" onClick={() => { onDismissNotice(); navigate('/cobranzas'); }}>
              <Receipt className="size-4" />Ir a Cobranzas
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──
export function WorkOrders() {
  const location = useLocation();
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [pageView, setPageView] = useState<PageView>(() =>
    (location.state as any)?.openNew ? 'new-form' : 'list'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [postCloseNotice, setPostCloseNotice] = useState<{ order: WorkOrder; client: any } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const filteredOrders = workOrders.filter(order => {
    if (order.deleted) return false;
    if (!showArchived && order.archived) return false;
    if (showArchived && !order.archived) return false;
    const client = mockClients.find(c => c.id === order.clientId);
    const vehicle = mockVehicles.find(v => v.id === order.vehicleId);
    const matchesSearch =
      client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(order.status);
    const matchesDate = filterByDate(order.createdAt, dateFilter, customDateFrom, customDateTo);
    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a, b) => {
    const clientA = mockClients.find(c => c.id === a.clientId);
    const clientB = mockClients.find(c => c.id === b.clientId);
    const m = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'id': return m * (parseInt(a.id) - parseInt(b.id));
      case 'name': return m * (clientA?.name || '').localeCompare(clientB?.name || '');
      case 'status': return m * a.status.localeCompare(b.status);
      case 'date': return m * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default: return 0;
    }
  });

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field as SortField);
    setSortDirection(direction);
  };

  const handleUpdateStatus = (orderId: string, status: WorkOrder['status']) => {
    setWorkOrders(prev => prev.map(o => o.id === orderId
      ? { ...o, status, closedAt: status === 'cerrada' ? new Date().toISOString().split('T')[0] : o.closedAt }
      : o
    ));
    if (status === 'cerrada') {
      const order = workOrders.find(o => o.id === orderId);
      const client = mockClients.find(c => c.id === order?.clientId);
      if (order && client) setPostCloseNotice({ order: { ...order, status: 'cerrada' }, client });
      setPageView('list');
      toast.success('Orden de trabajo cerrada');
    } else {
      if (selectedOrder) setSelectedOrder(prev => prev ? { ...prev, status } : prev);
      toast.success('Estado actualizado');
    }
  };

  const handleArchive = (id: string, archive: boolean) => {
    setWorkOrders(prev => prev.map(o => o.id === id ? { ...o, archived: archive } : o));
    toast.success(archive ? 'Orden archivada' : 'Orden restaurada del archivo');
  };

  const handleDelete = (id: string) => {
    setWorkOrders(prev => prev.map(o => o.id === id ? { ...o, deleted: true } : o));
    toast.success('Orden eliminada');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'abierta': return <Badge className="bg-yellow-100 text-yellow-800 border-0 gap-1"><Clock className="size-3" />Abierta</Badge>;
      case 'en_progreso': return <Badge className="bg-blue-100 text-blue-800 border-0 gap-1"><FileText className="size-3" />En Progreso</Badge>;
      case 'cerrada': return <Badge className="bg-green-100 text-green-800 border-0 gap-1"><CheckCircle className="size-3" />Cerrada</Badge>;
      default: return null;
    }
  };

  const cfProps = { currentSortField: sortField, currentSortDirection: sortDirection, onSort: handleSort };
  const statusOptions = [
    { value: 'abierta', label: 'Abierta' },
    { value: 'en_progreso', label: 'En Progreso' },
    { value: 'cerrada', label: 'Cerrada' },
  ];

  // ── New OT form view ──
  if (pageView === 'new-form') {
    return (
      <NewOTForm
        onBack={() => setPageView('list')}
        onCreated={() => setPageView('list')}
      />
    );
  }

  // ── Detail view ──
  if (pageView === 'detail' && selectedOrder) {
    return (
      <OTDetailPage
        order={selectedOrder}
        onBack={() => setPageView('list')}
        onUpdateStatus={handleUpdateStatus}
        postCloseNotice={postCloseNotice}
        onDismissNotice={() => setPostCloseNotice(null)}
        navigate={navigate}
      />
    );
  }

  // ── List view ──
  return (
    <div className="space-y-6">
      {/* Stats + Nueva OT */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setPageView('new-form')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-2 col-span-1 min-h-[100px] shadow-sm"
        >
          <Plus className="size-7" />
          <span className="text-sm font-semibold text-center">Ingresar nueva OT</span>
        </button>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Total</p><p className="text-2xl font-bold">{workOrders.filter(o => !o.deleted).length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Abiertas</p><p className="text-2xl font-bold text-yellow-600">{workOrders.filter(o => o.status === 'abierta' && !o.deleted).length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">En Progreso</p><p className="text-2xl font-bold text-blue-600">{workOrders.filter(o => o.status === 'en_progreso' && !o.deleted).length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Cerradas este mes</p><p className="text-2xl font-bold text-green-600">{workOrders.filter(o => o.status === 'cerrada' && o.closedAt?.startsWith(new Date().toISOString().slice(0, 7)) && !o.deleted).length}</p></CardContent></Card>
      </div>

      {/* Orders card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <CardTitle className="text-base">Órdenes de Trabajo</CardTitle>
            <div className="inline-flex rounded-lg border bg-background p-1">
              <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="gap-1.5 text-xs"><LayoutList className="size-3.5" />Lista</Button>
              <Button variant={viewMode === 'kanban' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('kanban')} className="gap-1.5 text-xs"><Columns3 className="size-3.5" />Kanban</Button>
            </div>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Buscar por cliente, patente, OT..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant={showArchived ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
              className={showArchived ? 'bg-amber-600 hover:bg-amber-700 text-white text-xs' : 'text-amber-700 border-amber-300 hover:bg-amber-50 text-xs'}
            >
              <Archive className="size-3.5 mr-1.5" />
              {showArchived ? 'Viendo archivadas' : 'Ver archivadas'}
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
                    <TableHead><ColumnFilter {...cfProps} label="Cliente" sortField="name" /></TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Trabajo</TableHead>
                    <TableHead><ColumnFilter {...cfProps} label="Estado" sortField="status" statusOptions={statusOptions} selectedStatuses={selectedStatuses} onStatusChange={setSelectedStatuses} /></TableHead>
                    <TableHead><ColumnFilter {...cfProps} label="Fecha" sortField="date" showDateFilter dateFilter={dateFilter} onDateFilterChange={setDateFilter} customDateFrom={customDateFrom} customDateTo={customDateTo} onCustomDateFromChange={setCustomDateFrom} onCustomDateToChange={setCustomDateTo} /></TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No se encontraron órdenes de trabajo</TableCell></TableRow>
                  ) : (
                    filteredOrders.map(order => {
                      const client = mockClients.find(c => c.id === order.clientId);
                      const vehicle = mockVehicles.find(v => v.id === order.vehicleId);
                      return (
                        <TableRow
                          key={order.id}
                          className={`cursor-pointer hover:bg-indigo-50/40 transition-colors ${order.archived ? 'opacity-60 bg-amber-50/40' : ''}`}
                          onClick={() => { setSelectedOrder(order); setPageView('detail'); }}
                        >
                          <TableCell className="font-medium text-muted-foreground text-xs">#{order.id}</TableCell>
                          <TableCell>
                            <p className="font-medium text-sm">{client?.name}</p>
                            {order.archived && <Badge variant="outline" className="text-xs mt-1 text-amber-600 border-amber-300">Archivado</Badge>}
                          </TableCell>
                          <TableCell>
                            <p className="font-mono text-xs font-semibold">{vehicle?.licensePlate}</p>
                            <p className="text-xs text-muted-foreground">{vehicle?.brand} {vehicle?.model}</p>
                          </TableCell>
                          <TableCell className="max-w-xs"><p className="truncate text-sm">{order.description}</p></TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('es-AR')}</TableCell>
                          <TableCell onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              {!order.deleted && (
                                order.archived ? (
                                  <Button variant="ghost" size="icon" className="size-7" onClick={() => handleArchive(order.id, false)}><ArchiveRestore className="size-3.5 text-amber-600" /></Button>
                                ) : (
                                  <Button variant="ghost" size="icon" className="size-7" onClick={() => handleArchive(order.id, true)}><Archive className="size-3.5 text-muted-foreground" /></Button>
                                )
                              )}
                              <Button variant="ghost" size="icon" className="size-7" onClick={() => handleDelete(order.id)}><Trash2 className="size-3.5 text-red-400" /></Button>
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
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[
                { key: 'abierta', label: 'Abiertas', bg: 'bg-yellow-50', border: 'border-yellow-200', cardBorder: 'border-l-yellow-400' },
                { key: 'en_progreso', label: 'En Progreso', bg: 'bg-blue-50', border: 'border-blue-200', cardBorder: 'border-l-blue-400' },
                { key: 'cerrada', label: 'Cerradas', bg: 'bg-green-50', border: 'border-green-200', cardBorder: 'border-l-green-400' },
              ].map(col => {
                const colOrders = filteredOrders.filter(o => o.status === col.key);
                return (
                  <div key={col.key} className="flex-shrink-0 w-72 space-y-3">
                    <div className={`flex items-center justify-between px-3 py-2 ${col.bg} rounded-lg border ${col.border}`}>
                      <span className="font-semibold text-sm">{col.label}</span>
                      <Badge variant="secondary">{colOrders.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {colOrders.map(order => {
                        const client = mockClients.find(c => c.id === order.clientId);
                        const vehicle = mockVehicles.find(v => v.id === order.vehicleId);
                        return (
                          <Card key={order.id} className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${col.cardBorder}`} onClick={() => { setSelectedOrder(order); setPageView('detail'); }}>
                            <CardContent className="p-3 space-y-2">
                              <div className="flex items-start justify-between gap-1">
                                <span className="text-xs text-muted-foreground">#{order.id}</span>
                                <span className="font-mono text-xs font-bold">{vehicle?.licensePlate}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{client?.name}</p>
                                <p className="text-xs text-muted-foreground">{vehicle?.brand} {vehicle?.model}</p>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{order.description}</p>
                              <div className="flex justify-between text-xs pt-1 border-t text-muted-foreground">
                                <span>{new Date(order.createdAt).toLocaleDateString('es-AR')}</span>
                                {order.totalAmount && <span className="text-green-600 font-semibold">${order.totalAmount.toLocaleString('es-AR')}</span>}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                      {col.key !== 'cerrada' && (
                        <Button variant="outline" className="w-full border-dashed text-xs gap-1.5" onClick={() => setPageView('new-form')}>
                          <Plus className="size-3.5" />Nueva OT
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
