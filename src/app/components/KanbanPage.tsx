import { useState } from "react";
import { motion } from "motion/react";
import { Plus, MoreHorizontal, User, Flag } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  assignee?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const ITEM_TYPE = "TASK";

function TaskCard({ task, columnId, moveTask }: { 
  task: Task; 
  columnId: string;
  moveTask: (taskId: string, fromColumn: string, toColumn: string) => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { taskId: task.id, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const priorityColors = {
    high: "border-red-500/50 bg-red-500/10 text-red-400",
    medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
    low: "border-blue-500/50 bg-blue-500/10 text-blue-400",
  };

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 cursor-move hover:bg-white/10 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="flex-1 pr-2">{task.title}</h4>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-400 mb-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        
        {task.assignee && (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function KanbanColumn({ 
  column, 
  moveTask,
  addTask 
}: { 
  column: Column;
  moveTask: (taskId: string, fromColumn: string, toColumn: string) => void;
  addTask: (columnId: string) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { taskId: string; columnId: string }) => {
      if (item.columnId !== column.id) {
        moveTask(item.taskId, item.columnId, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const columnColors = {
    todo: "from-gray-500/20 to-gray-600/20 border-gray-500/30",
    inprogress: "from-blue-500/20 to-indigo-600/20 border-blue-500/30",
    done: "from-green-500/20 to-emerald-600/20 border-green-500/30",
  };

  return (
    <div
      ref={drop}
      className={`flex flex-col rounded-2xl bg-white/5 backdrop-blur-xl border transition-all duration-200 ${
        isOver ? "border-indigo-500/50 bg-indigo-500/5" : "border-white/10"
      }`}
    >
      {/* Column Header */}
      <div className={`p-4 rounded-t-2xl bg-gradient-to-br ${columnColors[column.id as keyof typeof columnColors] || "from-white/5 to-white/10"} border-b border-white/10`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{column.title}</h3>
            <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full">
              {column.tasks.length}
            </span>
          </div>
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 p-4 space-y-3 min-h-[400px]">
        {column.tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            columnId={column.id}
            moveTask={moveTask}
          />
        ))}
      </div>

      {/* Add Task Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => addTask(column.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 text-gray-400 hover:text-gray-200 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>
    </div>
  );
}

export function KanbanPage() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "1",
          title: "Design system documentation",
          description: "Create comprehensive docs for the component library",
          priority: "high",
          assignee: "user1",
        },
        {
          id: "2",
          title: "API integration",
          description: "Connect frontend with backend endpoints",
          priority: "medium",
          assignee: "user2",
        },
        {
          id: "3",
          title: "User testing",
          priority: "low",
        },
      ],
    },
    {
      id: "inprogress",
      title: "In Progress",
      tasks: [
        {
          id: "4",
          title: "Dashboard redesign",
          description: "Implement new glassmorphism design",
          priority: "high",
          assignee: "user1",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "5",
          title: "Setup project structure",
          priority: "medium",
          assignee: "user2",
        },
        {
          id: "6",
          title: "Configure build pipeline",
          priority: "low",
        },
      ],
    },
  ]);

  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const fromColumn = newColumns.find((col) => col.id === fromColumnId);
      const toColumn = newColumns.find((col) => col.id === toColumnId);

      if (!fromColumn || !toColumn) return prevColumns;

      const taskIndex = fromColumn.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) return prevColumns;

      const [task] = fromColumn.tasks.splice(taskIndex, 1);
      toColumn.tasks.push(task);

      return newColumns;
    });
  };

  const addTask = (columnId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: "New Task",
      priority: "medium",
    };

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    );
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 flex items-center justify-center">
            <Flag className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl">Kanban Board</h1>
            <p className="text-sm text-gray-400 mt-1">Visualize your workflow</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all duration-200 hover:scale-105 shadow-lg shadow-indigo-500/50">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </motion.div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            moveTask={moveTask}
            addTask={addTask}
          />
        ))}
      </motion.div>
    </div>
  );
}
