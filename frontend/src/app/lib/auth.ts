import { User, mockUsers } from './mockData';

// Simulated authentication system
export const AuthService = {
  currentUser: null as User | null,

  login(email: string, password: string): User | null {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  },

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  },

  isGerente(): boolean {
    return this.getCurrentUser()?.role === 'gerente';
  },

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'administrador';
  },

  isTecnico(): boolean {
    return this.getCurrentUser()?.role === 'tecnico';
  },

  canAccessReports(): boolean {
    return this.getCurrentUser()?.role === 'gerente';
  },

  canAccessInvoices(): boolean {
    const role = this.getCurrentUser()?.role;
    return role === 'gerente' || role === 'administrador';
  },
};
