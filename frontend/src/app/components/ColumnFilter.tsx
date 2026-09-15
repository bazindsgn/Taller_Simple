import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';
import { ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { cn } from './ui/utils';

export type DateFilterType = 'all' | 'today' | 'week' | 'month' | 'lastMonth' | 'custom';

export interface StatusOption {
  value: string;
  label: string;
}

export interface ColumnFilterProps {
  label: string;
  // Sort
  sortField: string;
  currentSortField: string;
  currentSortDirection: 'asc' | 'desc' | null;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  // Optional date filter
  showDateFilter?: boolean;
  dateFilter?: DateFilterType;
  onDateFilterChange?: (filter: DateFilterType) => void;
  customDateFrom?: string;
  customDateTo?: string;
  onCustomDateFromChange?: (date: string) => void;
  onCustomDateToChange?: (date: string) => void;
  // Optional status filter
  statusOptions?: StatusOption[];
  selectedStatuses?: string[];
  onStatusChange?: (statuses: string[]) => void;
}

const DATE_OPTIONS = [
  { value: 'all', label: 'Todas las fechas' },
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Mes actual' },
  { value: 'lastMonth', label: 'Mes anterior' },
  { value: 'custom', label: 'Rango personalizado' },
];

export function ColumnFilter({
  label,
  sortField,
  currentSortField,
  currentSortDirection,
  onSort,
  showDateFilter,
  dateFilter = 'all',
  onDateFilterChange,
  customDateFrom = '',
  customDateTo = '',
  onCustomDateFromChange,
  onCustomDateToChange,
  statusOptions,
  selectedStatuses = [],
  onStatusChange,
}: ColumnFilterProps) {
  const isSorted = currentSortField === sortField;
  const hasDateFilter = showDateFilter && dateFilter !== 'all';
  const hasStatusFilter = selectedStatuses.length > 0;
  const isActive = isSorted || hasDateFilter || hasStatusFilter;

  const handleStatusToggle = (value: string) => {
    if (!onStatusChange) return;
    if (selectedStatuses.includes(value)) {
      onStatusChange(selectedStatuses.filter(s => s !== value));
    } else {
      onStatusChange([...selectedStatuses, value]);
    }
  };

  return (
    <div className="flex items-center gap-0.5 whitespace-nowrap select-none">
      <span>{label}</span>
      {isSorted && (
        currentSortDirection === 'asc'
          ? <ArrowUp className="size-3 text-blue-600 flex-shrink-0" />
          : <ArrowDown className="size-3 text-blue-600 flex-shrink-0" />
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-6 w-5 p-0 ml-0.5 flex-shrink-0',
              isActive
                ? 'text-blue-600 hover:text-blue-700'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={e => e.stopPropagation()}
          >
            <ChevronDown className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-2" align="start" onClick={e => e.stopPropagation()}>
          {/* Sort Options */}
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 pb-1">
              Ordenar
            </p>
            <button
              className={cn(
                'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors',
                isSorted && currentSortDirection === 'asc' && 'bg-blue-50 text-blue-700'
              )}
              onClick={() => onSort(sortField, 'asc')}
            >
              <ArrowUp className="size-3.5 flex-shrink-0" />
              Ascendente (A → Z)
            </button>
            <button
              className={cn(
                'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors',
                isSorted && currentSortDirection === 'desc' && 'bg-blue-50 text-blue-700'
              )}
              onClick={() => onSort(sortField, 'desc')}
            >
              <ArrowDown className="size-3.5 flex-shrink-0" />
              Descendente (Z → A)
            </button>
          </div>

          {/* Date Filter */}
          {showDateFilter && (
            <>
              <Separator className="my-2" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 pb-1">
                  Filtrar por fecha
                </p>
                {DATE_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    className={cn(
                      'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors',
                      dateFilter === option.value && 'bg-blue-50 text-blue-700'
                    )}
                    onClick={() => onDateFilterChange?.(option.value as DateFilterType)}
                  >
                    <span className={cn(
                      'size-2 rounded-full flex-shrink-0',
                      dateFilter === option.value ? 'bg-blue-600' : 'border border-muted-foreground'
                    )} />
                    {option.label}
                  </button>
                ))}
                {dateFilter === 'custom' && (
                  <div className="px-1 pt-2 space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Desde</Label>
                      <Input
                        type="date"
                        value={customDateFrom}
                        onChange={e => onCustomDateFromChange?.(e.target.value)}
                        className="h-7 text-xs mt-1"
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Hasta</Label>
                      <Input
                        type="date"
                        value={customDateTo}
                        onChange={e => onCustomDateToChange?.(e.target.value)}
                        className="h-7 text-xs mt-1"
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Status Filter */}
          {statusOptions && statusOptions.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 pb-1">
                  Filtrar por estado
                </p>
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    className={cn(
                      'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors',
                      selectedStatuses.includes(option.value) && 'bg-blue-50 text-blue-700'
                    )}
                    onClick={() => handleStatusToggle(option.value)}
                  >
                    <span className={cn(
                      'size-2 rounded-sm flex-shrink-0',
                      selectedStatuses.includes(option.value)
                        ? 'bg-blue-600'
                        : 'border border-muted-foreground'
                    )} />
                    {option.label}
                  </button>
                ))}
                {selectedStatuses.length > 0 && (
                  <>
                    <Separator className="my-1" />
                    <button
                      className="flex items-center gap-2 w-full px-2 py-1 rounded-md text-xs text-muted-foreground hover:bg-accent transition-colors"
                      onClick={() => onStatusChange?.([])}
                    >
                      Limpiar filtro de estado
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
