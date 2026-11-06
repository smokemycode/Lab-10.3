import { useState, useMemo, useEffect } from "react";
import type { FilterOptions, SortOption, Task, TaskStatus, Theme } from "../../types";
import { filterTasks, generateId, sortTasks } from "../../utils/taskUtils";
import TaskForm from "../TaskForm/TaskForm";
import TaskFilter from "../TaskFilter/TaskFilter";
import TaskList from "../TaskList/TaskList";

const STORAGE_KEY = "task-dashboard-tasks"; // localStorage key for tasks
const THEME_KEY = "task-dashboard-theme"; // localStorage key for theme

const defaultFilters: FilterOptions = {
    status: "all",
    priority: "all",
    search: "",
}; // Used at load and on "Clear"

// Read tasks from localStorage, return empty array if none or invalid
function loadTasks(): Task[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// Read theme from localStorage, default to light if none or invalid
function loadTheme(): Theme {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "dark" ? "dark" : "light";
}

export default function Dashboard() {
    // Dashboard own ALL the state, and passes down to children as props
    const [tasks, setTasks] = useState<Task[]>(loadTasks);
    const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
    const [sortBy, setSortBy] = useState<SortOption>("created-desc");
    const [theme, setTheme] = useState<Theme>(loadTheme);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    // Save theme and apply to <html> element
    useEffect(() => {
        localStorage.setItem(THEME_KEY, theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    // Add a new task to the list
    function addTask(task: Task) {
        setTasks((prev) => [task, ...prev]);
    }

    // Update task status (e.g., from "todo" to "done")
    function updateStatus(id: string, status: TaskStatus) {
        setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)));
    }

    // Delete a task by id
    function deleteTask(id: string) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    }

    // Export tasks to a JSON file
    function exportData() {
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tasks-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import tasks from a JSON file
    function importData(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string);
                if (Array.isArray(imported)) setTasks(imported);
            } catch {
                alert("Invalid file.");
            }
        };
        reader.readAsText(file);
        e.target.value = ""; // Reset the input so the same file can be selected again
    }

    // Filter then sort tasks
    const visibleTasks = useMemo(
        () => sortTasks(filterTasks(tasks, filters), sortBy),
        [tasks, filters, sortBy]
    );

    // Stats
    const stats = useMemo(() => {
        const total = tasks.length;
        const done = tasks.filter((t) => t.status === "done").length;
        const inProgress = tasks.filter((t) => t.status === "in-progress").length;
        const todo = tasks.filter((t) => t.status === "todo").length;
        return { total, done, inProgress, todo };
    }, [tasks]);

    return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 transition-colors">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header: title + export/import/theme toggle. */}
        <header className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            📋 Task Dashboard
          </h1>
          <div className="flex gap-2 items-center">
            <button
              onClick={exportData}
              className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-1 rounded hover:opacity-80"
            >
              Export
            </button>

            {/* Label wrapping a hidden file input — clicking the label opens the picker. */}
            <label className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-1 rounded cursor-pointer hover:opacity-80">
              Import
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>

            {/* Theme toggle button. */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-1 rounded hover:opacity-80"
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </header>

        {/* Stats row — quick at-a-glance counts. */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Total", value: stats.total, color: "bg-slate-200 dark:bg-slate-700" },
            { label: "To Do", value: stats.todo, color: "bg-blue-100 dark:bg-blue-900" },
            { label: "In Progress", value: stats.inProgress, color: "bg-yellow-100 dark:bg-yellow-900" },
            { label: "Done", value: stats.done, color: "bg-green-100 dark:bg-green-900" },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.color} p-2 rounded text-center transition-colors`}
            >
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {s.label}
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column: form + filters. */}
          <div className="lg:col-span-1 space-y-4">
            <TaskForm onAdd={addTask} generateId={generateId} />
            <TaskFilter
              filters={filters}
              onFilterChange={setFilters}
              onClear={() => setFilters(defaultFilters)}
            />
          </div>

          {/* Right column: the task list. */}
          <div className="lg:col-span-2">
            <TaskList
              tasks={visibleTasks}
              sortBy={sortBy}
              onSortChange={setSortBy}
              search={filters.search}
              onSearchChange={(value) =>
                setFilters({ ...filters, search: value })
              }
              onUpdateStatus={updateStatus}
              onDelete={deleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
