import React, { useState } from 'react';
import { ThroughputDay } from '../types/dashboard';
import { BarChart2, Info, ArrowUpRight } from 'lucide-react';

interface ThroughputChartProps {
  data: ThroughputDay[];
}

export const ThroughputChart: React.FC<ThroughputChartProps> = ({ data }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(4); // default Fri
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  const activeIndex = hoveredDayIndex !== null ? hoveredDayIndex : selectedDayIndex;
  const activeDay = activeIndex !== null ? data[activeIndex] : data[data.length - 1];

  const maxVal = Math.max(...data.map(d => d.val), 100);
  const totalVolume = data.reduce((acc, curr) => acc + curr.val, 0);
  const avgVolume = Math.round(totalVolume / data.length);

  return (
    <section 
      className="col-span-12 lg:col-span-8 rounded-[var(--radius-lg)] p-5 flex flex-col justify-between transition-colors shadow-sm"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderWidth: '1px'
      }}
    >
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="text-sm sm:text-base font-semibold text-[var(--text-main)]">
              Throughput Trends
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            Last 7 Days (Requests/sec telemetry)
          </span>
        </div>

        {/* Aggregate mini-stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-[var(--text-muted)]">Total: </span>
            <span className="font-semibold text-[var(--text-main)]">{totalVolume}k req</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)]">Avg/Day: </span>
            <span className="font-semibold text-[var(--primary)]">{avgVolume}k req</span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Grid */}
      <div className="pt-4 pb-2">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-[190px] px-2 border-b border-[var(--border)]">
          {data.map((item, idx) => {
            const heightPercent = Math.min(100, Math.max(12, Math.round((item.val / maxVal) * 100)));
            const isSelected = selectedDayIndex === idx;
            const isHovered = hoveredDayIndex === idx;

            return (
              <div 
                key={item.day}
                className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onClick={() => setSelectedDayIndex(idx)}
                onMouseEnter={() => setHoveredDayIndex(idx)}
                onMouseLeave={() => setHoveredDayIndex(null)}
              >
                {/* Tooltip on hover or select */}
                {(isHovered || isSelected) && (
                  <div 
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[11px] font-mono font-bold whitespace-nowrap shadow-md z-10 pointer-events-none transition-all"
                    style={{
                      backgroundColor: 'var(--text-main)',
                      color: 'var(--bg)'
                    }}
                  >
                    {item.val}k req
                    <div 
                      className="w-2 h-2 rotate-45 mx-auto -mb-1"
                      style={{ backgroundColor: 'var(--text-main)' }}
                    />
                  </div>
                )}

                {/* The Bar */}
                <div 
                  className="w-full max-w-[42px] rounded-t-[var(--radius-sm)] transition-all duration-300 relative overflow-hidden"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: isSelected || isHovered ? 'var(--primary)' : 'var(--primary-glow)',
                    border: `1px solid var(--primary)`,
                    borderBottom: 'none',
                    boxShadow: isSelected ? '0 0 12px var(--primary-glow)' : 'none'
                  }}
                >
                  {/* Subtle highlight gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-60" />
                </div>

                {/* Day label */}
                <div className="mt-2 text-center">
                  <span 
                    className={`text-xs block font-medium transition-colors ${
                      isSelected ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Strip */}
      {activeDay && (
        <div 
          className="mt-4 p-3 rounded-[var(--radius-sm)] flex flex-wrap items-center justify-between gap-3 text-xs"
          style={{
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text-main)]">
              {activeDay.day} ({activeDay.fullDate})
            </span>
            <span className="text-[var(--text-muted)]">· Ingress Invariants Nominal</span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <div>
              <span className="text-[var(--text-muted)]">Peak RPS: </span>
              <span className="font-semibold text-[var(--text-main)]">{activeDay.peakRps.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Error Rate: </span>
              <span className={`font-semibold ${activeDay.errorCount > 25 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
                {activeDay.errorCount} reqs (0.0{Math.floor(activeDay.errorCount / 5)}%)
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
