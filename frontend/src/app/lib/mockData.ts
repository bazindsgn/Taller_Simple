// Mock data for demonstration purposes

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  taxId: string;
  createdAt: string;
  deleted?: boolean;
  archived?: boolean;
  source: 'confirmado' | 'autogestionado' | 'importado';
  invoiceType?: string;
}

export interface Vehicle {
  id: string;
  clientId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  idPhotoUrl?: string;
}

export interface WorkOrder {
  id: string;
  clientId: string;
  vehicleId: string;
  description: string;
  status: 'abierta' | 'en_progreso' | 'cerrada';
  createdAt: string;
  closedAt?: string;
  createdBy: string;
  totalAmount?: number;
  deleted?: boolean;
  archived?: boolean;
}

export interface Budget {
  id: string;
  workOrderId: string;
  clientId: string;
  vehicleId?: string;
  items: BudgetItem[];
  totalAmount: number;
  status: 'borrador' | 'enviado' | 'aprobado' | 'eliminado';
  createdAt: string;
  sentAt?: string;
  images?: string[];
  comments?: string;
  archived?: boolean;
  deleted?: boolean;
}

export interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  budgetId?: string;
  workOrderId?: string;
  clientId: string;
  vehicleId?: string;
  invoiceNumber?: string;
  items: PaymentItem[];
  totalAmount: number;
  taxAmount: number;
  createdAt: string;
  status: 'borrador' | 'pendiente' | 'enviada' | 'pagada';
  afipStatus?: 'pendiente' | 'autorizada' | 'rechazada';
  invoiceType?: 'A' | 'B' | 'C';
  customerTaxCondition?: string;
  deleted?: boolean;
  archived?: boolean;
}

export interface StockItem {
  id: string;
  code: string;
  name: string;
  description: string;
  quantity: number;
  minStock: number;
  unitPrice: number;
  supplier?: string;
  location?: string;
  ignoreMinStockAlert?: boolean;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'entrada' | 'salida';
  quantity: number;
  date: string;
  reason: string;
  userId: string;
  supplier?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'gerente' | 'administrador' | 'tecnico';
  password?: string;
}

// Mock users
export const mockUsers: User[] = [
  { id: '1', name: 'Gerente Taller', email: 'gerente@taller.com', role: 'gerente', password: 'demo' },
  { id: '2', name: 'Admin Taller', email: 'admin@taller.com', role: 'administrador', password: 'demo' },
  { id: '3', name: 'Juan Técnico', email: 'juan@taller.com', role: 'tecnico', password: 'demo' },
  { id: '4', name: 'María Técnica', email: 'maria@taller.com', role: 'tecnico', password: 'demo' },
];

// Mock clients
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    phone: '+54 9 11 1234-5678',
    email: 'carlos.r@email.com',
    address: 'Av. Corrientes 1234, CABA',
    taxId: '20-12345678-9',
    createdAt: '2025-01-15',
    source: 'confirmado',
    invoiceType: 'B',
  },
  {
    id: '2',
    name: 'Ana Martínez',
    phone: '+54 9 11 2345-6789',
    email: 'ana.m@email.com',
    address: 'Calle Falsa 456, CABA',
    taxId: '27-23456789-0',
    createdAt: '2025-02-10',
    source: 'autogestionado',
  },
  {
    id: '3',
    name: 'Roberto Silva',
    phone: '+54 9 11 3456-7890',
    email: 'roberto.s@email.com',
    address: 'San Martín 789, Zona Norte',
    taxId: '20-34567890-1',
    createdAt: '2025-03-05',
    source: 'importado',
    invoiceType: 'A',
  },
  {
    id: '4',
    name: 'Laura Gómez',
    phone: '+54 9 11 4567-8901',
    email: 'laura.g@email.com',
    address: 'Av. Libertador 2000, CABA',
    taxId: '27-45678901-2',
    createdAt: '2026-06-02',
    source: 'confirmado',
  },
  {
    id: '5',
    name: 'Martín López',
    phone: '+54 9 11 5678-9012',
    email: 'martin.l@email.com',
    address: 'Belgrano 300, Zona Sur',
    taxId: '20-56789012-3',
    createdAt: '2026-06-02',
    source: 'autogestionado',
  },
];

