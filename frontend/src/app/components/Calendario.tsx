import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus,
  CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';

type ViewMode = 'dia' | 'semana' | 'mes';

interface CalendarEvent {
  id: string;
  date: string;
  plate: string;
  client: string;
  service: string;
  status: 'pendiente' | 'confirmado' | 'completado';
  hasOT: boolean;
  otId?: string;
}

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const mockEvents: CalendarEvent[] = [
  { id: '1', date: todayStr, plate: 'AA123BB', client: 'Juan Pérez', service: 'Service completo 100.000 km', status: 'confirmado', hasOT: true, otId: '1' },
  { id: '2', date: todayStr, plate: 'AB456CD', client: 'María López', service: 'Diagnóstico frenos', status: 'pendiente', hasOT: false },
  { id: '3', date: todayStr, plate: 'AC789EF', client: 'Carlos Ruiz', service: 'Entrega vehículo', status: 'completado', hasOT: true, otId: '3' },
  { id: '4', date: todayStr, plate: 'AD012GH', client: 'Laura Gómez', service: 'Cambio de aceite y filtros', status: 'pendiente', hasOT: false },
  { id: '5', date: new Date(today.getTime() + 86400000).toISOString().split('T')[0], plate: 'AE345IJ', client: 'Roberto Silva', service: 'Alineación y balanceo', status: 'confirmado', hasOT: false },
  { id: '6', date: new Date(today.getTime() + 86400000).toISOString().split('T')[0], plate: 'AF678KL', client: 'Ana Martínez', service: 'Revisión completa pre-viaje', status: 'pendiente', hasOT: false },
  { id: '7', date: new Date(today.getTime() + 2 * 86400000).toISOString().split('T')[0], plate: 'AG901MN', client: 'Pedro Rodríguez', service: 'Cambio pastillas de freno', status: 'confirmado', hasOT: true, otId: '2' },
];

function getStatusBadge(status: CalendarEvent['status']) {
  switch (status) {
    case 'confirmado': return <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">Confirmado</Badge>;
    case 'pendiente': return <Badge className="bg-yellow-100 text-yellow-800 border-0 text-xs">Pendiente</Badge>;
    case 'completado': return <Badge className="bg-green-100 text-green-800 border-0 text-xs">Completado</Badge>;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'short', day: 'numeric'
  });
}

function getDayLabel(dateStr: string) {
  if (dateStr === todayStr) return 'Hoy';
  const tomorrow = new Date(today.getTime() + 86400000).toISOString().split('T')[0];
  if (dateStr === tomorrow) return 'Mañana';
  return formatDateShort(dateStr);
}

