import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockClients, mockVehicles, mockWorkOrders, Client, Vehicle } from '../lib/mockData';
import {
  Plus, Search, Phone, Mail, MapPin, Trash2, Edit,
  Check, Copy, Download, ArrowLeft, Car, User, Wrench,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

type PageView = 'list' | 'new-form' | 'edit-form' | 'detail';

interface ClientFormData {
  name: string; taxId: string; phone: string; email: string;
  address: string; invoiceType: string;
  brand: string; model: string; year: string;
  plate: string; color: string; vin: string;
  idPhoto: File | null;
}

const emptyForm: ClientFormData = {
  name: '', taxId: '', phone: '', email: '', address: '', invoiceType: '',
  brand: '', model: '', year: '', plate: '', color: '', vin: '', idPhoto: null,
};

// ── New / Edit client form ──
function ClientForm({
  mode,
  initialData,
  onBack,
  onSubmit,
}: {
  mode: 'new' | 'edit';
  initialData: ClientFormData;
  onBack: () => void;
  onSubmit: (data: ClientFormData) => void;
}) {
  const [form, setForm] = useState<ClientFormData>(initialData);

  const set = (field: keyof ClientFormData, value: string | File | null) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 text-muted-foreground hover:text-gray-800">
          <ArrowLeft className="size-4" />
          Volver al listado
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">
          {mode === 'new' ? 'Nuevo cliente y vehículo' : 'Editar cliente'}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {mode === 'new'
            ? 'Completá los datos del cliente y su vehículo para registrarlos en el sistema.'
            : 'Modificá los datos del cliente. Los cambios se guardan al confirmar.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Datos del cliente ── */}
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Datos del cliente</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Razón social / Nombre completo <span className="text-red-500">*</span></Label>
              <Input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Nombre completo o empresa"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">DNI / CUIT</Label>
              <Input
                value={form.taxId}
                onChange={e => set('taxId', e.target.value)}
                placeholder="20-12345678-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Condición fiscal</Label>
              <Select value={form.invoiceType} onValueChange={v => set('invoiceType', v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A — Responsable Inscripto</SelectItem>
                  <SelectItem value="B">B — Consumidor Final</SelectItem>
                  <SelectItem value="C">C — Exento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Teléfono <span className="text-red-500">*</span></Label>
              <Input
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+54 9 11 1234-5678"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Dirección</Label>
              <Input
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="Calle 123"
              />
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
              <Input placeholder="Buenos Aires" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Código postal</Label>
              <Input placeholder="1425" />
            </div>
          </div>
        </div>

        {/* ── Datos del vehículo (only for new) ── */}
        {mode === 'new' && (
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Datos del vehículo</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Patente <span className="text-red-500">*</span></Label>
                <p className="text-xs text-muted-foreground -mt-1">Ingresar sin espacios</p>
                <Input
                  value={form.plate}
                  onChange={e => set('plate', e.target.value.toUpperCase())}
                  placeholder="Ej: AA123BB"
                  className="font-mono uppercase tracking-widest"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Marca <span className="text-red-500">*</span></Label>
                <Input
                  value={form.brand}
                  onChange={e => set('brand', e.target.value)}
                  placeholder="Ej: Toyota"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Modelo <span className="text-red-500">*</span></Label>
                <Input
                  value={form.model}
                  onChange={e => set('model', e.target.value)}
                  placeholder="Ej: Corolla"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Año</Label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={e => set('year', e.target.value)}
                  placeholder="2020"
                  min="1900"
                  max="2030"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Color</Label>
                <Input
                  value={form.color}
                  onChange={e => set('color', e.target.value)}
                  placeholder="Ej: Blanco"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Chasis / VIN</Label>
                <Input
                  value={form.vin}
                  onChange={e => set('vin', e.target.value)}
                  placeholder="Número de chasis"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">Foto de cédula verde</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => set('idPhoto', e.target.files?.[0] ?? null)}
                />
                {form.idPhoto && (
                  <p className="text-xs text-muted-foreground">Archivo: {form.idPhoto.name}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Action bar ── */}
        <div className="flex items-center justify-between bg-white rounded-xl border p-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Check className="size-4" />
            {mode === 'new' ? 'Guardar cliente y vehículo' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ── Client detail panel ──
function ClientDetailView({
  client,
  vehicle,
  onBack,
  onEdit,
  onCreateOT,
}: {
  client: Client;
  vehicle: Vehicle | undefined;
  onBack: () => void;
  onEdit: () => void;
  onCreateOT: () => void;
}) {
  const handleCopyCedula = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada al portapapeles');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 text-muted-foreground hover:text-gray-800">
          <ArrowLeft className="size-4" />
          Volver al listado
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{client.name}</h2>
          <p className="text-sm text-muted-foreground">{vehicle?.brand} {vehicle?.model} · <span className="font-mono font-semibold">{vehicle?.licensePlate}</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
            <Edit className="size-4" />Editar
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-1.5" onClick={onCreateOT}>
            <Plus className="size-4" />Crear nueva OT para este cliente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Client data */}
        <div className="bg-white rounded-xl border p-5 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <User className="size-3.5" />Datos del cliente
          </p>
          {[
            { label: 'Teléfono', value: client.phone, icon: <Phone className="size-3.5" /> },
            { label: 'Email', value: client.email || '—', icon: <Mail className="size-3.5" /> },
            { label: 'Dirección', value: client.address || '—', icon: <MapPin className="size-3.5" /> },
            { label: 'DNI / CUIT', value: client.taxId || '—' },
            { label: 'Tipo de factura', value: client.invoiceType || '—' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="space-y-0.5">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-medium flex items-center gap-1.5">
                {icon && <span className="text-muted-foreground">{icon}</span>}
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Vehicle data */}
        {vehicle && (
          <div className="bg-white rounded-xl border p-5 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Car className="size-3.5" />Datos del vehículo
            </p>
            {[
              { label: 'Patente', value: vehicle.licensePlate, mono: true },
              { label: 'Marca y modelo', value: `${vehicle.brand} ${vehicle.model}` },
              { label: 'Año', value: vehicle.year?.toString() },
              { label: 'Color', value: vehicle.color },
              { label: 'VIN', value: vehicle.vin || '—' },
            ].map(({ label, value, mono }) => (
              <div key={label} className="space-y-0.5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value}</p>
              </div>
            ))}
            {vehicle.idPhotoUrl && (
              <div className="space-y-1.5 pt-2 border-t">
                <p className="text-xs text-muted-foreground">Foto de cédula</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => handleCopyCedula(vehicle.idPhotoUrl!)}>
                    <Copy className="size-3.5" />Copiar URL
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.info('Descarga disponible en la versión completa')}>
                    <Download className="size-3.5" />Descargar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OT history for this client */}
      <div className="bg-white rounded-xl border p-5 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <FileText className="size-3.5" />Órdenes de trabajo
        </p>
        {(() => {
          const orders = mockWorkOrders.filter(wo => wo.clientId === client.id).slice(0, 5);
          if (orders.length === 0) return <p className="text-sm text-muted-foreground">Este cliente no tiene órdenes de trabajo todavía.</p>;
          return (
            <div className="space-y-2">
              {orders.map(wo => (
                <button
                  key={wo.id}
                  type="button"
                  onClick={() => navigate('/ordenes', { state: { orderId: wo.id } })}
                  className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-indigo-50/50 hover:border-indigo-200 border border-transparent rounded-lg text-sm cursor-pointer transition-colors"
                >
                  <span className="text-muted-foreground text-xs">#{wo.id}</span>
                  <span className="flex-1 px-3 text-xs truncate text-left">{wo.description}</span>
                  <span className="text-xs text-muted-foreground">{new Date(wo.createdAt).toLocaleDateString('es-AR')}</span>
                  <Badge className={`ml-3 border-0 text-xs ${wo.status === 'cerrada' ? 'bg-green-100 text-green-800' : wo.status === 'en_progreso' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {wo.status === 'cerrada' ? 'Cerrada' : wo.status === 'en_progreso' ? 'En progreso' : 'Abierta'}
                  </Badge>
                </button>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ── Main Component ──
export function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [pageView, setPageView] = useState<PageView>('list');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmado' | 'autogestionado' | 'importado'>('all');

  const today = new Date().toISOString().split('T')[0];

  const vehicleRows = vehicles
    .filter(v => !clients.find(c => c.id === v.clientId)?.deleted)
    .map(vehicle => {
      const client = clients.find(c => c.id === vehicle.clientId);
      return { vehicle, client };
    })
    .filter(row => {
      if (!row.client) return false;
      if (statusFilter !== 'all' && row.client.source !== statusFilter) return false;
      const search = searchTerm.toLowerCase();
      return (
        row.client.name.toLowerCase().includes(search) ||
        row.vehicle.brand.toLowerCase().includes(search) ||
        row.vehicle.model.toLowerCase().includes(search) ||
        row.vehicle.licensePlate.toLowerCase().includes(search) ||
        row.vehicle.color.toLowerCase().includes(search)
      );
    });

  const registeredToday = clients.filter(c => c.createdAt === today && !c.deleted).length;
  const autogestionados = clients.filter(c => c.source === 'autogestionado' && !c.deleted).length;
  const importados = clients.filter(c => c.source === 'importado' && !c.deleted).length;

  const handleNewClient = (data: ClientFormData) => {
    const newClient: Client = {
      id: String(clients.length + 1),
      name: data.name, phone: data.phone, email: data.email,
      address: data.address, taxId: data.taxId,
      createdAt: today, source: 'confirmado',
      invoiceType: data.invoiceType || undefined,
    };
    const newVehicle: Vehicle = {
      id: String(vehicles.length + 1),
      clientId: newClient.id,
      brand: data.brand, model: data.model,
      year: Number(data.year),
      licensePlate: data.plate, color: data.color, vin: data.vin,
      idPhotoUrl: data.idPhoto ? '/mock/cedula-new.jpg' : undefined,
    };
    setClients([...clients, newClient]);
    setVehicles([...vehicles, newVehicle]);
    toast.success('Cliente y vehículo registrados correctamente');
    setPageView('list');
  };

  const handleEditClient = (data: ClientFormData) => {
    if (!selectedClient) return;
    setClients(prev => prev.map(c =>
      c.id === selectedClient.id
        ? { ...c, name: data.name, phone: data.phone, email: data.email, address: data.address, taxId: data.taxId, invoiceType: data.invoiceType || undefined }
        : c
    ));
    toast.success('Cliente actualizado correctamente');
    setPageView('list');
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    toast.success('Vehículo eliminado');
  };

  const handleConfirmClient = (clientId: string) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, source: 'confirmado' as const } : c));
    toast.success('Cliente confirmado');
  };

  const getSourceBadge = (source: Client['source']) => {
    switch (source) {
      case 'confirmado': return <Badge className="bg-green-100 text-green-800 border-0">Confirmado</Badge>;
      case 'autogestionado': return <Badge className="bg-yellow-100 text-yellow-800 border-0">Autogestionado</Badge>;
      case 'importado': return <Badge className="bg-blue-100 text-blue-800 border-0">Importado</Badge>;
    }
  };

  // ── New form view ──
  if (pageView === 'new-form') {
    return (
      <ClientForm
        mode="new"
        initialData={emptyForm}
        onBack={() => setPageView('list')}
        onSubmit={handleNewClient}
      />
    );
  }

  // ── Edit form view ──
  if (pageView === 'edit-form' && selectedClient) {
    return (
      <ClientForm
        mode="edit"
        initialData={{
          name: selectedClient.name,
          taxId: selectedClient.taxId,
          phone: selectedClient.phone,
          email: selectedClient.email,
          address: selectedClient.address,
          invoiceType: selectedClient.invoiceType || '',
          brand: '', model: '', year: '', plate: '', color: '', vin: '', idPhoto: null,
        }}
        onBack={() => setPageView('list')}
        onSubmit={handleEditClient}
      />
    );
  }

  // ── Detail view ──
  if (pageView === 'detail' && selectedClient) {
    return (
      <ClientDetailView
        client={selectedClient}
        vehicle={selectedVehicle ?? undefined}
        onBack={() => setPageView('list')}
        onEdit={() => setPageView('edit-form')}
        onCreateOT={() => navigate('/ordenes', { state: { openNew: true, clientId: selectedClient.id } })}
      />
    );
  }

  // ── List view ──
  return (
    <div className="space-y-6">
      {/* Stats + Nuevo Cliente */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setPageView('new-form')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-2 min-h-[100px] shadow-sm"
        >
          <Plus className="size-7" />
          <span className="text-sm font-semibold text-center">Nuevo cliente</span>
        </button>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Registrados hoy</p><p className="text-2xl font-bold">{registeredToday}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Autogestionados</p><p className="text-2xl font-bold text-yellow-600">{autogestionados}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Importados</p><p className="text-2xl font-bold text-blue-600">{importados}</p></CardContent></Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de clientes y vehículos</CardTitle>
          <div className="space-y-3 mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, patente, marca, modelo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Filtrar:</span>
              {(['all', 'confirmado', 'autogestionado', 'importado'] as const).map(f => (
                <Button
                  key={f}
                  variant={statusFilter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(f)}
                  className={`text-xs ${
                    statusFilter === f
                      ? f === 'confirmado' ? 'bg-green-600 hover:bg-green-700'
                        : f === 'autogestionado' ? 'bg-yellow-600 hover:bg-yellow-700'
                        : f === 'importado' ? 'bg-indigo-600 hover:bg-indigo-700'
                        : ''
                      : f === 'confirmado' ? 'border-green-300 text-green-700 hover:bg-green-50'
                        : f === 'autogestionado' ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                        : f === 'importado' ? 'border-blue-300 text-blue-700 hover:bg-blue-50'
                        : ''
                  }`}
                >
                  {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Patente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicleRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No se encontraron vehículos
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicleRows.map(({ vehicle, client }) => (
                    <TableRow
                      key={vehicle.id}
                      className="cursor-pointer hover:bg-indigo-50/40 transition-colors"
                      onClick={() => {
                        setSelectedClient(client!);
                        setSelectedVehicle(vehicle);
                        setPageView('detail');
                      }}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{client!.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone className="size-3" />{client!.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{vehicle.brand}</TableCell>
                      <TableCell className="text-sm">{vehicle.model}</TableCell>
                      <TableCell className="text-sm">{vehicle.color}</TableCell>
                      <TableCell>
                        <span className="font-mono text-sm font-semibold">{vehicle.licensePlate}</span>
                      </TableCell>
                      <TableCell>{getSourceBadge(client!.source)}</TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {client!.source === 'autogestionado' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 px-2 gap-1 text-green-600 border-green-300 hover:bg-green-50"
                              onClick={() => handleConfirmClient(client!.id)}
                            >
                              <Check className="size-3" />Confirmar
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => {
                              setSelectedClient(client!);
                              setSelectedVehicle(vehicle);
                              setPageView('edit-form');
                            }}
                          >
                            <Edit className="size-3.5 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            title="Crear nueva OT"
                            onClick={() => navigate('/ordenes', { state: { openNew: true, clientId: client!.id } })}
                          >
                            <Wrench className="size-3.5 text-indigo-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                          >
                            <Trash2 className="size-3.5 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