// Mock vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    clientId: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2018,
    licensePlate: 'AB123CD',
    vin: '1HGBH41JXMN109186',
    color: 'Gris',
    idPhotoUrl: '/mock/cedula-1.jpg',
  },
  {
    id: '2',
    clientId: '2',
    brand: 'Ford',
    model: 'Focus',
    year: 2020,
    licensePlate: 'EF456GH',
    vin: '2HGBH41JXMN109187',
    color: 'Azul',
  },
  {
    id: '3',
    clientId: '3',
    brand: 'Chevrolet',
    model: 'Cruze',
    year: 2019,
    licensePlate: 'IJ789KL',
    vin: '3HGBH41JXMN109188',
    color: 'Negro',
    idPhotoUrl: '/mock/cedula-3.jpg',
  },
  {
    id: '4',
    clientId: '4',
    brand: 'Volkswagen',
    model: 'Gol',
    year: 2021,
    licensePlate: 'MN012OP',
    vin: '4HGBH41JXMN109189',
    color: 'Blanco',
    idPhotoUrl: '/mock/cedula-4.jpg',
  },
  {
    id: '5',
    clientId: '5',
    brand: 'Renault',
    model: 'Sandero',
    year: 2022,
    licensePlate: 'QR345ST',
    vin: '5HGBH41JXMN109190',
    color: 'Rojo',
  },
];

// Mock work orders
export const mockWorkOrders: WorkOrder[] = [
  {
    id: '1',
    clientId: '1',
    vehicleId: '1',
    description: 'Reparación de paragolpes delantero y pintura',
    status: 'en_progreso',
    createdAt: '2026-03-15',
    createdBy: '2',
    totalAmount: 85000,
  },
  {
    id: '2',
    clientId: '2',
    vehicleId: '2',
    description: 'Pintura completa del vehículo',
    status: 'abierta',
    createdAt: '2026-03-18',
    createdBy: '1',
  },
  {
    id: '3',
    clientId: '3',
    vehicleId: '3',
    description: 'Reparación puerta trasera y ajuste de chapa',
    status: 'cerrada',
    createdAt: '2026-03-10',
    closedAt: '2026-03-14',
    createdBy: '3',
    totalAmount: 120000,
  },
];

// Mock budgets
export const mockBudgets: Budget[] = [
  {
    id: '1',
    workOrderId: '1',
    clientId: '1',
    vehicleId: '1',
    items: [
      { id: '1', description: 'Paragolpes delantero', quantity: 1, unitPrice: 45000, total: 45000 },
      { id: '2', description: 'Pintura y mano de obra', quantity: 1, unitPrice: 40000, total: 40000 },
    ],
    totalAmount: 85000,
    status: 'aprobado',
    createdAt: '2026-03-15',
    sentAt: '2026-03-15',
    comments: 'Cliente aprobó el presupuesto inmediatamente',
  },
  {
    id: '2',
    workOrderId: '2',
    clientId: '2',
    vehicleId: '2',
    items: [
      { id: '3', description: 'Pintura completa', quantity: 1, unitPrice: 180000, total: 180000 },
      { id: '4', description: 'Pulido y encerado', quantity: 1, unitPrice: 25000, total: 25000 },
    ],
    totalAmount: 205000,
    status: 'enviado',
    createdAt: '2026-03-18',
    sentAt: '2026-03-18',
    comments: 'Esperando confirmación del cliente',
  },
  {
    id: '3',
    workOrderId: '',
    clientId: '3',
    vehicleId: '3',
    items: [
      { id: '5', description: 'Reparación puerta trasera', quantity: 1, unitPrice: 75000, total: 75000 },
      { id: '6', description: 'Ajuste de chapa', quantity: 1, unitPrice: 35000, total: 35000 },
    ],
    totalAmount: 110000,
    status: 'borrador',
    createdAt: '2026-03-20',
    comments: 'Pedí cotización del paragolpe el 12/3',
  },
];

