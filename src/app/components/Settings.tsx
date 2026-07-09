import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import {
  Building2, Camera, MapPin, Phone, FileText, Save, X, Globe
} from 'lucide-react';

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán'
];

const TIPOS_TALLER = [
  'Mecánica General',
  'Electricidad Automotriz',
  'Chapa y Pintura',
  'Servicio Rápido / Lubricentro',
  'Taller Integral',
  'Gomería',
  'Climatización Automotriz',
  'Otro',
];

// Datos de ejemplo pre-cargados (en producción vendrían de la DB)
const datosIniciales = {
  nombre: 'Taller Tomalino',
  tipo: 'Mecánica General',
  cuit: '20-12345678-9',
  telefono: '011 4567-8901',
  direccion: 'Av. San Martín 1234',
  localidad: 'Buenos Aires',
  provincia: 'CABA',
  sitioWeb: '',
  foto: null as string | null,
};

export function Settings() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nombre, setNombre] = useState(datosIniciales.nombre);
  const [tipo, setTipo] = useState(datosIniciales.tipo);
  const [cuit, setCuit] = useState(datosIniciales.cuit);
  const [telefono, setTelefono] = useState(datosIniciales.telefono);
  const [direccion, setDireccion] = useState(datosIniciales.direccion);
  const [localidad, setLocalidad] = useState(datosIniciales.localidad);
  const [provincia, setProvincia] = useState(datosIniciales.provincia);
  const [sitioWeb, setSitioWeb] = useState(datosIniciales.sitioWeb);
  const [foto, setFoto] = useState<string | null>(datosIniciales.foto);
  const [hasChanges, setHasChanges] = useState(false);

  const markChanged = () => setHasChanges(true);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFoto(ev.target?.result as string);
      markChanged();
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !tipo || !telefono || !direccion || !localidad || !provincia) {
      toast.error('Completá todos los campos obligatorios');
      return;
    }
    toast.success('Datos del taller actualizados correctamente');
    setHasChanges(false);
  };

  const handleReset = () => {
    setNombre(datosIniciales.nombre);
    setTipo(datosIniciales.tipo);
    setCuit(datosIniciales.cuit);
    setTelefono(datosIniciales.telefono);
    setDireccion(datosIniciales.direccion);
    setLocalidad(datosIniciales.localidad);
    setProvincia(datosIniciales.provincia);
    setSitioWeb(datosIniciales.sitioWeb);
    setFoto(datosIniciales.foto);
    setHasChanges(false);
    toast.info('Cambios descartados');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Título de sección */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Datos del Taller</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Editá la información principal de tu establecimiento
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto del taller */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <p className="text-sm font-medium text-gray-700">Foto del taller</p>
          <div className="flex items-center gap-5">
            <div
              className="size-24 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors relative group shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              {foto ? (
                <>
                  <img src={foto} alt="Foto taller" className="size-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                    <Camera className="size-5 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <Camera className="size-6" />
                  <span className="text-xs text-center px-1">Sin foto</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFotoChange}
            />
            <div className="space-y-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Camera className="size-3.5 mr-1.5" />
                {foto ? 'Cambiar foto' : 'Subir foto'}
              </Button>
              {foto && (
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => { setFoto(null); if (fileInputRef.current) fileInputRef.current.value = ''; markChanged(); }}
                  >
                    <X className="size-3.5 mr-1.5" /> Quitar foto
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">JPG, PNG o WEBP. Máx 5 MB.</p>
            </div>
          </div>
        </div>

        {/* Datos principales */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <p className="text-sm font-medium text-gray-700">Información del taller</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="nombre">Nombre del taller *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="nombre"
                  className="pl-9"
                  placeholder="Ej: Taller Mecánico El Rayo"
                  value={nombre}
                  onChange={e => { setNombre(e.target.value); markChanged(); }}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tipo">Tipo de taller *</Label>
              <Select
                required
                value={tipo}
                onValueChange={v => { setTipo(v); markChanged(); }}
              >
                <SelectTrigger id="tipo"><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                <SelectContent>
                  {TIPOS_TALLER.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cuit">CUIT del taller</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="cuit"
                  className="pl-9"
                  placeholder="20-12345678-9"
                  value={cuit}
                  onChange={e => { setCuit(e.target.value); markChanged(); }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="telefono"
                  className="pl-9"
                  type="tel"
                  placeholder="Ej: 011 4567-8901"
                  value={telefono}
                  onChange={e => { setTelefono(e.target.value); markChanged(); }}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sitioWeb">Sitio web / Redes</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="sitioWeb"
                  className="pl-9"
                  placeholder="www.mitaller.com.ar"
                  value={sitioWeb}
                  onChange={e => { setSitioWeb(e.target.value); markChanged(); }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <p className="text-sm font-medium text-gray-700">Ubicación</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="direccion">Dirección *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="direccion"
                  className="pl-9"
                  placeholder="Av. San Martín 1234"
                  value={direccion}
                  onChange={e => { setDireccion(e.target.value); markChanged(); }}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="localidad">Localidad *</Label>
              <Input
                id="localidad"
                placeholder="Ej: Rosario"
                value={localidad}
                onChange={e => { setLocalidad(e.target.value); markChanged(); }}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="provincia">Provincia *</Label>
              <Select
                required
                value={provincia}
                onValueChange={v => { setProvincia(v); markChanged(); }}
              >
                <SelectTrigger id="provincia"><SelectValue placeholder="Seleccionar provincia" /></SelectTrigger>
                <SelectContent>
                  {PROVINCIAS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-between items-center pb-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <X className="size-4 mr-2" /> Descartar cambios
          </Button>
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 aspect-square sm:aspect-auto gap-2"
            disabled={!hasChanges}
          >
            <Save className="size-4" />
            <span className="hidden sm:inline">Guardar cambios</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
