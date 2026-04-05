"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Goal } from "@/types";

interface GoalFormProps {
  type: "main" | "monthly" | "weekly";
  goal?: Goal;
  onClose: () => void;
  onSave: (data: Partial<Goal>) => void;
}

export function GoalForm({ type, goal, onClose, onSave }: GoalFormProps) {
  const [title, setTitle] = useState(goal?.title ?? "");
  const [description, setDescription] = useState(goal?.description ?? "");
  const [targetDate, setTargetDate] = useState(goal?.target_date ?? "");
  const [progress, setProgress] = useState(goal?.progress ?? 0);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description ?? "");
      setTargetDate(goal.target_date ?? "");
      setProgress(goal.progress);
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      target_date: targetDate || undefined,
      progress,
    });
  };

  const placeholderTitles = {
    main: "What is your ultimate goal?",
    monthly: "What do you want to achieve this month?",
    weekly: "What's your focus this week?",
  };

  const submitLabels = {
    main: "Set Goal",
    monthly: "Add Monthly Goal",
    weekly: "Add Weekly Goal",
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-lg mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">
          {goal ? "Edit Goal" : submitLabels[type]}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={placeholderTitles[type]}
              className="bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm w-full focus:outline-none focus:border-indigo-500/50 transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details or your why..."
              className="bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm w-full focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Target Date (Optional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm w-full focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {goal && (
            <div>
              <label className="flex justify-between items-center text-sm font-medium text-gray-300 mb-1">
                <span>Progress</span>
                <span className="text-indigo-400 font-semibold">{progress}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg cursor-pointer w-full transition-colors"
            >
              {goal ? "Save Changes" : submitLabels[type]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
