import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import {
  Wrench, Camera, ArrowLeft, ArrowRight, CheckCircle,
  Building2, MapPin, Phone, Mail, Lock, User, FileText, Eye, EyeOff, X
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

const steps = [
  { id: 1, label: 'Datos del Taller', icon: Building2 },
  { id: 2, label: 'Administrador', icon: User },
  { id: 3, label: 'Confirmación', icon: CheckCircle },
];

export function Register() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1 - Taller
  const [tallerNombre, setTallerNombre] = useState('');
  const [tallerTipo, setTallerTipo] = useState('');
  const [tallerCuit, setTallerCuit] = useState('');
  const [tallerTelefono, setTallerTelefono] = useState('');
  const [tallerDireccion, setTallerDireccion] = useState('');
  const [tallerLocalidad, setTallerLocalidad] = useState('');
  const [tallerProvincia, setTallerProvincia] = useState('');
  const [tallerSitioWeb, setTallerSitioWeb] = useState('');

  // Step 2 - Admin
  const [adminNombre, setAdminNombre] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminCargo, setAdminCargo] = useState('');
  const [adminTelefono, setAdminTelefono] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tallerNombre || !tallerTipo || !tallerTelefono || !tallerDireccion || !tallerLocalidad || !tallerProvincia) {
      toast.error('Completá todos los campos obligatorios');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNombre || !adminEmail || !adminPassword || !adminConfirmPassword) {
      toast.error('Completá todos los campos obligatorios');
      return;
    }
    if (adminPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (adminPassword !== adminConfirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = () => {
    // Simulate sending confirmation email
    setEmailSent(true);
    toast.success('Email de confirmación enviado');
  };

  const handleResendEmail = () => {
    toast.success('Email reenviado a ' + adminEmail);
  };

  const passwordStrength = (pwd: string) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return { level: 0, label: 'Muy débil', color: 'bg-red-500' };
    if (pwd.length < 8) return { level: 1, label: 'Débil', color: 'bg-orange-500' };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const extras = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (extras === 0) return { level: 2, label: 'Moderada', color: 'bg-yellow-500' };
    if (extras === 1) return { level: 3, label: 'Buena', color: 'bg-blue-500' };
    return { level: 4, label: 'Muy fuerte', color: 'bg-green-500' };
  };

  const strength = passwordStrength(adminPassword);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Panel izquierdo — branding */}
      <div className="hidden lg:flex lg:w-2/5 relative flex-col justify-between p-10 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1707085301609-10a63d3f0a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwd29ya3Nob3AlMjBnYXJhZ2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzY2MDQ4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080')` }}
        />
        <div className="absolute inset-0 bg-blue-900/75" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
              <Wrench className="size-7 text-white" />
            </div>
            <span className="text-xl font-semibold">Gestión.net</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight mb-4">
            Digitalizá tu taller mecánico
          </h1>
          <p className="text-blue-100 leading-relaxed">
            Gestioná clientes, vehículos, órdenes de trabajo, presupuestos y facturación AFIP desde un solo lugar.
          </p>
        </div>
        <div className="relative z-10 space-y-3">
          {[
            { icon: '✅', text: 'Gestión de clientes y vehículos' },
            { icon: '✅', text: 'Órdenes de trabajo y presupuestos' },
            { icon: '✅', text: 'Facturación integrada con AFIP/Arca' },
            { icon: '✅', text: 'Control de stock y reportes' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-blue-100">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        {/* Header mobile */}
        <div className="lg:hidden flex items-center gap-3 p-4 bg-indigo-600 text-white">
          <div className="bg-white/20 p-2 rounded-lg">
            <Wrench className="size-5 text-white" />
          </div>
          <span className="font-semibold">TallerGestión</span>
        </div>

        <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 max-w-2xl mx-auto w-full">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
                <div
                  className="h-full bg-indigo-600 transition-all duration-500"
                  style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                />
              </div>
              {steps.map((s) => {
                const Icon = s.icon;
                const done = step > s.id;
                const active = step === s.id;
                return (
                  <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5">
                    <div className={`size-8 rounded-full flex items-center justify-center transition-colors duration-300 ${done ? 'bg-indigo-600 text-white' : active ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-white text-gray-400 border-2 border-gray-200'}`}>
                      {done ? <CheckCircle className="size-4" /> : <Icon className="size-4" />}
                    </div>
                    <span className={`text-xs hidden sm:block ${active || done ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1 — Datos del Taller */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Datos del Taller</h2>
                <p className="text-sm text-muted-foreground mt-1">Información principal de tu establecimiento</p>
              </div>

              {/* Foto del taller */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="size-28 rounded-2xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors relative group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Foto taller" className="size-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="size-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <Camera className="size-7" />
                      <span className="text-xs text-center px-2">Foto del taller</span>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="size-3.5 mr-1.5" />
                    {photoPreview ? 'Cambiar foto' : 'Subir foto'}
                  </Button>
                  {photoPreview && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                      <X className="size-3.5 mr-1.5" />Quitar
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="tallerNombre">Nombre del taller *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="tallerNombre" className="pl-9" placeholder="Ej: Taller Mecánico El Rayo" value={tallerNombre} onChange={e => setTallerNombre(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tallerTipo">Tipo de taller *</Label>
                  <Select required value={tallerTipo} onValueChange={setTallerTipo}>
                    <SelectTrigger id="tallerTipo"><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                    <SelectContent>
                      {TIPOS_TALLER.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tallerCuit">CUIT del taller</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="tallerCuit" className="pl-9" placeholder="20-12345678-9" value={tallerCuit} onChange={e => setTallerCuit(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tallerTelefono">Teléfono *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="tallerTelefono" className="pl-9" type="tel" placeholder="Ej: 011 4567-8901" value={tallerTelefono} onChange={e => setTallerTelefono(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tallerWeb">Sitio web / Redes</Label>
                  <Input id="tallerWeb" placeholder="www.mitaller.com.ar" value={tallerSitioWeb} onChange={e => setTallerSitioWeb(e.target.value)} />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="tallerDireccion">Dirección *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="tallerDireccion" className="pl-9" placeholder="Av. San Martín 1234" value={tallerDireccion} onChange={e => setTallerDireccion(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tallerLocalidad">Localidad *</Label>
                  <Input id="tallerLocalidad" placeholder="Ej: Rosario" value={tallerLocalidad} onChange={e => setTallerLocalidad(e.target.value)} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tallerProvincia">Provincia *</Label>
                  <Select required value={tallerProvincia} onValueChange={setTallerProvincia}>
                    <SelectTrigger id="tallerProvincia"><SelectValue placeholder="Seleccionar provincia" /></SelectTrigger>
                    <SelectContent>
                      {PROVINCIAS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-indigo-600 flex items-center gap-1">
                  <ArrowLeft className="size-3.5" />Ya tengo cuenta
                </Link>
                <Button type="submit" className="bg-indigo-600 hover:bg-blue-700 gap-2">
                  Continuar <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 2 — Datos del Administrador */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Datos del Administrador</h2>
                <p className="text-sm text-muted-foreground mt-1">Esta cuenta tendrá acceso total al sistema</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="adminNombre">Nombre completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="adminNombre" className="pl-9" placeholder="Ej: Carlos Rodríguez" value={adminNombre} onChange={e => setAdminNombre(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="adminEmail">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="adminEmail" className="pl-9" type="email" placeholder="admin@mitaller.com" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="adminTelefono">Teléfono personal</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="adminTelefono" className="pl-9" type="tel" placeholder="Ej: 11 2345-6789" value={adminTelefono} onChange={e => setAdminTelefono(e.target.value)} />
                  </div>
                </div>

                

                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="adminPassword">Contraseña *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="adminPassword"
                      className="pl-9 pr-10"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      required
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {strength && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.level - 1 ? strength.color : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Seguridad: <span className="font-medium">{strength.label}</span></p>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="adminConfirmPassword">Confirmar contraseña *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="adminConfirmPassword"
                      className="pl-9 pr-10"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repetí la contraseña"
                      value={adminConfirmPassword}
                      onChange={e => setAdminConfirmPassword(e.target.value)}
                      required
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {adminConfirmPassword && adminPassword !== adminConfirmPassword && (
                    <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
                  )}
                  {adminConfirmPassword && adminPassword === adminConfirmPassword && (
                    <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="size-3" />Las contraseñas coinciden</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="size-4" /> Volver
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-blue-700 gap-2">
                  Revisar datos <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 3 — Confirmación */}
          {step === 3 && !emailSent && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Revisá tus datos</h2>
                <p className="text-sm text-muted-foreground mt-1">Verificá que todo esté correcto antes de registrarte</p>
              </div>

              {/* Resumen taller */}
              <div className="bg-white rounded-2xl border p-5 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Taller" className="size-14 rounded-xl object-cover" />
                  ) : (
                    <div className="size-14 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Building2 className="size-6 text-indigo-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{tallerNombre}</p>
                    <p className="text-sm text-muted-foreground">{tallerTipo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-indigo-600 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{tallerDireccion}, {tallerLocalidad}, {tallerProvincia}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-indigo-600 shrink-0" />
                    <span className="text-gray-600">{tallerTelefono}</span>
                  </div>
                  {tallerCuit && (
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-indigo-600 shrink-0" />
                      <span className="text-gray-600">CUIT: {tallerCuit}</span>
                    </div>
                  )}
                  {tallerSitioWeb && (
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-600 shrink-0">🌐</span>
                      <span className="text-gray-600">{tallerSitioWeb}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Resumen admin */}
              <div className="bg-white rounded-2xl border p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 pb-2 border-b">
                  <User className="size-4 text-indigo-600" />Administrador del sistema
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-indigo-600 shrink-0" />
                    <span className="text-gray-600">{adminNombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-indigo-600 shrink-0" />
                    <span className="text-gray-600">{adminEmail}</span>
                  </div>
                  {adminTelefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-indigo-600 shrink-0" />
                      <span className="text-gray-600">{adminTelefono}</span>
                    </div>
                  )}
                  {adminCargo && (
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-600 shrink-0">💼</span>
                      <span className="text-gray-600 capitalize">{adminCargo}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Lock className="size-4 text-indigo-600 shrink-0" />
                    <span className="text-gray-600">Contraseña configurada</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Al registrarte, aceptás los términos de uso y la política de privacidad de TallerGestión.
              </p>

              <div className="flex justify-between items-center pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="size-4" /> Volver
                </Button>
                <Button
                  type="button"
                  className="bg-indigo-600 hover:bg-blue-700 gap-2"
                  onClick={handleSubmit}
                >
                  <CheckCircle className="size-4" /> Registrar taller
                </Button>
              </div>
            </div>
          )}

          {/* Email confirmation screen */}
          {step === 3 && emailSent && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="size-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="size-10 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Confirmá tu email</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Te enviamos un email a <span className="font-medium text-gray-900">{adminEmail}</span>
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Revisá tu bandeja de entrada</strong> y hacé clic en el enlace de confirmación para activar tu cuenta.
                </p>
                <p className="text-xs text-muted-foreground">
                  Si no ves el email, revisá tu carpeta de spam o correo no deseado.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 pt-2">
                <p className="text-sm text-muted-foreground">
                  ¿No recibiste el email?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendEmail}
                  className="gap-2"
                >
                  <Mail className="size-4" />
                  Reenviar email de confirmación
                </Button>
                <Link
                  to="/login"
                  className="text-sm text-indigo-600 hover:underline font-medium mt-2"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}