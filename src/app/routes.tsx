import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HabitsDashboard } from "./components/HabitsDashboard";
import { JournalPage } from "./components/JournalPage";
import { PomodoroPage } from "./components/PomodoroPage";
import { KanbanPage } from "./components/KanbanPage";
import { MatrixPage } from "./components/MatrixPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HabitsDashboard },
      { path: "journal", Component: JournalPage },
      { path: "pomodoro", Component: PomodoroPage },
      { path: "kanban", Component: KanbanPage },
      { path: "matrix", Component: MatrixPage },
    ],
  },
]);
