import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', description: 'Focus and select search input' },
    { key: 'J', description: 'Select next row in table' },
    { key: 'K', description: 'Select previous row in table' },
    { key: 'Enter', description: 'Inspect selected cluster node' },
    { key: 'T', description: 'Toggle Light / Dark theme mode' },
    { key: '?', description: 'Toggle this hotkey cheat sheet' },
    { key: 'Esc', description: 'Close modals, deselect row & unfocus' }
  ];

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
            <Keyboard className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold tracking-tight">
              Keyboard Shortcuts
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            title="Close dialog (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[var(--text-muted)] my-3">
          Power-user navigation controls for instant keyboard ops.
        </p>

        <div className="space-y-1 divide-y divide-[var(--border)]">
          {shortcuts.map((item) => (
            <div 
              key={item.key} 
              className="flex items-center justify-between py-2 text-xs"
            >
              <span className="text-[var(--text-main)]">{item.description}</span>
              <kbd 
                className="px-2 py-0.5 text-xs font-mono font-semibold rounded"
                style={{
                  backgroundColor: 'var(--bg)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  color: 'var(--primary)'
                }}
              >
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2 text-xs font-semibold rounded-[var(--radius-sm)] transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--surface-hover)',
            borderColor: 'var(--border)',
            borderWidth: '1px',
            color: 'var(--text-main)'
          }}
        >
          Close (Esc)
        </button>
      </div>
    </div>
  );
};
