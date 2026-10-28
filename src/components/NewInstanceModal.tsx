import React, { useState } from 'react';
import { ClusterInstance, NodeStatus } from '../types/dashboard';
import { X, Plus, Server } from 'lucide-react';

interface NewInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInstance: (instance: ClusterInstance) => void;
}

export const NewInstanceModal: React.FC<NewInstanceModalProps> = ({
  isOpen,
  onClose,
  onAddInstance
}) => {
  const [host, setHost] = useState('');
  const [region, setRegion] = useState('US-East');
  const [role, setRole] = useState('Application Worker');
  const [cpuCores, setCpuCores] = useState(16);
  const [memoryGb, setMemoryGb] = useState(64);
  const [status, setStatus] = useState<NodeStatus>('Healthy');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    const newId = `i-${randomHex}`;

    const newInst: ClusterInstance = {
      id: newId,
      host: host.trim() || `node-${randomHex.slice(0, 4)}`,
      region,
      status,
      load: Math.floor(Math.random() * 25) + 10,
      uptime: '1h',
      ipAddress: `10.${Math.floor(Math.random() * 100) + 100}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 200) + 1}`,
      cpuCores,
      memoryGb,
      memoryUsedPercent: Math.floor(Math.random() * 30) + 15,
      activeRequests: Math.floor(Math.random() * 500) + 50,
      lastReboot: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      role
    };

    onAddInstance(newInst);
    onClose();
    setHost('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-[var(--radius-lg)] p-6 shadow-2xl transition-all"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          borderWidth: '1px',
          color: 'var(--text-main)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold tracking-tight">
              Provision Cluster Instance
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Host Name
            </label>
            <input
              type="text"
              required
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="e.g. ingress-gw-02"
              className="w-full px-3 py-2 text-xs rounded-[var(--radius-sm)] outline-none font-mono"
              style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)'
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-[var(--radius-sm)] outline-none"
                style={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)'
                }}
              >
                <option value="US-East">US-East</option>
                <option value="EU-Central">EU-Central</option>
                <option value="AP-South">AP-South</option>
                <option value="US-West">US-West</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NodeStatus)}
                className="w-full px-3 py-2 text-xs rounded-[var(--radius-sm)] outline-none"
                style={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)'
                }}
              >
                <option value="Healthy">Healthy</option>
                <option value="Warning">Warning</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Core API Worker"
              className="w-full px-3 py-2 text-xs rounded-[var(--radius-sm)] outline-none"
              style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)'
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                vCPUs
              </label>
              <select
                value={cpuCores}
                onChange={(e) => setCpuCores(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-[var(--radius-sm)] outline-none font-mono"
                style={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)'
                }}
              >
                <option value={8}>8 vCPUs</option>
                <option value={16}>16 vCPUs</option>
                <option value={32}>32 vCPUs</option>
                <option value={64}>64 vCPUs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                RAM
              </label>
              <select
                value={memoryGb}
                onChange={(e) => setMemoryGb(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-[var(--radius-sm)] outline-none font-mono"
                style={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)'
                }}
              >
                <option value={32}>32 GB</option>
                <option value={64}>64 GB</option>
                <option value={128}>128 GB</option>
                <option value={256}>256 GB</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] inline-flex items-center gap-1.5 cursor-pointer"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#0f172a'
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Provision Node</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
