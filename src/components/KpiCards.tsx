import React from 'react';
import { TrendingUp, TrendingDown, Server, Cpu, ShieldCheck, DollarSign } from 'lucide-react';

interface KpiCardsProps {
  totalProcessed: number;
  activeNodes: number;
  avgLatencyMs: number;
  failureRate: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  totalProcessed,
  activeNodes,
  avgLatencyMs,
  failureRate
}) => {
  return (
    <>
      {/* KPI Card 1: Total Processed / Revenue */}
      <article 
        className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-[var(--radius-lg)] p-5 flex flex-col justify-between transition-colors shadow-sm"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)]">
            Total Processed
          </span>
          <div className="p-1.5 rounded-[var(--radius-sm)] bg-sky-500/10 text-sky-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-[var(--text-main)] tabular-nums">
            ${totalProcessed.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="text-xs font-medium text-[var(--success)] inline-flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>▲ 12.4% vs last week</span>
        </div>
      </article>

      {/* KPI Card 2: Active Nodes / Sessions */}
      <article 
        className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-[var(--radius-lg)] p-5 flex flex-col justify-between transition-colors shadow-sm"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)]">
            Active Nodes
          </span>
          <div className="p-1.5 rounded-[var(--radius-sm)] bg-emerald-500/10 text-emerald-400">
            <Server className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-[var(--text-main)] tabular-nums">
            {activeNodes.toLocaleString()}
          </div>
        </div>
        <div className="text-xs font-medium text-[var(--success)] inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>▲ 99.8% uptime</span>
        </div>
      </article>

      {/* KPI Card 3: Avg Latency */}
      <article 
        className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-[var(--radius-lg)] p-5 flex flex-col justify-between transition-colors shadow-sm"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)]">
            Avg Latency
          </span>
          <div className="p-1.5 rounded-[var(--radius-sm)] bg-amber-500/10 text-amber-400">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-[var(--text-main)] tabular-nums">
            {avgLatencyMs.toFixed(1)} ms
          </div>
        </div>
        <div className="text-xs font-medium text-[var(--danger)] inline-flex items-center gap-1">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>▼ 3.1 ms slower</span>
        </div>
      </article>

      {/* KPI Card 4: Failure Rate */}
      <article 
        className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-[var(--radius-lg)] p-5 flex flex-col justify-between transition-colors shadow-sm"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)]">
            Failure Rate
          </span>
          <div className="p-1.5 rounded-[var(--radius-sm)] bg-cyan-500/10 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-[var(--text-main)] tabular-nums">
            {failureRate.toFixed(2)}%
          </div>
        </div>
        <div className="text-xs font-medium text-[var(--success)] inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>▲ 0.05% nominal</span>
        </div>
      </article>
    </>
  );
};