// Mock stock items
export const mockStockItems: StockItem[] = [
  {
    id: '1',
    code: 'PG-001',
    name: 'Paragolpes Toyota Corolla',
    description: 'Paragolpes delantero compatible 2015-2020',
    quantity: 5,
    minStock: 2,
    unitPrice: 45000,
    supplier: 'Repuestos SA',
    location: 'Estante A-3',
  },
  {
    id: '2',
    code: 'PT-001',
    name: 'Pintura Blanca 1L',
    description: 'Pintura automotriz profesional',
    quantity: 12,
    minStock: 5,
    unitPrice: 8500,
    supplier: 'Pinturas Pro',
    location: 'Depósito - Sector Pinturas',
  },
  {
    id: '3',
    code: 'PT-002',
    name: 'Pintura Negra 1L',
    description: 'Pintura automotriz profesional',
    quantity: 3,
    minStock: 5,
    unitPrice: 8500,
    supplier: 'Pinturas Pro',
    location: 'Depósito - Sector Pinturas',
  },
  {
    id: '4',
    code: 'LJ-001',
    name: 'Lija Grano 80',
    description: 'Caja x100 unidades',
    quantity: 250,
    minStock: 100,
    unitPrice: 150,
    supplier: 'Herramientas del Taller',
    location: 'Estante B-1',
  },
];

// Mock stock movements
export const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    itemId: '1',
    type: 'entrada',
    quantity: 10,
    date: '2026-03-01',
    reason: 'Compra a proveedor',
    userId: '1',
    supplier: 'Repuestos SA',
  },
  {
    id: '2',
    itemId: '1',
    type: 'salida',
    quantity: 5,
    date: '2026-03-15',
    reason: 'Orden de trabajo #1',
    userId: '2',
  },
  {
    id: '3',
    itemId: '2',
    type: 'entrada',
    quantity: 20,
    date: '2026-02-15',
    reason: 'Reposición de stock',
    userId: '1',
    supplier: 'Pinturas Pro',
  },
  {
    id: '4',
    itemId: '2',
    type: 'salida',
    quantity: 8,
    date: '2026-03-10',
    reason: 'Orden de trabajo #2',
    userId: '2',
  },
];

// Mock invoices
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    workOrderId: '1',
    clientId: '1',
    vehicleId: '1',
    invoiceNumber: 'A-0001-00000001',
    items: [
      { id: '1-1', description: 'Reparación paragolpes', quantity: 1, unitPrice: 50000, total: 50000 },
      { id: '1-2', description: 'Pintura completa', quantity: 1, unitPrice: 35000, total: 35000 },
    ],
    totalAmount: 85000,
    taxAmount: 17850,
    createdAt: '2026-03-16',
    status: 'pagada',
    afipStatus: 'autorizada',
    invoiceType: 'B',
    customerTaxCondition: 'Consumidor Final',
  },
  {
    id: '2',
    budgetId: '2',
    clientId: '2',
    vehicleId: '2',
    invoiceNumber: 'A-0001-00000002',
    items: [
      { id: '2-1', description: 'Pintura completa', quantity: 1, unitPrice: 205000, total: 205000 },
    ],
    totalAmount: 205000,
    taxAmount: 43050,
    createdAt: '2026-03-19',
    status: 'enviada',
    afipStatus: 'autorizada',
    invoiceType: 'A',
    customerTaxCondition: 'Responsable Inscripto',
  },
  {
    id: '3',
    workOrderId: '3',
    clientId: '3',
    vehicleId: '3',
    items: [
      { id: '3-1', description: 'Service completo', quantity: 1, unitPrice: 0, total: 0 },
      { id: '3-2', description: 'Cambio de aceite', quantity: 1, unitPrice: 0, total: 0 },
    ],
    totalAmount: 0,
    taxAmount: 0,
    createdAt: '2026-03-21',
    status: 'borrador',
  },
];