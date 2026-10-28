import React, { useState } from 'react';
import { ClusterInstance, NodeStatus } from '../types/dashboard';
import { 
  X, 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  RotateCw, 
  Radio, 
  Copy, 
  Check, 
  AlertTriangle,
  Clock,
  Globe
} from 'lucide-react';

interface InstanceInspectionModalProps {
  instance: ClusterInstance | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: NodeStatus) => void;
  onRebootInstance: (id: string) => void;
}

export const InstanceInspectionModal: React.FC<InstanceInspectionModalProps> = ({
  instance,
  onClose,
  onUpdateStatus,
  onRebootInstance
}) => {
  const [copied, setCopied] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);

  if (!instance) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(instance.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReboot = () => {
    setIsRebooting(true);
    setTimeout(() => {
      onRebootInstance(instance.id);
      setIsRebooting(false);
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-[var(--radius-lg)] p-6 shadow-2xl transition-all"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          borderWidth: '1px',
          color: 'var(--text-main)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-[var(--radius-md)] flex items-center justify-center"
              style={{
                backgroundColor: 'var(--primary-glow)',
                color: 'var(--primary)',
                border: '1px solid var(--primary)'
              }}
            >
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-mono tracking-tight">
                  {instance.host}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]">
                  {instance.region}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {instance.role} · IP: <span className="font-mono">{instance.ipAddress}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            title="Close inspection (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Metrics & Specs */}
        <div className="py-4 space-y-4">
          {/* Key ID & Status Strip */}
          <div 
            className="p-3 rounded-[var(--radius-sm)] flex items-center justify-between text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)'
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">Instance ID:</span>
              <span className="font-bold">{instance.id}</span>
              <button 
                onClick={handleCopyId}
                className="hover:text-[var(--primary)] transition-colors cursor-pointer"
                title="Copy ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[var(--success)]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">Status:</span>
              <span 
                className={`px-2 py-0.5 rounded-full font-semibold ${
                  instance.status === 'Healthy' ? 'bg-emerald-500/15 text-[var(--success)]' :
                  instance.status === 'Warning' ? 'bg-amber-500/15 text-[var(--warning)]' :
                  'bg-rose-500/15 text-[var(--danger)]'
                }`}
              >
                {instance.status}
              </span>
            </div>
          </div>

          {/* Real-time Hardware Telemetry */}
          <div className="grid grid-cols-3 gap-3">
            <div 
              className="p-3 rounded-[var(--radius-sm)]"
              style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1">
                <Cpu className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>CPU Load</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums">
                {instance.load}%
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                {instance.cpuCores} vCPUs allocated
              </div>
            </div>

            <div 
              className="p-3 rounded-[var(--radius-sm)]"
              style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                <span>Memory</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums">
                {instance.memoryUsedPercent}%
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                {Math.round((instance.memoryGb * instance.memoryUsedPercent) / 100)}GB of {instance.memoryGb}GB
              </div>
            </div>

            <div 
              className="p-3 rounded-[var(--radius-sm)]"
              style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1">
                <Activity className="w-3.5 h-3.5 text-[var(--success)]" />
                <span>Active Reqs</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums">
                {instance.activeRequests.toLocaleString()}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Uptime: {instance.uptime}
              </div>
            </div>
          </div>

          {/* Operational Log Strip */}
          <div 
            className="p-3 rounded-[var(--radius-sm)] text-xs font-mono space-y-1.5"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>Host Diagnostics</span>
              <span className="text-[10px]">Last Reboot: {instance.lastReboot}</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] border-t border-[var(--border)] pt-2 space-y-1">
              <div>[kernel] cgroup v2 resource limits enforced (memory.high=92%)</div>
              <div>[ingress] TLS 1.3 session cache hit ratio: 98.4%</div>
              <div>[health] HTTP /healthz probe 200 OK (latency: 1.2ms)</div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReboot}
              disabled={isRebooting}
              className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] inline-flex items-center gap-1.5 border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRebooting ? 'animate-spin' : ''}`} />
              <span>{isRebooting ? 'Rebooting...' : 'Reboot Node'}</span>
            </button>

            <button
              onClick={() => onUpdateStatus(
                instance.id, 
                instance.status === 'Healthy' ? 'Warning' : 'Healthy'
              )}
              className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] inline-flex items-center gap-1.5 border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{instance.status === 'Healthy' ? 'Drain Traffic' : 'Resume Traffic'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#0f172a'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
