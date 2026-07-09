import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockStockItems, mockStockMovements, mockUsers, StockItem, StockMovement } from '../lib/mockData';
import { Plus, Package, AlertTriangle, TrendingDown, TrendingUp, Search, Edit, BellOff, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

export function Stock() {
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(mockStockMovements);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [movementOpen, setMovementOpen] = useState(false);
  const [editMinStockOpen, setEditMinStockOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [movementType, setMovementType] = useState<'entrada' | 'salida'>('entrada');
  const [newMinStock, setNewMinStock] = useState(0);

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'code-asc':
        return a.code.localeCompare(b.code);
      case 'code-desc':
        return b.code.localeCompare(a.code);
      default:
        return 0;
    }
  });

  const lowStockItems = stockItems.filter(item => item.quantity <= item.minStock && !item.ignoreMinStockAlert);
  const totalItems = stockItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = stockItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Item agregado al stock');
    setNewItemOpen(false);
  };

  const handleAddMovement = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${movementType === 'entrada' ? 'Ingreso' : 'Egreso'} registrado exitosamente`);
    setMovementOpen(false);
  };

  const handleEditMinStock = (item: StockItem) => {
    setSelectedItem(item);
    setNewMinStock(item.minStock);
    setEditMinStockOpen(true);
  };

  const handleSaveMinStock = () => {
    if (!selectedItem) return;
    setStockItems(prev => prev.map(item =>
      item.id === selectedItem.id ? { ...item, minStock: newMinStock } : item
    ));
    toast.success('Stock mínimo actualizado');
    setEditMinStockOpen(false);
  };

  const handleIgnoreAlert = (itemId: string) => {
    setStockItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, ignoreMinStockAlert: true } : item
    ));
    toast.success('Alerta de stock mínimo ignorada');
  };

  const handleRestoreAlert = (itemId: string) => {
    setStockItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, ignoreMinStockAlert: false } : item
    ));
    toast.success('Alerta de stock mínimo restaurada');
  };

  const getItemMovements = (itemId: string) => {
    return stockMovements.filter(m => m.itemId === itemId);
  };

  return (
    <div className="space-y-6">
      {/* Stats + Botones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Botón Nuevo Item */}
        <Dialog open={newItemOpen} onOpenChange={setNewItemOpen}>
          <DialogTrigger asChild>
            <Card className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer border-indigo-600 aspect-square max-h-[140px]">
              <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <Plus className="size-8 mb-2" />
                <span className="text-base font-semibold text-center">Nuevo Item</span>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Item</DialogTitle>
              <DialogDescription>Complete los datos del item de stock</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código *</Label>
                  <Input id="code" placeholder="Ej: PG-001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input id="name" placeholder="Nombre del item" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" placeholder="Descripción detallada del item" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad Inicial *</Label>
                  <Input id="quantity" type="number" min="0" defaultValue="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock Mínimo *</Label>
                  <Input id="minStock" type="number" min="0" defaultValue="1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Precio Unitario *</Label>
                  <Input id="unitPrice" type="number" min="0" step="0.01" placeholder="0.00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input id="location" placeholder="Ej: Estante A-3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Input id="supplier" placeholder="Nombre del proveedor" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setNewItemOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Agregar Item</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Botón Registrar Movimiento - Separado */}
        <Dialog open={movementOpen} onOpenChange={setMovementOpen}>
          <DialogTrigger asChild>
            <Card className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer border-indigo-600 aspect-square max-h-[140px]">
              <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <ArrowRightLeft className="size-8 mb-2" />
                <span className="text-base font-semibold text-center">Movimiento</span>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Movimiento</DialogTitle>
              <DialogDescription>Entrada o salida de stock</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMovement} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Movimiento</Label>
                <Select value={movementType} onValueChange={(v) => setMovementType(v as 'entrada' | 'salida')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="size-4 text-green-600" />
                        Entrada / Ingreso
                      </span>
                    </SelectItem>
                    <SelectItem value="salida">
                      <span className="flex items-center gap-2">
                        <TrendingDown className="size-4 text-red-600" />
                        Salida / Egreso
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item">Item *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar item" />
                  </SelectTrigger>
                  <SelectContent>
                    {stockItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.code} - {item.name} (Stock: {item.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="movementQuantity">Cantidad *</Label>
                <Input id="movementQuantity" type="number" min="1" placeholder="Cantidad" required />
              </div>
              {movementType === 'entrada' && (
                <div className="space-y-2">
                  <Label htmlFor="movementSupplier">Proveedor</Label>
                  <Input id="movementSupplier" placeholder="Nombre del proveedor" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo *</Label>
                <Textarea
                  id="reason"
                  placeholder={movementType === 'entrada' ? 'Ej: Compra a proveedor' : 'Ej: Utilizado en orden #123'}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setMovementOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Registrar {movementType === 'entrada' ? 'Entrada' : 'Salida'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Stats Cards */}
        <Card className="max-h-[140px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Items en Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockItems.length}</div>
          </CardContent>
        </Card>
        <Card className="max-h-[140px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Unidades Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card className="max-h-[140px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">${totalValue.toLocaleString('es-AR')}</div>
          </CardContent>
        </Card>
        <Card className="max-h-[140px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Bajo Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="size-5" />
              Alerta de Stock Bajo
            </CardTitle>
            <CardDescription className="text-red-700">
              Los siguientes items necesitan reposición
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Código: {item.code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Stock: {item.quantity} / Mín: {item.minStock}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleIgnoreAlert(item.id)}
                      title="Ignorar alerta"
                    >
                      <BellOff className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items con alerta ignorada */}
      {stockItems.filter(item => item.ignoreMinStockAlert).length > 0 && (
        <Card className="border-gray-300 bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700 text-sm">
              <BellOff className="size-4" />
              Alertas Ignoradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stockItems.filter(item => item.ignoreMinStockAlert).map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white p-2 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreAlert(item.id)}
                  >
                    Restaurar Alerta
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Management Tabs */}
      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Items en Stock</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <CardTitle>Inventario de Stock</CardTitle>
                  <CardDescription>Control de repuestos y materiales</CardDescription>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Nombre A-Z</SelectItem>
                    <SelectItem value="name-desc">Nombre Z-A</SelectItem>
                    <SelectItem value="code-asc">Código A-Z</SelectItem>
                    <SelectItem value="code-desc">Código Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código, nombre, descripción o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Stock Mín.</TableHead>
                      <TableHead>Precio Unit.</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono font-medium">{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.location || 'Sin ubicación'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.quantity <= item.minStock ? 'destructive' : 'secondary'}>
                            {item.quantity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{item.minStock}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6"
                              onClick={() => handleEditMinStock(item)}
                              title="Editar stock mínimo"
                            >
                              <Edit className="size-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${item.unitPrice.toLocaleString('es-AR')}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.supplier || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{item.name}</DialogTitle>
                                <DialogDescription>Código: {item.code}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-muted-foreground">Stock Actual</Label>
                                    <p className="text-2xl font-bold">{item.quantity}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-muted-foreground">Stock Mínimo</Label>
                                    <p className="text-2xl font-bold">{item.minStock}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-muted-foreground">Precio Unitario</Label>
                                    <p className="text-xl font-semibold text-green-600">
                                      ${item.unitPrice.toLocaleString('es-AR')}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-muted-foreground">Valor Total</Label>
                                    <p className="text-xl font-semibold text-blue-600">
                                      ${(item.quantity * item.unitPrice).toLocaleString('es-AR')}
                                    </p>
                                  </div>
                                  {item.location && (
                                    <div className="space-y-2 col-span-2">
                                      <Label className="text-muted-foreground">Ubicación</Label>
                                      <p className="text-sm">{item.location}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-muted-foreground">Descripción</Label>
                                  <p className="text-sm">{item.description}</p>
                                </div>
                                {item.supplier && (
                                  <div className="space-y-2">
                                    <Label className="text-muted-foreground">Proveedor Principal</Label>
                                    <p>{item.supplier}</p>
                                  </div>
                                )}

                                <div className="space-y-3 pt-4 border-t">
                                  <Label>Últimos Movimientos</Label>
                                  <div className="space-y-2">
                                    {getItemMovements(item.id).slice(0, 5).map((movement) => {
                                      const user = mockUsers.find(u => u.id === movement.userId);
                                      return (
                                        <div key={movement.id} className="flex items-center justify-between border rounded-lg p-3">
                                          <div className="flex items-center gap-3">
                                            {movement.type === 'entrada' ? (
                                              <TrendingUp className="size-5 text-green-600" />
                                            ) : (
                                              <TrendingDown className="size-5 text-red-600" />
                                            )}
                                            <div>
                                              <p className="text-sm font-medium">
                                                {movement.type === 'entrada' ? 'Entrada' : 'Salida'} - {movement.quantity} unidades
                                              </p>
                                              <p className="text-xs text-muted-foreground">{movement.reason}</p>
                                              {movement.supplier && (
                                                <p className="text-xs text-blue-600">Proveedor: {movement.supplier}</p>
                                              )}
                                            </div>
                                          </div>
                                          <div className="text-right text-xs text-muted-foreground">
                                            <p>{new Date(movement.date).toLocaleDateString('es-AR')}</p>
                                            <p>{user?.name}</p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    {getItemMovements(item.id).length === 0 && (
                                      <p className="text-sm text-muted-foreground text-center py-4">
                                        No hay movimientos registrados
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron items</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos de Stock</CardTitle>
              <CardDescription>Historial de entradas y salidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.map((movement) => {
                      const item = stockItems.find(i => i.id === movement.itemId);
                      const user = mockUsers.find(u => u.id === movement.userId);
                      return (
                        <TableRow key={movement.id}>
                          <TableCell>
                            <Badge variant={movement.type === 'entrada' ? 'default' : 'destructive'}>
                              <span className="flex items-center gap-1">
                                {movement.type === 'entrada' ? (
                                  <TrendingUp className="size-4" />
                                ) : (
                                  <TrendingDown className="size-4" />
                                )}
                                {movement.type}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>{item?.name || `Item #${movement.itemId}`}</TableCell>
                          <TableCell className="font-medium">
                            {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {movement.supplier || '—'}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{movement.reason}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user?.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(movement.date).toLocaleDateString('es-AR')}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para editar stock mínimo */}
      <Dialog open={editMinStockOpen} onOpenChange={setEditMinStockOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar Stock Mínimo</DialogTitle>
            <DialogDescription>{selectedItem?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newMinStock">Nuevo Stock Mínimo</Label>
              <Input
                id="newMinStock"
                type="number"
                min="0"
                value={newMinStock}
                onChange={e => setNewMinStock(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditMinStockOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveMinStock}>Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
