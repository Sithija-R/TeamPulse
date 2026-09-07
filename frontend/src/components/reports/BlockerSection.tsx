import { useState, type SubmitEvent } from "react";
import { AlertTriangle, Plus, Trash2, CheckCircle2, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Blocker } from "../../types/report";

interface BlockerSectionProps {
  blockers: Blocker[];
  onAddBlocker: (blocker: Blocker) => void;
  onRemoveBlocker: (id: number) => void;
  onToggleResolved?: (id: number) => void;
  isEditable?: boolean;
}

export function BlockerSection({
  blockers,
  onAddBlocker,
  onRemoveBlocker,
  onToggleResolved,
  isEditable = true,
}: BlockerSectionProps) {
  const [description, setDescription] = useState("");
  const [keyIssue, setKeyIssue] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) return;

    onAddBlocker({
      id: Date.now(),
      description: description.trim(),
      keyIssue,
      resolved: false,
    });

    setDescription("");
    setKeyIssue(false);
    setShowAdd(false);
  };

  return (
    <div className="space-y-4 rounded-xl border border-[#E5E7E5] bg-white p-5">
      <div className="flex items-center justify-between border-b border-[#E5E7E5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="text-base font-bold text-[#171A18]">Blockers & Challenges</h3>
          </div>
          <p className="mt-0.5 text-xs text-[#6B726D]">
            Identify impediments requiring management intervention or cross-team support.
          </p>
        </div>

        {isEditable && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdd((value) => !value)}
            className="h-auto gap-1.5 rounded-lg border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs font-bold text-[#171A18] transition-colors hover:bg-[#E8FCE8]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Blocker
          </Button>
        )}
      </div>

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/40 p-4"
        >
          <Label
            htmlFor="blocker-description"
            className="text-xs font-semibold text-[#171A18]"
          >
            Blocker / Issue Description *
          </Label>

          <Textarea
            id="blocker-description"
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the blocker, dependencies, or bottleneck..."
            className="resize-none rounded-lg border-[#E5E7E5] bg-white p-2.5 text-xs text-[#171A18] focus-visible:border-amber-500 focus-visible:ring-0"
          />

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#171A18]">
              <input
                type="checkbox"
                checked={keyIssue}
                onChange={(e) => setKeyIssue(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-[#E5E7E5] text-amber-600 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1 font-bold text-amber-800">
                <AlertOctagon className="h-3.5 w-3.5 text-rose-600" />
                Flag as Key Issue (Requires Urgent Escalation)
              </span>
            </label>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAdd(false);
                  setDescription("");
                  setKeyIssue(false);
                }}
                className="h-auto rounded-lg border-[#E5E7E5] bg-white px-3 py-1.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="h-auto rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
              >
                Save Blocker
              </Button>
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
          {blockers.map((blocker) => (
            <div
              key={blocker.id}
              className={`flex items-start justify-between rounded-xl border p-3.5 transition-colors ${
                blocker.resolved
                  ? "border-[#E5E7E5] bg-[#F7F8F7]/60 text-[#6B726D]"
                  : blocker.keyIssue
                    ? "border-rose-300 bg-rose-50/50"
                    : "border-amber-200 bg-amber-50/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={!isEditable || !onToggleResolved}
                  onClick={() => onToggleResolved?.(blocker.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded-full p-0 hover:bg-transparent"
                >
                  {blocker.resolved ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border-2 border-amber-600 transition-colors hover:border-emerald-600" />
                  )}
                </Button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={`text-xs font-medium ${
                        blocker.resolved
                          ? "text-[#6B726D] line-through"
                          : "text-[#171A18]"
                      }`}
                    >
                      {blocker.description}
                    </p>

                    {blocker.keyIssue && (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                        KEY ISSUE
                      </span>
                    )}

                    {blocker.resolved && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                        RESOLVED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isEditable && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveBlocker(blocker.id)}
                  className="ml-2 h-7 w-7 shrink-0 text-[#6B726D] hover:bg-transparent hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}