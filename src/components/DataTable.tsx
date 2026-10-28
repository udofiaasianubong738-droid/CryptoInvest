import React from 'react';
import { 
  ClusterInstance, 
  SortField, 
  SortDirection, 
  NodeStatus 
} from '../types/dashboard';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  RotateCcw,
  SlidersHorizontal,
  Server
} from 'lucide-react';

interface DataTableProps {
  instances: ClusterInstance[];
  totalCount: number;
  selectedRowIndex: number;
  setSelectedRowIndex: (idx: number) => void;
  onInspectInstance: (instance: ClusterInstance) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  selectedRegionFilter: string;
  onClearRegionFilter: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  instances,
  totalCount,
  selectedRowIndex,
  setSelectedRowIndex,
  onInspectInstance,
  sortField,
  sortDirection,
  onSort,
  onResetFilters,
  isFiltered,
  selectedRegionFilter,
  onClearRegionFilter
}) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[var(--text-muted)] opacity-50 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[var(--primary)]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[var(--primary)]" />
    );
  };

  const getStatusBadge = (status: NodeStatus) => {
    switch (status) {
      case 'Healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-[var(--success)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Healthy
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-[var(--warning)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Warning
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/15 text-[var(--danger)]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Critical
          </span>
        );
    }
  };

  return (
    <section 
      className="col-span-12 rounded-[var(--radius-lg)] p-5 transition-colors shadow-sm"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderWidth: '1px'
      }}
    >
      {/* Table Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="text-sm sm:text-base font-semibold text-[var(--text-main)]">
              Server Cluster Instances
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Navigate rows with <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--primary)] font-mono">J</kbd>/<kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--primary)] font-mono">K</kbd>, press <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--primary)] font-mono">Enter</kbd> to inspect, <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--primary)] font-mono">Esc</kbd> to deselect
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
          {selectedRegionFilter && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--primary)]">
              Region: {selectedRegionFilter}
              <button 
                onClick={onClearRegionFilter} 
                className="hover:text-[var(--danger)] ml-1 font-bold cursor-pointer"
                title="Clear region filter"
              >
                ×
              </button>
            </span>
          )}

          <span>
            Showing <strong className="text-[var(--text-main)]">{instances.length}</strong> of {totalCount} instances
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--surface-hover)] text-[var(--primary)] transition-colors cursor-pointer"
              title="Reset all search & status filters"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[11px] uppercase tracking-wider text-[var(--text-muted)] select-none">
              <th 
                onClick={() => onSort('id')}
                className="py-3 px-3 cursor-pointer group hover:text-[var(--text-main)] font-semibold"
              >
                <div className="flex items-center gap-1">
                  <span>Instance ID</span>
                  {getSortIcon('id')}
                </div>
              </th>

              <th 
                onClick={() => onSort('host')}
                className="py-3 px-3 cursor-pointer group hover:text-[var(--text-main)] font-semibold"
              >
                <div className="flex items-center gap-1">
                  <span>Host Node</span>
                  {getSortIcon('host')}
                </div>
              </th>

              <th 
                onClick={() => onSort('region')}
                className="py-3 px-3 cursor-pointer group hover:text-[var(--text-main)] font-semibold"
              >
                <div className="flex items-center gap-1">
                  <span>Region</span>
                  {getSortIcon('region')}
                </div>
              </th>

              <th 
                onClick={() => onSort('status')}
                className="py-3 px-3 cursor-pointer group hover:text-[var(--text-main)] font-semibold"
              >
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>

              <th 
                onClick={() => onSort('load')}
                className="py-3 px-3 cursor-pointer group hover:text-[var(--text-main)] font-semibold"
              >
                <div className="flex items-center gap-1">
                  <span>Load</span>
                  {getSortIcon('load')}
                </div>
              </th>

              <th 
                onClick={() => onSort('uptime')}
                className="py-3 px-3 cursor-pointer group hover:text-[var(--text-main)] font-semibold"
              >
                <div className="flex items-center gap-1">
                  <span>Uptime</span>
                  {getSortIcon('uptime')}
                </div>
              </th>

              <th className="py-3 px-3 text-right font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {instances.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[var(--text-muted)]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <SlidersHorizontal className="w-8 h-8 text-[var(--text-muted)] opacity-40" />
                    <p className="text-sm font-medium">No matching instances found</p>
                    <p className="text-xs">Try adjusting your search query or status filter.</p>
                    <button
                      onClick={onResetFilters}
                      className="mt-2 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium cursor-pointer"
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: '#0f172a'
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              instances.map((row, idx) => {
                const isSelected = selectedRowIndex === idx;

                return (
                  <tr
                    key={row.id}
                    data-row-index={idx}
                    onClick={() => setSelectedRowIndex(idx)}
                    onDoubleClick={() => onInspectInstance(row)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected 
                        ? 'bg-[var(--primary-glow)] ring-1 ring-[var(--primary)]' 
                        : 'hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {/* Instance ID */}
                    <td className="py-3 px-3 font-mono font-semibold text-[var(--text-main)]">
                      <div className="flex items-center gap-1.5">
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                        )}
                        <span>{row.id}</span>
                      </div>
                    </td>

                    {/* Host Node */}
                    <td className="py-3 px-3 text-[var(--text-main)]">
                      <div>
                        <span className="font-mono">{row.host}</span>
                        <span className="block text-[11px] text-[var(--text-muted)]">{row.role}</span>
                      </div>
                    </td>

                    {/* Region */}
                    <td className="py-3 px-3 text-[var(--text-muted)]">
                      {row.region}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {getStatusBadge(row.status)}
                    </td>

                    {/* Load */}
                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center gap-2 max-w-[120px]">
                        <span className="w-8 text-right font-medium tabular-nums">{row.load}%</span>
                        <div 
                          className="flex-1 h-1.5 rounded-full overflow-hidden"
                          style={{ backgroundColor: 'var(--bg)' }}
                        >
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${row.load}%`,
                              backgroundColor: 
                                row.load >= 90 ? 'var(--danger)' :
                                row.load >= 75 ? 'var(--warning)' : 
                                'var(--primary)'
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Uptime */}
                    <td className="py-3 px-3 font-mono text-[var(--text-muted)] tabular-nums">
                      {row.uptime}
                    </td>

                    {/* Inspect button */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRowIndex(idx);
                          onInspectInstance(row);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-main)] hover:bg-[var(--surface-hover)] hover:border-[var(--primary)] transition-all cursor-pointer"
                        title="Inspect Node (Enter)"
                      >
                        <Eye className="w-3.5 h-3.5 text-[var(--primary)]" />
                        <span className="hidden sm:inline">Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
