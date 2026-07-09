import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AuthService } from '../lib/auth';
import { toast } from 'sonner';
import { Wrench, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = AuthService.login(email, password);
    if (user) {
      toast.success(`Bienvenido, ${user.name}`);
      navigate('/');
    } else {
      toast.error('Credenciales inválidas');
    }
  };

  const handleDemoLogin = (userEmail: string) => {
    const user = AuthService.login(userEmail, 'demo');
    if (user) {
      toast.success(`Bienvenido, ${user.name}`);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <Wrench className="size-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Gestión.net</CardTitle>
          <CardDescription>
            Ingresá tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@taller.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => toast.info('Función de recuperación de contraseña en desarrollo')}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Iniciar Sesión
            </Button>
          </form>

          {/* Registro */}
          <div className="mt-5 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tenés cuenta?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Registrá tu taller
              </Link>
            </p>
          </div>

          <div className="mt-5 pt-5 border-t">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Acceso rápido de demostración:
            </p>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin('gerente@taller.com')}
              >
                Acceder como Gerente
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin('admin@taller.com')}
              >
                Acceder como Administrador
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin('juan@taller.com')}
              >
                Acceder como Técnico
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}