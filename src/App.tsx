import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  ClusterInstance, 
  SortField, 
  SortDirection, 
  NodeStatus, 
  ThroughputDay,
  RegionCapacity 
} from './types/dashboard';
import { 
  INITIAL_DATASET, 
  INITIAL_CHART_VALUES, 
  REGIONAL_CAPACITY_DATA 
} from './data/mockData';
import { HeaderToolbar } from './components/HeaderToolbar';
import { KpiCards } from './components/KpiCards';
import { ThroughputChart } from './components/ThroughputChart';
import { ResourceBreakdown } from './components/ResourceBreakdown';
import { DataTable } from './components/DataTable';
import { InstanceInspectionModal } from './components/InstanceInspectionModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { NewInstanceModal } from './components/NewInstanceModal';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pulseops_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  // Data state
  const [dataset, setDataset] = useState<ClusterInstance[]>(INITIAL_DATASET);
  const [chartData, setChartData] = useState<ThroughputDay[]>(INITIAL_CHART_VALUES);
  const [regionalCapacities, setRegionalCapacities] = useState<RegionCapacity[]>(REGIONAL_CAPACITY_DATA);

  // Live KPI values
  const [totalProcessed, setTotalProcessed] = useState(128430);
  const [activeNodes, setActiveNodes] = useState(1024);
  const [avgLatencyMs, setAvgLatencyMs] = useState(28.0);
  const [failureRate, setFailureRate] = useState(0.02);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('');

  // Table selection & sorting
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Modals state
  const [inspectedInstance, setInspectedInstance] = useState<ClusterInstance | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Search input ref for keyboard focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pulseops_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Filter & Sort calculation
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return dataset.filter(row => {
      const matchesQuery = 
        row.id.toLowerCase().includes(query) ||
        row.host.toLowerCase().includes(query) ||
        row.region.toLowerCase().includes(query) ||
        row.role.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'ALL' || row.status === statusFilter;
      const matchesRegion = !selectedRegionFilter || row.region === selectedRegionFilter;

      return matchesQuery && matchesStatus && matchesRegion;
    });
  }, [dataset, searchQuery, statusFilter, selectedRegionFilter]);

  const sortedData = useMemo(() => {
    const data = [...filteredData];
    return data.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'load') {
        comparison = a.load - b.load;
      } else if (sortField === 'uptime') {
        comparison = a.uptime.localeCompare(b.uptime);
      } else {
        comparison = (a[sortField] || '').localeCompare(b[sortField] || '');
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSelectedRegionFilter('');
    setSelectedRowIndex(-1);
  };

  // Keyboard navigation suite
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      const isInputActive = activeTag === 'INPUT' || activeTag === 'SELECT' || activeTag === 'TEXTAREA';

      // Escape key handles dismissals and deselect
      if (e.key === 'Escape') {
        if (isHelpModalOpen) {
          setIsHelpModalOpen(false);
          return;
        }
        if (inspectedInstance) {
          setInspectedInstance(null);
          return;
        }
        if (isAddModalOpen) {
          setIsAddModalOpen(false);
          return;
        }
        if (isInputActive) {
          (document.activeElement as HTMLElement)?.blur();
          return;
        }
        setSelectedRowIndex(-1);
        return;
      }

      // If active inside an input or select, skip letter shortcuts
      if (isInputActive) return;

      // Focus search: '/'
      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      // Help modal: '?'
      if (e.key === '?' || (e.shiftKey && e.key === '?')) {
        e.preventDefault();
        setIsHelpModalOpen(prev => !prev);
        return;
      }

      // Theme toggle: 'T'
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // J: Next row
      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        if (sortedData.length === 0) return;
        setSelectedRowIndex(prev => {
          const next = prev < sortedData.length - 1 ? prev + 1 : prev;
          scrollRowIntoView(next);
          return next;
        });
        return;
      }

      // K: Previous row
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        if (sortedData.length === 0) return;
        setSelectedRowIndex(prev => {
          const next = prev > 0 ? prev - 1 : 0;
          scrollRowIntoView(next);
          return next;
        });
        return;
      }

      // Enter: Inspect selected row
      if (e.key === 'Enter') {
        if (selectedRowIndex >= 0 && selectedRowIndex < sortedData.length) {
          e.preventDefault();
          setInspectedInstance(sortedData[selectedRowIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedData, selectedRowIndex, isHelpModalOpen, inspectedInstance, isAddModalOpen, toggleTheme]);

  const scrollRowIntoView = (index: number) => {
    setTimeout(() => {
      const el = document.querySelector(`[data-row-index="${index}"]`);
      if (el) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 10);
  };

  // Live telemetry interval
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Fluctuate total revenue slightly
      setTotalProcessed(prev => prev + Math.floor(Math.random() * 8) - 3);

      // Latency fluctuation
      setAvgLatencyMs(prev => {
        const delta = (Math.random() * 0.8) - 0.4;
        return Number(Math.max(22.0, Math.min(36.0, prev + delta)).toFixed(1));
      });

      // Failure rate
      setFailureRate(prev => {
        const delta = (Math.random() * 0.004) - 0.002;
        return Number(Math.max(0.01, Math.min(0.08, prev + delta)).toFixed(2));
      });

      // Micro oscillate random instance load
      setDataset(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        const item = prev[idx];
        if (!item) return prev;
        const loadDelta = Math.floor(Math.random() * 7) - 3;
        const newLoad = Math.max(8, Math.min(99, item.load + loadDelta));
        const updated = [...prev];
        updated[idx] = {
          ...item,
          load: newLoad,
          memoryUsedPercent: Math.max(15, Math.min(98, item.memoryUsedPercent + (loadDelta > 0 ? 1 : -1))),
          activeRequests: Math.max(100, item.activeRequests + (loadDelta * 15))
        };
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Node management actions
  const handleUpdateStatus = (id: string, newStatus: NodeStatus) => {
    setDataset(prev => prev.map(inst => inst.id === id ? { ...inst, status: newStatus } : inst));
    if (inspectedInstance && inspectedInstance.id === id) {
      setInspectedInstance(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleRebootInstance = (id: string) => {
    setDataset(prev => prev.map(inst => {
      if (inst.id === id) {
        return {
          ...inst,
          load: 14,
          memoryUsedPercent: 22,
          activeRequests: 80,
          status: 'Healthy',
          uptime: '1m',
          lastReboot: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
        };
      }
      return inst;
    }));
    if (inspectedInstance && inspectedInstance.id === id) {
      setInspectedInstance(prev => prev ? {
        ...prev,
        load: 14,
        memoryUsedPercent: 22,
        activeRequests: 80,
        status: 'Healthy',
        uptime: '1m',
        lastReboot: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
      } : null);
    }
  };

  const handleAddInstance = (newInstance: ClusterInstance) => {
    setDataset(prev => [newInstance, ...prev]);
    setActiveNodes(prev => prev + 1);
  };

  // CSV export
  const handleExportCsv = () => {
    const headers = ['Instance ID', 'Host', 'Region', 'Status', 'Load (%)', 'Uptime', 'IP Address', 'Role'];
    const rows = sortedData.map(inst => [
      inst.id,
      inst.host,
      inst.region,
      inst.status,
      inst.load,
      inst.uptime,
      inst.ipAddress,
      `"${inst.role}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pulseops_cluster_instances_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFiltered = Boolean(searchQuery || statusFilter !== 'ALL' || selectedRegionFilter);

  return (
    <div className="min-h-screen py-5 px-3 sm:px-6 lg:px-8">
      {/* 12-Column Responsive Grid Layout matching wireframe spec */}
      <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-5">
        
        {/* 1. Header Toolbar */}
        <HeaderToolbar
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            setSelectedRowIndex(-1);
          }}
          statusFilter={statusFilter}
          setStatusFilter={(s) => {
            setStatusFilter(s);
            setSelectedRowIndex(-1);
          }}
          theme={theme}
          toggleTheme={toggleTheme}
          openHelpModal={() => setIsHelpModalOpen(true)}
          searchInputRef={searchInputRef}
          isLiveStreaming={isLiveStreaming}
          setIsLiveStreaming={setIsLiveStreaming}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onExportCsv={handleExportCsv}
        />

        {/* 2. KPI / Stat Cards (4 columns) */}
        <KpiCards
          totalProcessed={totalProcessed}
          activeNodes={activeNodes}
          avgLatencyMs={avgLatencyMs}
          failureRate={failureRate}
        />

        {/* 3. Main Chart / Timeline (8 cols) */}
        <ThroughputChart data={chartData} />

        {/* 4. Distribution / Mini Breakdown (4 cols) */}
        <ResourceBreakdown
          capacities={regionalCapacities}
          selectedRegionFilter={selectedRegionFilter}
          onSelectRegion={(r) => {
            setSelectedRegionFilter(r);
            setSelectedRowIndex(-1);
          }}
        />

        {/* 5. Live Data Stream & Management Table (Full Width 12 cols) */}
        <DataTable
          instances={sortedData}
          totalCount={dataset.length}
          selectedRowIndex={selectedRowIndex}
          setSelectedRowIndex={setSelectedRowIndex}
          onInspectInstance={(inst) => setInspectedInstance(inst)}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
          selectedRegionFilter={selectedRegionFilter}
          onClearRegionFilter={() => setSelectedRegionFilter('')}
        />

      </main>

      {/* Modals & Slide-overs */}
      <InstanceInspectionModal
        instance={inspectedInstance}
        onClose={() => setInspectedInstance(null)}
        onUpdateStatus={handleUpdateStatus}
        onRebootInstance={handleRebootInstance}
      />

      <ShortcutsModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <NewInstanceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddInstance={handleAddInstance}
      />
    </div>
  );
}
