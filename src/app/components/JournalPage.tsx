import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Save, Calendar, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface JournalEntry {
  date: string;
  content: string;
  wentRight: string;
  friction: string;
}

export function JournalPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const todayDisplay = format(new Date(), "EEEE, MMMM d, yyyy");

  const [entries, setEntries] = useState<Record<string, JournalEntry>>({
    [today]: {
      date: today,
      content: "",
      wentRight: "",
      friction: "",
    },
  });

  const [currentDate, setCurrentDate] = useState(today);
  const currentEntry = entries[currentDate] || {
    date: currentDate,
    content: "",
    wentRight: "",
    friction: "",
  };

  const updateEntry = (field: keyof JournalEntry, value: string) => {
    setEntries((prev) => ({
      ...prev,
      [currentDate]: {
        ...prev[currentDate],
        [field]: value,
      },
    }));
  };

  const saveEntry = () => {
    // In a real app, this would save to a backend
    console.log("Entry saved:", currentEntry);
    // Show a toast notification
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl">Daily Journal</h1>
            <p className="text-sm text-gray-400 mt-1">Reflect on your day and growth</p>
          </div>
        </div>

        <button
          onClick={saveEntry}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 text-indigo-400 transition-all duration-200 hover:scale-105"
        >
          <Save className="w-4 h-4" />
          Save Entry
        </button>
      </motion.div>

      {/* Date Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-gray-300">{todayDisplay}</span>
        </div>
      </motion.div>

      {/* Main Journal Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl">Today's Reflection</h2>
          </div>
          
          <textarea
            value={currentEntry.content}
            onChange={(e) => updateEntry("content", e.target.value)}
            placeholder="What's on your mind? Reflect on your day, your thoughts, your wins, and your challenges..."
            className="w-full h-64 bg-transparent border-none outline-none resize-none text-gray-100 placeholder:text-gray-600 leading-relaxed"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          />
        </div>
      </motion.div>

      {/* Structured Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 p-6"
        >
          <h3 className="text-lg mb-4 text-green-400">✓ What went right today?</h3>
          <textarea
            value={currentEntry.wentRight}
            onChange={(e) => updateEntry("wentRight", e.target.value)}
            placeholder="Celebrate your wins, no matter how small..."
            className="w-full h-32 bg-white/5 rounded-xl px-4 py-3 border border-white/10 outline-none resize-none text-gray-100 placeholder:text-gray-600 focus:border-green-500/50 transition-colors"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/20 p-6"
        >
          <h3 className="text-lg mb-4 text-orange-400">⚠ Where was the friction?</h3>
          <textarea
            value={currentEntry.friction}
            onChange={(e) => updateEntry("friction", e.target.value)}
            placeholder="Identify obstacles and areas for improvement..."
            className="w-full h-32 bg-white/5 rounded-xl px-4 py-3 border border-white/10 outline-none resize-none text-gray-100 placeholder:text-gray-600 focus:border-orange-500/50 transition-colors"
          />
        </motion.div>
      </div>

      {/* Journal Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
      >
        <h3 className="text-lg mb-4">💭 Journal Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "What made me feel energized today?",
            "What drained my energy?",
            "Did I act according to my values?",
            "What would I do differently tomorrow?",
            "Who or what am I grateful for?",
            "What did I learn today?",
          ].map((prompt, index) => (
            <button
              key={index}
              className="text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 text-sm text-gray-300 transition-all duration-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
