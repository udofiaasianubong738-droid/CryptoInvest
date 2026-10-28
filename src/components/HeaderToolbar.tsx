import React, { RefObject } from 'react';
import { 
  Sun, 
  Moon, 
  Search, 
  HelpCircle, 
  Radio, 
  Plus, 
  Download,
  Activity
} from 'lucide-react';
import { NodeStatus } from '../types/dashboard';

interface HeaderToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  openHelpModal: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  isLiveStreaming: boolean;
  setIsLiveStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenAddModal: () => void;
  onExportCsv: () => void;
}

export const HeaderToolbar: React.FC<HeaderToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  theme,
  toggleTheme,
  openHelpModal,
  searchInputRef,
  isLiveStreaming,
  setIsLiveStreaming,
  onOpenAddModal,
  onExportCsv
}) => {
  return (
    <header className="col-span-12 rounded-[var(--radius-lg)] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderWidth: '1px'
      }}
    >
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center font-bold text-sm tracking-wider"
          style={{
            background: 'var(--primary)',
            color: '#0f172a'
          }}
        >
          <Activity className="w-5 h-5 text-slate-900" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg tracking-tight text-[var(--text-main)]">
              PulseOps Engine
            </h1>
            <span 
              className="text-[11px] font-mono px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--primary)',
                border: '1px solid var(--border)'
              }}
            >
              v2.4
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] hidden sm:block">
            Cluster Telemetry & Operational Ingress
          </p>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Search Input with / shortcut hint */}
        <div className="relative flex items-center min-w-[200px] sm:w-[240px]">
          <Search className="absolute left-2.5 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            autoComplete="off"
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-[var(--radius-sm)] outline-none transition-all placeholder:text-[var(--text-muted)]"
            style={{
              backgroundColor: 'var(--bg)',
              color: 'var(--text-main)',
              border: '1px solid var(--border)',
            }}
          />
          <kbd 
            className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono rounded pointer-events-none"
            style={{
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)'
            }}
            title="Press '/' to focus search"
          >
            /
          </kbd>
        </div>

        {/* Status Filter Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs sm:text-sm rounded-[var(--radius-sm)] outline-none cursor-pointer transition-colors"
          style={{
            backgroundColor: 'var(--bg)',
            color: 'var(--text-main)',
            border: '1px solid var(--border)'
          }}
          aria-label="Filter instances by status"
        >
          <option value="ALL">All Statuses</option>
          <option value="Healthy">Healthy</option>
          <option value="Warning">Warning</option>
          <option value="Critical">Critical</option>
        </select>

        {/* Live Stream Telemetry Toggle */}
        <button
          onClick={() => setIsLiveStreaming(!isLiveStreaming)}
          className="px-2.5 py-1.5 text-xs sm:text-sm rounded-[var(--radius-sm)] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          style={{
            backgroundColor: isLiveStreaming ? 'var(--primary-glow)' : 'var(--bg)',
            color: isLiveStreaming ? 'var(--primary)' : 'var(--text-muted)',
            border: `1px solid ${isLiveStreaming ? 'var(--primary)' : 'var(--border)'}`
          }}
          title="Toggle live telemetry updates"
        >
          <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-pulse' : ''}`} />
          <span className="hidden lg:inline">{isLiveStreaming ? 'Live Sync' : 'Paused'}</span>
        </button>

        {/* Export CSV */}
        <button
          onClick={onExportCsv}
          className="px-2.5 py-1.5 text-xs sm:text-sm rounded-[var(--radius-sm)] inline-flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-[var(--surface-hover)]"
          style={{
            backgroundColor: 'var(--bg)',
            color: 'var(--text-main)',
            border: '1px solid var(--border)'
          }}
          title="Export current table view to CSV"
        >
          <Download className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="hidden xl:inline">Export</span>
        </button>

        {/* Add Node Button */}
        <button
          onClick={onOpenAddModal}
          className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-[var(--radius-sm)] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--primary)',
            color: '#0f172a'
          }}
          title="Register new cluster instance"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Node</span>
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm rounded-[var(--radius-sm)] inline-flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-[var(--surface-hover)]"
          style={{
            backgroundColor: 'var(--bg)',
            color: 'var(--text-main)',
            border: '1px solid var(--border)'
          }}
          title="Toggle Theme (T)"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-amber-500" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
          <span className="hidden sm:inline text-xs text-[var(--text-muted)] font-mono">T</span>
        </button>

        {/* Help Hotkey Button */}
        <button
          onClick={openHelpModal}
          className="p-2 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm rounded-[var(--radius-sm)] inline-flex items-center gap-1 transition-colors cursor-pointer hover:bg-[var(--surface-hover)]"
          style={{
            backgroundColor: 'var(--bg)',
            color: 'var(--text-main)',
            border: '1px solid var(--border)'
          }}
          title="Keyboard shortcuts guide (?)"
          aria-label="View keyboard shortcuts"
        >
          <HelpCircle className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="hidden sm:inline text-xs text-[var(--text-muted)] font-mono">?</span>
        </button>
      </div>
    </header>
  );
};
