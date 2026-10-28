import React from 'react';
import { RegionCapacity } from '../types/dashboard';
import { Layers, AlertTriangle } from 'lucide-react';

interface ResourceBreakdownProps {
  capacities: RegionCapacity[];
  selectedRegionFilter: string;
  onSelectRegion: (region: string) => void;
}

export const ResourceBreakdown: React.FC<ResourceBreakdownProps> = ({
  capacities,
  selectedRegionFilter,
  onSelectRegion
}) => {
  return (
    <section 
      className="col-span-12 lg:col-span-4 rounded-[var(--radius-lg)] p-5 flex flex-col justify-between transition-colors shadow-sm"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderWidth: '1px'
      }}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="text-sm sm:text-base font-semibold text-[var(--text-main)]">
              Resource Load
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            4 Regions
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Live capacity utilization per cluster zone. Click to isolate region.
        </p>

        {/* Progress List */}
        <div className="space-y-4">
          {capacities.map((item) => {
            const isWarning = item.utilization >= 80;
            const isMedium = item.utilization >= 60 && item.utilization < 80;
            const isFiltered = selectedRegionFilter === item.region;

            // Fill color
            let fillColor = 'var(--primary)';
            if (isWarning) fillColor = 'var(--warning)';
            if (item.utilization >= 90) fillColor = 'var(--danger)';
            if (item.utilization < 50) fillColor = 'var(--success)';

            return (
              <div 
                key={item.region}
                onClick={() => onSelectRegion(isFiltered ? '' : item.region)}
                className={`p-2 rounded-[var(--radius-sm)] transition-all cursor-pointer ${
                  isFiltered ? 'ring-1 ring-[var(--primary)] bg-[var(--surface-hover)]' : 'hover:bg-[var(--surface-hover)]'
                }`}
                title={`Click to filter table by ${item.region}`}
              >
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-[var(--text-main)]">
                    <span>{item.region}</span>
                    {isWarning && (
                      <AlertTriangle className="w-3 h-3 text-[var(--warning)]" />
                    )}
                    {isFiltered && (
                      <span className="text-[10px] px-1 rounded bg-[var(--primary)] text-slate-900 font-mono">
                        active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[var(--text-muted)] text-[11px]">
                      {item.nodeCount}/{item.maxNodes} nodes
                    </span>
                    <span 
                      className="font-bold text-xs tabular-nums"
                      style={{ color: fillColor }}
                    >
                      {item.utilization}%
                    </span>
                  </div>
                </div>

                {/* Progress track & fill */}
                <div 
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--bg)' }}
                >
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.utilization}%`,
                      backgroundColor: fillColor
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cluster Allocation Summary */}
      <div 
        className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]"
      >
        <span>Global Auto-Scale: <strong className="text-[var(--text-main)]">Active (Elastic)</strong></span>
        <span>Rebalancing: <strong className="text-[var(--success)]">Nominal</strong></span>
      </div>
    </section>
  );
};
