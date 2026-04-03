import { useState, useMemo } from "react";
import { Check, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  format, 
  getDaysInMonth, 
  startOfMonth,
  addMonths,
  subMonths,
  getDate
} from "date-fns";

const INITIAL_HABITS = [
  { id: "1", name: "Wake up at 5", goal: 28 },
  { id: "2", name: "Mantra", goal: 28 },
  { id: "3", name: "Meditation", goal: 28 },
  { id: "4", name: "Exercise", goal: 25 },
  { id: "5", name: "Read 10 Pages", goal: 28 },
  { id: "6", name: "Deep Focus Block", goal: 20 },
  { id: "7", name: "No Junk Food", goal: 28 },
  { id: "8", name: "Journaling", goal: 28 },
  { id: "9", name: "Plan Day", goal: 28 },
  { id: "10", name: "Study", goal: 28 },
];

interface HabitData {
  [habitId: string]: {
    [day: number]: boolean;
  };
}

export function HabitsDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = getDaysInMonth(currentDate);
  const currentDay = new Date().getMonth() === currentDate.getMonth() ? getDate(new Date()) : daysInMonth;

  // Generate mock data for the current month
  const [habitData, setHabitData] = useState<HabitData>(() => {
    const data: HabitData = {};
    INITIAL_HABITS.forEach((habit) => {
      data[habit.id] = {};
      for (let i = 1; i <= currentDay; i++) {
        // Randomly check off days, higher probability for some
        data[habit.id][i] = Math.random() > 0.4;
      }
    });
    return data;
  });

  const toggleHabit = (habitId: string, day: number) => {
    setHabitData((prev) => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        [day]: !prev[habitId]?.[day],
      },
    }));
  };

  const resetCheckboxes = () => {
    setHabitData(() => {
      const data: HabitData = {};
      INITIAL_HABITS.forEach((habit) => {
        data[habit.id] = {};
      });
      return data;
    });
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Calculations for charts and table
  const stats = useMemo(() => {
    const totalPossible = INITIAL_HABITS.reduce((acc, h) => acc + h.goal, 0);
    let totalCompleted = 0;
    
    const habitsWithStats = INITIAL_HABITS.map(habit => {
      const completed = Object.values(habitData[habit.id] || {}).filter(Boolean).length;
      totalCompleted += completed;
      return {
        ...habit,
        completed,
        left: habit.goal - completed,
        percentage: (completed / habit.goal) * 100
      };
    });

    const topHabits = [...habitsWithStats]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);

    // Weekly stats for bar chart
    const weeks = [
      { name: "Week 1", start: 1, end: 7 },
      { name: "Week 2", start: 8, end: 14 },
      { name: "Week 3", start: 15, end: 21 },
      { name: "Week 4", start: 22, end: 28 },
      { name: "Week 5", start: 29, end: daysInMonth },
    ];

    const weeklyData = weeks.map(week => {
      let completedInWeek = 0;
      let possibleInWeek = 0;
      
      INITIAL_HABITS.forEach(habit => {
        for(let d = week.start; d <= Math.min(week.end, daysInMonth); d++) {
          possibleInWeek++;
          if (habitData[habit.id]?.[d]) {
            completedInWeek++;
          }
        }
      });

      return {
        name: week.name,
        completed: completedInWeek,
        goal: possibleInWeek,
        left: possibleInWeek - completedInWeek
      };
    });

    const dailyProgress = [
      { name: "Completed", value: totalCompleted },
      { name: "Left", value: Math.max(0, totalPossible - totalCompleted) }
    ];

    return { habitsWithStats, topHabits, weeklyData, dailyProgress };
  }, [habitData, daysInMonth]);

  const PIE_COLORS = ["#22c55e", "#f1f5f9"]; // Green for completed, light for left
  const PIE_COLORS_DARK = ["#22c55e", "#27272a"]; // Green, dark gray

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* Header Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/10 p-4 rounded-xl shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-lg font-semibold tracking-wide flex flex-col items-center border border-neutral-200 dark:border-neutral-800">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Habit Tracker</span>
            <span className="text-sm dark:text-white">{format(currentDate, "MMMM yyyy")}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700">
            <ChevronLeft className="w-5 h-5 dark:text-neutral-300" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700">
            <ChevronRight className="w-5 h-5 dark:text-neutral-300" />
          </button>
        </div>
      </div>

      {/* Top Dashboards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Weekly Progress Graph */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/10 rounded-xl p-6 shadow-sm flex flex-col transition-colors duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 uppercase text-sm tracking-wider">Weekly Progress Graph</h3>
          </div>
          <div className="h-[250px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-neutral-500 dark:text-neutral-400"
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-neutral-500 dark:text-neutral-400"
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                  itemStyle={{ color: '#171717' }}
                  wrapperClassName="dark:!bg-neutral-800 dark:!text-neutral-100"
                />
                <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="left" name="Left" fill="#f87171" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Overview & Top Habits */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/10 rounded-xl p-6 shadow-sm transition-colors duration-300"
          >
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-center uppercase text-sm tracking-wider mb-2">Overview Daily Progress</h3>
            <div className="h-[140px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.dailyProgress}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.dailyProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? PIE_COLORS[0] : 'var(--pie-bg)'} className="fill-neutral-100 dark:fill-neutral-800" style={{ fill: index === 0 ? PIE_COLORS[0] : undefined }} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold dark:text-white">
                  {Math.round((stats.dailyProgress[0].value / (stats.dailyProgress[0].value + stats.dailyProgress[1].value)) * 100 || 0)}%
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div><span className="text-neutral-600 dark:text-neutral-400">Completed</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700"></div><span className="text-neutral-600 dark:text-neutral-400">Left</span></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/10 rounded-xl p-6 shadow-sm flex-1 transition-colors duration-300"
          >
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-center uppercase text-sm tracking-wider mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">Top 10 Daily Habits</h3>
            <div className="space-y-3">
              {stats.topHabits.slice(0, 10).map((habit, idx) => (
                <div key={habit.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400 dark:text-neutral-500 font-mono w-4">{idx + 1}</span>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium truncate max-w-[150px]">{habit.name}</span>
                  </div>
                  <span className="text-neutral-900 dark:text-white font-semibold">{habit.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* The Big Table Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col transition-colors duration-300"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[1200px] p-1">
            
            {/* Table Header: Weeks */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800">
              <div className="w-[200px] flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-3 font-semibold text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Daily Habits</span>
                <span>Goals</span>
              </div>
              
              {/* Weeks breakdown */}
              {[
                { name: "Week 1", days: 7, bg: "bg-red-50 dark:bg-red-950/20", text: "text-red-700 dark:text-red-400" },
                { name: "Week 2", days: 7, bg: "bg-blue-50 dark:bg-blue-950/20", text: "text-blue-700 dark:text-blue-400" },
                { name: "Week 3", days: 7, bg: "bg-green-50 dark:bg-green-950/20", text: "text-green-700 dark:text-green-400" },
                { name: "Week 4", days: 7, bg: "bg-purple-50 dark:bg-purple-950/20", text: "text-purple-700 dark:text-purple-400" },
                { name: "Week 5", days: daysInMonth - 28, bg: "bg-orange-50 dark:bg-orange-950/20", text: "text-orange-700 dark:text-orange-400" },
              ].map((week, idx) => (
                <div key={idx} className={`flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 flex flex-col ${week.bg}`} style={{ width: `${week.days * 32}px` }}>
                  <div className={`text-center text-[10px] font-bold py-1 border-b border-neutral-200 dark:border-neutral-800 ${week.text}`}>{week.name}</div>
                  <div className="flex">
                    {Array.from({ length: week.days }).map((_, d) => {
                      const dayNum = (idx * 7) + d + 1;
                      return (
                        <div key={d} className="w-[32px] text-center text-[10px] py-1 text-neutral-500 dark:text-neutral-400">
                          {dayNum <= daysInMonth ? dayNum : ''}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Stats Columns */}
              <div className="flex flex-1 border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="w-[60px] text-center text-[10px] font-bold py-2 border-r border-neutral-200 dark:border-neutral-800 dark:text-neutral-300">COMP.</div>
                <div className="w-[60px] text-center text-[10px] font-bold py-2 border-r border-neutral-200 dark:border-neutral-800 dark:text-neutral-300">LEFT</div>
                <div className="w-[60px] text-center text-[10px] font-bold py-2 border-r border-neutral-200 dark:border-neutral-800 dark:text-neutral-300">%</div>
                <div className="flex-1 text-center text-[10px] font-bold py-2 dark:text-neutral-300">PROGRESS</div>
              </div>
            </div>

            {/* Table Body: Habits */}
            <div className="flex flex-col">
              {stats.habitsWithStats.map((habit, hIdx) => (
                <div key={habit.id} className="flex border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors group">
                  
                  {/* Habit Name & Goal */}
                  <div className="w-[200px] flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 p-2 flex items-center justify-between bg-white dark:bg-transparent group-hover:bg-neutral-50 dark:group-hover:bg-transparent transition-colors">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-[10px] text-neutral-400 w-4 font-mono">{hIdx + 1}</span>
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 truncate">{habit.name}</span>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-500 font-mono">{habit.goal}</span>
                  </div>

                  {/* Checkboxes */}
                  <div className="flex">
                    {Array.from({ length: daysInMonth }).map((_, dIdx) => {
                      const dayNum = dIdx + 1;
                      const isChecked = habitData[habit.id]?.[dayNum];
                      return (
                        <div key={dayNum} className={`w-[32px] flex items-center justify-center border-r border-neutral-100 dark:border-neutral-800/50 ${dayNum % 7 === 0 ? 'border-r-neutral-200 dark:border-r-neutral-700' : ''}`}>
                          <button
                            onClick={() => toggleHabit(habit.id, dayNum)}
                            className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all ${
                              isChecked 
                                ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-black' 
                                : 'bg-transparent border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-400'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  {/* Stats & Progress Bar */}
                  <div className="flex flex-1 bg-white dark:bg-transparent border-l border-neutral-200 dark:border-neutral-800 group-hover:bg-neutral-50 dark:group-hover:bg-transparent transition-colors">
                    <div className="w-[60px] flex items-center justify-center border-r border-neutral-100 dark:border-neutral-800/50 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {habit.completed}
                    </div>
                    <div className="w-[60px] flex items-center justify-center border-r border-neutral-100 dark:border-neutral-800/50 text-xs text-neutral-500 dark:text-neutral-500">
                      {habit.left}
                    </div>
                    <div className="w-[60px] flex items-center justify-center border-r border-neutral-100 dark:border-neutral-800/50 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {habit.percentage.toFixed(0)}%
                    </div>
                    <div className="flex-1 flex items-center p-2">
                      <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, habit.percentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
            
          </div>
        </div>
        
        {/* Footer actions */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-between items-center">
          <button 
            onClick={resetCheckboxes}
            className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            RESET ALL CHECKBOXES
          </button>
        </div>
      </motion.div>

    </div>
  );
}
