import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { AuthService } from '../lib/auth';
import { mockUsers, User } from '../lib/mockData';
import {
  UserPlus, Pencil, Trash2, Eye, EyeOff, X, Save,
  ShieldCheck, UserRound, KeyRound, Mail
} from 'lucide-react';

type UserWithPassword = User & { password?: string };

const ROLE_LABELS: Record<string, string> = {
  administrador: 'Administrador',
  colaborador: 'Colaborador',
};

const ROLE_COLORS: Record<string, string> = {
  administrador: 'bg-blue-100 text-blue-700 border-blue-200',
  colaborador: 'bg-gray-100 text-gray-700 border-gray-200',
};

export function UserManagement() {
  const currentUser = AuthService.getCurrentUser();

  const [users, setUsers] = useState<UserWithPassword[]>(
    mockUsers.map(u => ({ ...u, password: 'demo' }))
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'administrador' | 'colaborador'>('colaborador');
  const [formPassword, setFormPassword] = useState('');

  const openNew = () => {
    setEditingId(null);
    setFormName('');
    setFormEmail('');
    setFormRole('colaborador');
    setFormPassword('');
    setShowPassword(false);
    setShowForm(true);
  };

  const openEdit = (user: UserWithPassword) => {
    setEditingId(user.id);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormPassword('');
    setShowPassword(false);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formRole) {
      toast.error('Completá todos los campos obligatorios');
      return;
    }
    if (!editingId && formPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    // Check duplicate email
    const duplicate = users.find(u => u.email === formEmail.trim() && u.id !== editingId);
    if (duplicate) {
      toast.error('Ya existe un usuario con ese email');
      return;
    }

    if (editingId) {
      setUsers(prev => prev.map(u =>
        u.id === editingId
          ? {
              ...u,
              name: formName.trim(),
              email: formEmail.trim(),
              role: formRole,
              ...(formPassword ? { password: formPassword } : {}),
            }
          : u
      ));
      toast.success('Usuario actualizado correctamente');
    } else {
      const newUser: UserWithPassword = {
        id: Date.now().toString(),
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        password: formPassword,
      };
      setUsers(prev => [...prev, newUser]);
      toast.success('Usuario creado correctamente');
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      toast.error('No podés eliminar tu propio usuario');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteConfirmId(null);
    toast.success('Usuario eliminado');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administrá los accesos al sistema
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 aspect-square sm:aspect-auto gap-2"
          onClick={openNew}
        >
          <UserPlus className="size-4" />
          <span className="hidden sm:inline">Nuevo usuario</span>
        </Button>
      </div>

      {/* Formulario nuevo/editar */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 bg-blue-50 border-b border-blue-100">
            <h4 className="font-medium text-blue-900">
              {editingId ? 'Editar usuario' : 'Nuevo usuario'}
            </h4>
            <button
              type="button"
              onClick={closeForm}
              className="text-blue-400 hover:text-blue-600 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
          <form onSubmit={handleSave} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="formName">Nombre completo *</Label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="formName"
                    className="pl-9"
                    placeholder="Ej: Carlos Rodríguez"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="formEmail">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="formEmail"
                    className="pl-9"
                    type="email"
                    placeholder="usuario@taller.com"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="formRole">Rol *</Label>
                <Select
                  value={formRole}
                  onValueChange={v => setFormRole(v as 'administrador' | 'colaborador')}
                  required
                >
                  <SelectTrigger id="formRole">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="size-3.5 text-blue-600" /> Administrador
                      </span>
                    </SelectItem>
                    <SelectItem value="colaborador">
                      <span className="flex items-center gap-2">
                        <UserRound className="size-3.5 text-gray-500" /> Colaborador
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="formPassword">
                  {editingId ? 'Nueva contraseña (dejá vacío para no cambiar)' : 'Contraseña *'}
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="formPassword"
                    className="pl-9 pr-10"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={editingId ? 'Sin cambios' : 'Mínimo 6 caracteres'}
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    required={!editingId}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Descripción de roles */}
            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground bg-gray-50 rounded-xl p-3">
              <div className="flex gap-2">
                <ShieldCheck className="size-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong className="text-gray-700">Administrador:</strong> acceso total, facturación y reportes.</span>
              </div>
              <div className="flex gap-2">
                <UserRound className="size-3.5 text-gray-500 shrink-0 mt-0.5" />
                <span><strong className="text-gray-700">Colaborador:</strong> clientes, órdenes, presupuestos y stock.</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                <Save className="size-4" />
                {editingId ? 'Guardar cambios' : 'Crear usuario'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="bg-white rounded-2xl border overflow-hidden divide-y">
        {users.map(user => {
          const isCurrentUser = user.id === currentUser?.id;
          const isConfirmingDelete = deleteConfirmId === user.id;

          return (
            <div key={user.id} className="flex items-center gap-3 px-5 py-4">
              {/* Avatar inicial */}
              <div className={`size-10 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm ${
                user.role === 'administrador'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                  {isCurrentUser && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
                      Vos
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>

              {/* Role badge */}
              <span className={`hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${ROLE_COLORS[user.role]}`}>
                {user.role === 'administrador'
                  ? <ShieldCheck className="size-3" />
                  : <UserRound className="size-3" />
                }
                {ROLE_LABELS[user.role]}
              </span>

              {/* Acciones */}
              {isConfirmingDelete ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-red-600 hidden sm:inline">¿Confirmar?</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 px-3 text-xs"
                    onClick={() => handleDelete(user.id)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    onClick={() => setDeleteConfirmId(null)}
                  >
                    No
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    title="Editar usuario"
                    onClick={() => openEdit(user)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
                    title={isCurrentUser ? 'No podés eliminarte a vos mismo' : 'Eliminar usuario'}
                    disabled={isCurrentUser}
                    onClick={() => setDeleteConfirmId(user.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <UserRound className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay usuarios registrados</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center pb-2">
        {users.length} usuario{users.length !== 1 ? 's' : ''} en el sistema
      </p>
    </div>
  );
}
