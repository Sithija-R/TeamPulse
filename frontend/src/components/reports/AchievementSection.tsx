import React, { useState } from 'react';
import { Achievement } from '../../types/report';
import { Trophy, Plus, Trash2, Star } from 'lucide-react';

interface AchievementSectionProps {
  achievements: Achievement[];
  onAddAchievement: (achievement: Achievement) => void;
  onRemoveAchievement: (id: number) => void;
  isEditable?: boolean;
}

export const AchievementSection: React.FC<AchievementSectionProps> = ({
  achievements,
  onAddAchievement,
  onRemoveAchievement,
  isEditable = true,
}) => {
  const [description, setDescription] = useState('');
  const [keyAchievement, setKeyAchievement] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onAddAchievement({
      id: Date.now(),
      description: description.trim(),
      keyAchievement,
    });

    setDescription('');
    setKeyAchievement(false);
    setShowAdd(false);
  };

  return (
    <div className="rounded-xl border border-[#E5E7E5] bg-white p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#E5E7E5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#171A18]" />
            <h3 className="text-base font-bold text-[#171A18]">Achievements & Highlights</h3>
          </div>
          <p className="text-xs text-[#6B726D] mt-0.5">
            Highlight major milestones, optimizations, or team recognitions achieved this week.
          </p>
        </div>
        {isEditable && (
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7E5] bg-[#F7F8F7] px-3 py-1.5 text-xs font-bold text-[#171A18] hover:bg-[#8DF688]/30 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Highlight
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="rounded-xl border border-[#8DF688] bg-[#8DF688]/10 p-4 space-y-3">
          <label className="block text-xs font-semibold text-[#171A18]">
            Achievement / Milestone Description *
          </label>
          <textarea
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the win or breakthrough..."
            className="w-full rounded-lg border border-[#E5E7E5] bg-white p-2.5 text-xs text-[#171A18] focus:border-[#171A18] outline-none"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-medium text-[#171A18] cursor-pointer">
              <input
                type="checkbox"
                checked={keyAchievement}
                onChange={(e) => setKeyAchievement(e.target.checked)}
                className="rounded text-[#171A18]"
              />
              <span className="flex items-center gap-1 font-bold text-[#171A18]">
                <Star className="h-3.5 w-3.5 fill-[#8DF688] text-[#171A18]" />
                Mark as Key Highlight
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
                className="rounded-lg bg-[#171A18] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black cursor-pointer"
              >
                Save Highlight
              </button>
            </div>
          </div>
        </form>
      )}

      {achievements.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#E5E7E5] p-4 text-center text-xs text-[#6B726D]">
          No achievements listed yet.
        </div>
      ) : (
        <div className="space-y-2.5">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`flex items-start justify-between rounded-xl border p-3.5 transition-colors ${
                a.keyAchievement
                  ? 'border-[#8DF688] bg-[#8DF688]/15'
                  : 'border-[#E5E7E5] bg-[#F7F8F7]/50'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Star
                  className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                    a.keyAchievement ? 'fill-[#8DF688] text-[#171A18]' : 'text-[#9AA19C]'
                  }`}
                />
                <div>
                  <p className="text-xs font-medium text-[#171A18]">{a.description}</p>
                  {a.keyAchievement && (
                    <span className="mt-1 inline-block rounded bg-[#8DF688] px-1.5 py-0.5 text-[10px] font-bold text-[#171A18]">
                      KEY ACHIEVEMENT
                    </span>
                  )}
                </div>
              </div>

              {isEditable && (
                <button
                  type="button"
                  onClick={() => onRemoveAchievement(a.id)}
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
