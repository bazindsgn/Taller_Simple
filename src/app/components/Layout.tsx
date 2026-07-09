import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import { AuthService } from '../lib/auth';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Receipt,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
  Wrench,
  Trash2,
  Settings,
  UserCog,
  CalendarDays,
} from 'lucide-react';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Inicio', roles: ['gerente', 'administrador', 'tecnico'] },
    { path: '/ordenes', icon: FileText, label: 'Órdenes de Trabajo', roles: ['gerente', 'administrador', 'tecnico'] },
    { path: '/calendario', icon: CalendarDays, label: 'Calendario', roles: ['gerente', 'administrador', 'tecnico'] },
    { path: '/clientes', icon: Users, label: 'Clientes', roles: ['gerente', 'administrador', 'tecnico'] },
    { path: '/stock', icon: Package, label: 'Repuestos / Stock', roles: ['gerente', 'administrador', 'tecnico'] },
    { path: '/presupuestos', icon: DollarSign, label: 'Presupuestos', roles: ['gerente', 'administrador', 'tecnico'] },
    { path: '/reportes', icon: BarChart3, label: 'Estadísticas', roles: ['gerente'] },
    { path: '/cobranzas', icon: Receipt, label: 'Cobranzas', roles: ['gerente', 'administrador'] },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between bg-white border-b px-4 h-[57px] shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Wrench className="size-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-sm">Taller Tomalino</h1>
                <p className="text-xs text-muted-foreground">Taller Simple</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            {user.role === 'gerente' && (
              <div className="flex items-center gap-1">
                <Link
                  to="/usuarios"
                  onClick={() => setSidebarOpen(false)}
                  title="Gestión de usuarios"
                  className={`p-1.5 rounded-lg transition-colors ${
                    location.pathname === '/usuarios'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <UserCog className="size-4" />
                </Link>
                <Link
                  to="/configuracion"
                  onClick={() => setSidebarOpen(false)}
                  title="Configuración del taller"
                  className={`p-1.5 rounded-lg transition-colors ${
                    location.pathname === '/configuracion'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <Settings className="size-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-3">
            <ul className="space-y-0.5">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isSecondary = item.path === '/presupuestos' || item.path === '/cobranzas' || item.path === '/reportes';
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm
                        ${isActive
                          ? 'bg-indigo-600 text-white'
                          : isSecondary
                            ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className={`size-4 shrink-0 ${isSecondary && !isActive ? 'opacity-70' : ''}`} />
                      <span className={isSecondary && !isActive ? 'text-sm' : 'text-sm font-medium'}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Papelera */}
            {user.role !== 'tecnico' && (
              <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                <p className="text-xs font-medium text-muted-foreground uppercase px-3 mb-1.5">Sistema</p>
                <Link
                  to="/papelera"
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm
                    ${location.pathname === '/papelera'
                      ? 'bg-red-600 text-white'
                      : 'text-red-500 hover:bg-red-50'
                    }
                  `}
                >
                  <Trash2 className="size-4 shrink-0" />
                  <span>Papelera</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 text-sm gap-3"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b z-10">
          <div className="flex items-center justify-between px-4 h-[57px]">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <div className="flex-1 lg:ml-0 ml-4">
              <h2 className="text-base font-semibold text-gray-800">
                {filteredMenuItems.find(item => item.path === location.pathname)?.label
                  || (location.pathname === '/usuarios' ? 'Gestión de Usuarios'
                    : location.pathname === '/configuracion' ? 'Configuración del Taller'
                    : location.pathname === '/papelera' ? 'Papelera'
                    : location.pathname === '/calendario' ? 'Calendario'
                    : 'Inicio')}
              </h2>
            </div>
            <div className="text-xs text-muted-foreground hidden sm:block">
              {new Date().toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
