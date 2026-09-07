import React, { useState } from 'react';
import { Blocker } from '../../types/report';
import { AlertTriangle, Plus, Trash2, CheckCircle2, AlertOctagon } from 'lucide-react';

interface BlockerSectionProps {
  blockers: Blocker[];
  onAddBlocker: (blocker: Blocker) => void;
  onRemoveBlocker: (id: number) => void;
  onToggleResolved?: (id: number) => void;
  isEditable?: boolean;
}

export const BlockerSection: React.FC<BlockerSectionProps> = ({
  blockers,
  onAddBlocker,
  onRemoveBlocker,
  onToggleResolved,
  isEditable = true,
}) => {
  const [description, setDescription] = useState('');
  const [keyIssue, setKeyIssue] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onAddBlocker({
      id: Date.now(),
      description: description.trim(),
      keyIssue,
      resolved: false,
    });

    setDescription('');
    setKeyIssue(false);
    setShowAdd(false);
  };

  return (
    <div className="rounded-xl border border-[#E5E7E5] bg-white p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#E5E7E5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="text-base font-bold text-[#171A18]">Blockers & Challenges</h3>
          </div>
          <p className="text-xs text-[#6B726D] mt-0.5">
            Identify impediments requiring management intervention or cross-team support.
          </p>
        </div>
        {isEditable && (
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs font-bold text-[#171A18] hover:bg-[#8DF688]/30 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Blocker
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
          <label className="block text-xs font-semibold text-[#171A18]">
            Blocker / Issue Description *
          </label>
          <textarea
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the blocker, dependencies, or bottleneck..."
            className="w-full rounded-lg border border-[#E5E7E5] bg-white p-2.5 text-xs text-[#171A18] focus:border-amber-500 outline-none"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-medium text-[#171A18] cursor-pointer">
              <input
                type="checkbox"
                checked={keyIssue}
                onChange={(e) => setKeyIssue(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1 font-bold text-amber-800">
                <AlertOctagon className="h-3.5 w-3.5 text-rose-600" />
                Flag as Key Issue (Requires Urgent Escalation)
              </span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-lg border border-[#E5E7E5] bg-white px-3 py-1.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 cursor-pointer"
              >
                Save Blocker
              </button>
            </div>
          </div>
        </form>
      )}

      {blockers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#E5E7E5] p-4 text-center text-xs text-[#6B726D]">
          No blockers reported for this period. Great job keeping the workflow clear!
        </div>
      ) : (
        <div className="space-y-2.5">
          {blockers.map((b) => (
            <div
              key={b.id}
              className={`flex items-start justify-between rounded-xl border p-3.5 transition-colors ${
                b.resolved
                  ? 'border-[#E5E7E5] bg-[#F7F8F7]/60 text-[#6B726D]'
                  : b.keyIssue
                  ? 'border-rose-300 bg-rose-50/50'
                  : 'border-amber-200 bg-amber-50/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  disabled={!isEditable && !onToggleResolved}
                  onClick={() => onToggleResolved && onToggleResolved(b.id)}
                  className="mt-0.5 text-xs cursor-pointer"
                >
                  {b.resolved ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-amber-600 hover:border-emerald-600" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-medium ${b.resolved ? 'line-through text-[#6B726D]' : 'text-[#171A18]'}`}>
                      {b.description}
                    </p>
                    {b.keyIssue && (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                        KEY ISSUE
                      </span>
                    )}
                    {b.resolved && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                        RESOLVED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isEditable && (
                <button
                  type="button"
                  onClick={() => onRemoveBlocker(b.id)}
                  className="text-[#6B726D] hover:text-rose-600 cursor-pointer ml-2"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
