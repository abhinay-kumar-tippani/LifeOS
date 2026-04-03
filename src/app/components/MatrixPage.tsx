import { useState } from "react";
import { motion } from "motion/react";
import { Grid3x3, GripVertical, Plus, Trash2 } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

interface MatrixTask {
  id: string;
  title: string;
  quadrant: "urgent-important" | "not-urgent-important" | "urgent-not-important" | "not-urgent-not-important";
}

const ITEM_TYPE = "MATRIX_TASK";

function MatrixTaskItem({ 
  task, 
  moveTask,
  deleteTask 
}: { 
  task: MatrixTask;
  moveTask: (taskId: string, fromQuadrant: string, toQuadrant: string) => void;
  deleteTask: (taskId: string, quadrant: string) => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { taskId: task.id, quadrant: task.quadrant },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      className="group flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-move transition-all duration-200"
    >
      <GripVertical className="w-4 h-4 text-gray-500 flex-shrink-0" />
      <span className="flex-1 text-sm">{task.title}</span>
      <button
        onClick={() => deleteTask(task.id, task.quadrant)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
      >
        <Trash2 className="w-3 h-3 text-red-400" />
      </button>
    </motion.div>
  );
}

function MatrixQuadrant({
  quadrant,
  title,
  description,
  color,
  tasks,
  moveTask,
  addTask,
  deleteTask,
}: {
  quadrant: string;
  title: string;
  description: string;
  color: string;
  tasks: MatrixTask[];
  moveTask: (taskId: string, fromQuadrant: string, toQuadrant: string) => void;
  addTask: (quadrant: string) => void;
  deleteTask: (taskId: string, quadrant: string) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { taskId: string; quadrant: string }) => {
      if (item.quadrant !== quadrant) {
        moveTask(item.taskId, item.quadrant, quadrant);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`rounded-2xl bg-gradient-to-br ${color} backdrop-blur-xl border p-6 flex flex-col transition-all duration-200 ${
        isOver ? "border-indigo-500/50 scale-[1.02]" : "border-white/10"
      }`}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg mb-1">{title}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>

      {/* Tasks */}
      <div className="flex-1 space-y-2 mb-4 min-h-[200px]">
        {tasks.map((task) => (
          <MatrixTaskItem
            key={task.id}
            task={task}
            moveTask={moveTask}
            deleteTask={deleteTask}
          />
        ))}

        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm text-gray-500 italic">
            Drop tasks here
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => addTask(quadrant)}
        className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-200 transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </button>
    </div>
  );
}

export function MatrixPage() {
  const [tasks, setTasks] = useState<MatrixTask[]>([
    { id: "1", title: "Client presentation deadline", quadrant: "urgent-important" },
    { id: "2", title: "Critical bug fix", quadrant: "urgent-important" },
    { id: "3", title: "Strategic planning", quadrant: "not-urgent-important" },
    { id: "4", title: "Learning new technology", quadrant: "not-urgent-important" },
    { id: "5", title: "Responding to emails", quadrant: "urgent-not-important" },
    { id: "6", title: "Social media scrolling", quadrant: "not-urgent-not-important" },
  ]);

  const moveTask = (taskId: string, fromQuadrant: string, toQuadrant: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, quadrant: toQuadrant as MatrixTask["quadrant"] }
          : task
      )
    );
  };

  const addTask = (quadrant: string) => {
    const newTask: MatrixTask = {
      id: Date.now().toString(),
      title: "New Task",
      quadrant: quadrant as MatrixTask["quadrant"],
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (taskId: string, quadrant: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const getQuadrantTasks = (quadrant: string) => {
    return tasks.filter((task) => task.quadrant === quadrant);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 flex items-center justify-center">
            <Grid3x3 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl">Eisenhower Matrix</h1>
            <p className="text-sm text-gray-400 mt-1">
              Prioritize by urgency and importance
            </p>
          </div>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/20 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center flex-shrink-0">
            <Grid3x3 className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg mb-2">How to use the Eisenhower Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <span className="text-red-400 font-semibold">Do First:</span> Urgent and important tasks require immediate attention
              </div>
              <div>
                <span className="text-blue-400 font-semibold">Schedule:</span> Important but not urgent, plan for these
              </div>
              <div>
                <span className="text-yellow-400 font-semibold">Delegate:</span> Urgent but not important, delegate if possible
              </div>
              <div>
                <span className="text-gray-400 font-semibold">Eliminate:</span> Neither urgent nor important, consider removing
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Matrix Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Quadrant 1: Urgent & Important */}
        <MatrixQuadrant
          quadrant="urgent-important"
          title="Do First"
          description="Urgent & Important"
          color="from-red-500/10 to-orange-500/10"
          tasks={getQuadrantTasks("urgent-important")}
          moveTask={moveTask}
          addTask={addTask}
          deleteTask={deleteTask}
        />

        {/* Quadrant 2: Not Urgent & Important */}
        <MatrixQuadrant
          quadrant="not-urgent-important"
          title="Schedule"
          description="Not Urgent & Important"
          color="from-blue-500/10 to-indigo-500/10"
          tasks={getQuadrantTasks("not-urgent-important")}
          moveTask={moveTask}
          addTask={addTask}
          deleteTask={deleteTask}
        />

        {/* Quadrant 3: Urgent & Not Important */}
        <MatrixQuadrant
          quadrant="urgent-not-important"
          title="Delegate"
          description="Urgent & Not Important"
          color="from-yellow-500/10 to-amber-500/10"
          tasks={getQuadrantTasks("urgent-not-important")}
          moveTask={moveTask}
          addTask={addTask}
          deleteTask={deleteTask}
        />

        {/* Quadrant 4: Not Urgent & Not Important */}
        <MatrixQuadrant
          quadrant="not-urgent-not-important"
          title="Eliminate"
          description="Not Urgent & Not Important"
          color="from-gray-500/10 to-slate-500/10"
          tasks={getQuadrantTasks("not-urgent-not-important")}
          moveTask={moveTask}
          addTask={addTask}
          deleteTask={deleteTask}
        />
      </motion.div>
    </div>
  );
}
