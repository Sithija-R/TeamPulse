import { useState, type SubmitEvent } from "react";
import { Award, Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Achievement } from "../../types/report";

interface AchievementSectionProps {
  achievements: Achievement[];
  onAddAchievement: (achievement: Achievement) => void;
  onRemoveAchievement: (id: number) => void;
  isEditable?: boolean;
}

export function AchievementSection({
  achievements,
  onAddAchievement,
  onRemoveAchievement,
  isEditable = true,
}: AchievementSectionProps) {
  const [description, setDescription] = useState("");
  const [keyAchievement, setKeyAchievement] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) return;
  
    onAddAchievement({
      id: Date.now(),
      description: description.trim(),
      keyAchievement,
    });
  
    setDescription("");
    setKeyAchievement(false);
    setShowAdd(false);
  };

  return (
    <div className="space-y-4 rounded-xl border border-[#E5E7E5] bg-white p-5">
      <div className="flex items-center justify-between border-b border-[#E5E7E5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-600" />
            <h3 className="text-base font-bold text-[#171A18]">Achievements & Highlights</h3>
          </div>
          <p className="mt-0.5 text-xs text-[#6B726D]">
            Capture key accomplishments, milestones, and notable contributions.
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
            Add Achievement
          </Button>
        )}
      </div>

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4"
        >
          <Label
            htmlFor="achievement-description"
            className="text-xs font-semibold text-[#171A18]"
          >
            Achievement Description *
          </Label>

          <Textarea
            id="achievement-description"
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the achievement, milestone, or contribution..."
            className="resize-none rounded-lg border-[#E5E7E5] bg-white p-2.5 text-xs text-[#171A18] focus-visible:border-emerald-500 focus-visible:ring-0"
          />

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#171A18]">
              <input
                type="checkbox"
                checked={keyAchievement}
                onChange={(e) => setKeyAchievement(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-[#E5E7E5] text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1 font-bold text-emerald-800">
                <Star className="h-3.5 w-3.5 text-emerald-600" />
                Mark as Key Achievement
              </span>
            </label>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAdd(false);
                  setDescription("");
                  setKeyAchievement(false);
                }}
                className="h-auto rounded-lg border-[#E5E7E5] bg-white px-3 py-1.5 text-xs font-semibold text-[#171A18] hover:bg-[#F7F8F7]"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="h-auto rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Save Achievement
              </Button>
            </div>
          </div>
        </form>
      )}

      {achievements.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#E5E7E5] p-4 text-center text-xs text-[#6B726D]">
          No achievements reported for this period.
        </div>
      ) : (
        <div className="space-y-2.5">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-start justify-between rounded-xl border border-emerald-200 bg-emerald-50/30 p-3.5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                  <Award className="h-4 w-4 text-emerald-600" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-medium text-[#171A18]">
                      {achievement.description}
                    </p>

                    {achievement.keyAchievement && (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        <Star className="h-2.5 w-2.5" />
                        KEY ACHIEVEMENT
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
                  onClick={() => onRemoveAchievement(achievement.id)}
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