export function Calendario() {
  const [viewMode, setViewMode] = useState<ViewMode>('semana');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const navigate = useNavigate();

  // Get dates for the current week view
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek.getTime() + i * 86400000);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const todayEvents = mockEvents.filter(e => e.date === selectedDate);
  const weekDates = getWeekDates();

  const EventCard = ({ event, index }: { event: CalendarEvent; index: number }) => (
    <button
      type="button"
      onClick={() => event.hasOT
        ? navigate('/ordenes')
        : navigate('/ordenes', { state: { openNew: true } })
      }
      className="w-full flex items-start gap-3 p-3.5 rounded-xl bg-white border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm transition-all text-left"
    >
      <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg shrink-0 min-w-[36px] text-center">
        #{index + 1}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md">
            {event.plate}
          </span>
          {getStatusBadge(event.status)}
          {!event.hasOT && (
            <span className="text-xs text-indigo-500 font-medium">+ Crear OT</span>
          )}
        </div>
        <p className="text-sm font-semibold text-gray-800">{event.client}</p>
        <p className="text-xs text-muted-foreground">{event.service}</p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
    </button>
  );

  return (
    <div className="space-y-5">
      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="size-4 text-yellow-600" />
              <p className="text-xs text-muted-foreground">Pendientes hoy</p>
            </div>
            <p className="text-xl font-bold">{mockEvents.filter(e => e.date === todayStr && e.status === 'pendiente').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="size-4 text-amber-500" />
              <p className="text-xs text-muted-foreground">Sin OT creada</p>
            </div>
            <p className="text-xl font-bold">{mockEvents.filter(e => e.date === todayStr && !e.hasOT).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="size-4 text-green-600" />
              <p className="text-xs text-muted-foreground">Completados hoy</p>
            </div>
            <p className="text-xl font-bold">{mockEvents.filter(e => e.date === todayStr && e.status === 'completado').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── View controls ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className="text-sm font-semibold">
            {viewMode === 'dia' ? formatDate(selectedDate) : viewMode === 'semana' ? 'Esta semana' : 'Este mes'}
          </h2>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setSelectedDate(todayStr)}
          >
            Hoy
          </Button>
          <div className="inline-flex rounded-lg border bg-background p-1">
            {(['dia', 'semana', 'mes'] as ViewMode[]).map(v => (
              <Button
                key={v}
                variant={viewMode === v ? 'default' : 'ghost'}
                size="sm"
                className="text-xs capitalize px-3"
                onClick={() => setViewMode(v)}
              >
                {v === 'dia' ? 'Día' : v === 'semana' ? 'Semana' : 'Mes'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Week picker (when in day view) ── */}
      {viewMode === 'dia' && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {weekDates.map(date => {
            const eventsOnDay = mockEvents.filter(e => e.date === date).length;
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium shrink-0 transition-colors min-w-[60px] ${
                  date === selectedDate
                    ? 'bg-indigo-600 text-white'
                    : date === todayStr
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-muted-foreground hover:bg-gray-100'
                }`}
              >
                <span className="text-xs">{getDayLabel(date)}</span>
                {eventsOnDay > 0 && (
                  <span className={`text-xs font-bold ${date === selectedDate ? 'text-indigo-200' : 'text-indigo-600'}`}>
                    {eventsOnDay}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Day view ── */}
      {viewMode === 'dia' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              {todayEvents.length > 0
                ? `${todayEvents.length} turno${todayEvents.length > 1 ? 's' : ''}`
                : 'Sin turnos este día'
              }
            </h3>
            <Button
              size="sm"
              className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700"
              onClick={() => navigate('/ordenes', { state: { openNew: true } })}
            >
              <Plus className="size-3.5" />
              Nueva OT desde este día
            </Button>
          </div>

          {todayEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarDays className="size-10 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="text-sm text-muted-foreground">No hay turnos para este día</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 gap-1.5 text-xs"
                  onClick={() => navigate('/ordenes', { state: { openNew: true } })}
                >
                  <Plus className="size-3.5" />
                  Crear OT
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {todayEvents.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
            </div>
          )}
        </div>
      )}

      {/* ── Week view — horizontal columns ── */}
      {viewMode === 'semana' && (
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-xl overflow-hidden border border-gray-200">
              {weekDates.map(date => {
                const isToday = date === todayStr;
                const dayEvents = mockEvents.filter(e => e.date === date);
                return (
                  <div
                    key={date}
                    className={`px-3 py-2.5 text-center ${isToday ? 'bg-indigo-600' : 'bg-white'}`}
                  >
                    <p className={`text-xs font-semibold uppercase tracking-wide ${isToday ? 'text-white' : 'text-muted-foreground'}`}>
                      {new Date(date + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'short' })}
                    </p>
                    <p className={`text-lg font-bold leading-tight ${isToday ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(date + 'T00:00:00').getDate()}
                    </p>
                    {dayEvents.length > 0 && (
                      <span className={`text-xs font-medium ${isToday ? 'text-indigo-200' : 'text-indigo-600'}`}>
                        {dayEvents.length} turno{dayEvents.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Day columns with events */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-t-0 border-gray-200 rounded-b-xl overflow-hidden min-h-[320px]">
              {weekDates.map(date => {
                const isToday = date === todayStr;
                const dayEvents = mockEvents.filter(e => e.date === date);
                return (
                  <div key={date} className={`bg-white p-2 space-y-1.5 ${isToday ? 'bg-indigo-50/30' : ''}`}>
                    {dayEvents.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => navigate('/ordenes', { state: { openNew: true } })}
                        className="w-full h-12 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-xs text-muted-foreground hover:border-indigo-300 hover:text-indigo-500 transition-colors"
                      >
                        <Plus className="size-3 mr-1" />OT
                      </button>
                    ) : (
                      dayEvents.map((event, i) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => event.hasOT ? navigate('/ordenes') : navigate('/ordenes', { state: { openNew: true } })}
                          className={`w-full text-left p-2 rounded-lg border transition-colors ${
                            event.status === 'completado'
                              ? 'bg-green-50 border-green-200 hover:bg-green-100'
                              : event.status === 'confirmado'
                                ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                                : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs font-bold text-indigo-700">#{i + 1}</span>
                            {!event.hasOT && <span className="text-xs text-green-600 font-medium">+ OT</span>}
                          </div>
                          <p className="text-xs font-semibold truncate leading-tight">{event.client}</p>
                          <p className="text-xs font-mono text-muted-foreground">{event.plate}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5 leading-tight">{event.service}</p>
                        </button>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Month view (simplified grid) ── */}
      {viewMode === 'mes' && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => {
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
                const dayNum = i - startOffset + 1;
                const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                if (dayNum < 1 || dayNum > daysInMonth) {
                  return <div key={i} className="aspect-square" />;
                }
                const dateStr = new Date(today.getFullYear(), today.getMonth(), dayNum).toISOString().split('T')[0];
                const dayEvents = mockEvents.filter(e => e.date === dateStr);
                const isToday = dateStr === todayStr;
                return (
                  <button
                    key={i}
                    onClick={() => { setSelectedDate(dateStr); setViewMode('dia'); }}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs transition-colors hover:bg-gray-100 ${
                      isToday ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{dayNum}</span>
                    {dayEvents.length > 0 && (
                      <span className={`text-xs font-bold ${isToday ? 'text-indigo-200' : 'text-indigo-600'}`}>
                        {dayEvents.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
