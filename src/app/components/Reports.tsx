import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockWorkOrders, mockBudgets, mockClients, mockStockItems } from '../lib/mockData';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileDown, TrendingUp, Calendar, DollarSign, Users, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export function Reports() {
  const [period, setPeriod] = useState('month');

  // Calculate statistics
  const totalRevenue = mockBudgets
    .filter(b => b.status === 'aprobado')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const avgOrderValue = totalRevenue / mockWorkOrders.filter(o => o.status === 'cerrada').length;

  // Monthly revenue data
  const monthlyRevenue = [
    { month: 'Enero', ingresos: 850000, ordenes: 75 },
    { month: 'Febrero', ingresos: 920000, ordenes: 82 },
    { month: 'Marzo', ingresos: 1050000, ordenes: 90 },
  ];

  // Work orders by status
  const ordersByStatus = [
    { name: 'Abiertas', value: mockWorkOrders.filter(o => o.status === 'abierta').length, color: '#fbbf24' },
    { name: 'En Progreso', value: mockWorkOrders.filter(o => o.status === 'en_progreso').length, color: '#3b82f6' },
    { name: 'Cerradas', value: mockWorkOrders.filter(o => o.status === 'cerrada').length, color: '#10b981' },
  ];

  // Budget approval rate — only valid statuses
  const budgetStats = [
    { name: 'Aprobados', value: mockBudgets.filter(b => b.status === 'aprobado').length, color: '#10b981' },
    { name: 'Enviados', value: mockBudgets.filter(b => b.status === 'enviado').length, color: '#3b82f6' },
    { name: 'Borradores', value: mockBudgets.filter(b => b.status === 'borrador').length, color: '#fbbf24' },
  ].filter(entry => entry.value > 0);

  // Top clients by revenue
  const clientRevenue = mockClients.map(client => {
    const clientBudgets = mockBudgets.filter(b => b.clientId === client.id && b.status === 'aprobado');
    const revenue = clientBudgets.reduce((sum, b) => sum + b.totalAmount, 0);
    return { name: client.name, revenue };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Stock inventory pie data
  const stockInventoryData = [
    { name: 'Stock Normal', value: mockStockItems.filter(i => i.quantity > i.minStock).length, color: '#10b981' },
    { name: 'Stock Bajo', value: mockStockItems.filter(i => i.quantity <= i.minStock).length, color: '#ef4444' },
  ].filter(entry => entry.value > 0);

  // Stock value by category (simplified)
  const stockValue = mockStockItems.map(item => ({
    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
    value: item.quantity * item.unitPrice,
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const handleExportPDF = () => {
    toast.success('Exportando reporte a PDF (simulación)');
  };

  const handleExportExcel = () => {
    toast.success('Exportando reporte a Excel (simulación)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileDown className="size-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileDown className="size-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="size-4" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="size-4" />
              Ticket Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(avgOrderValue).toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Por orden cerrada
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="size-4" />
              Clientes Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockClients.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="size-4" />
              Valor Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${mockStockItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Inventario actual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="orders">Órdenes</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-AR')}`} />
                    <Legend />
                    <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Órdenes por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ordenes" fill="#3b82f6" name="Órdenes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Presupuestos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={budgetStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {budgetStats.map((entry, index) => (
                        <Cell key={`budget-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clientes por Facturación</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientRevenue} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-AR')}`} />
                    <Bar dataKey="revenue" fill="#10b981" name="Facturación" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Órdenes por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ordersByStatus.map((entry, index) => (
                        <Cell key={`order-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rendimiento Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ordenes" fill="#3b82f6" name="Órdenes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Resumen de Órdenes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total Órdenes</p>
                    <p className="text-3xl font-bold mt-2">{mockWorkOrders.length}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Tiempo Promedio Cierre</p>
                    <p className="text-3xl font-bold mt-2">4.2 días</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Tasa de Cierre</p>
                    <p className="text-3xl font-bold mt-2">
                      {Math.round((mockWorkOrders.filter(o => o.status === 'cerrada').length / mockWorkOrders.length) * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientRevenue} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-AR')}`} />
                    <Bar dataKey="revenue" fill="#10b981" name="Facturación" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crecimiento de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Enero', clientes: 110 },
                    { month: 'Febrero', clientes: 105 },
                    { month: 'Marzo', clientes: 115 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="clientes" stroke="#3b82f6" strokeWidth={2} name="Nuevos Clientes" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Métricas de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total Clientes</p>
                    <p className="text-3xl font-bold mt-2">{mockClients.length}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Clientes Activos</p>
                    <p className="text-3xl font-bold mt-2">{mockClients.length}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Nuevos Este Mes</p>
                    <p className="text-3xl font-bold mt-2">
                      {mockClients.filter(c => c.createdAt.startsWith('2026-03')).length}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Facturación Promedio</p>
                    <p className="text-3xl font-bold mt-2">
                      ${Math.round(totalRevenue / mockClients.length).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stock">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Valor de Stock por Item</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockValue} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-AR')}`} />
                    <Bar dataKey="value" fill="#3b82f6" name="Valor" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado del Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockInventoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stockInventoryData.map((entry, index) => (
                        <Cell key={`stock-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Resumen de Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Items Totales</p>
                    <p className="text-3xl font-bold mt-2">{mockStockItems.length}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Unidades Totales</p>
                    <p className="text-3xl font-bold mt-2">
                      {mockStockItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-3xl font-bold mt-2 text-green-600">
                      ${mockStockItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString('es-AR')}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Items Bajo Stock</p>
                    <p className="text-3xl font-bold mt-2 text-red-600">
                      {mockStockItems.filter(i => i.quantity <= i.minStock).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}