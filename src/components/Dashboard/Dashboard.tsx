import { useState, useMemo } from "react";
import type { SortOption } from "../../types";
import TaskForm from "../TaskForm/TaskForm";
import TaskFilter from "../TaskFilter/TaskFilter";
import TaskList from "../TaskList/TaskList";
import { useTodo } from "../../context/TodoContext";
import { useTheme } from "../../context/ThemeContext";

export default function Dashboard() {
	// GET FROM CONTEXT
	const { tasks, setAllTasks, clearCompleted } = useTodo();
	const { theme, setTheme } = useTheme();

	// This is local, only TaskList uses it
	const [sortBy, setSortBy] = useState<SortOption>("created-desc");

	// Stats
	const stats = useMemo(() => {
		const total = tasks.length;
		const done = tasks.filter((t) => t.status === "done").length;
		const inProgress = tasks.filter((t) => t.status === "in-progress").length;
		const todo = tasks.filter((t) => t.status === "todo").length;
		return { total, done, inProgress, todo };
	}, [tasks]);

	// Export tasks to a JSON file
	function exportData() {
		const blob = new Blob([JSON.stringify(tasks, null, 2)], {
			type: "application/json",
		});
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
				if (Array.isArray(imported)) {
					setAllTasks(imported);
				}
			} catch {
				alert("Invalid file.");
			}
		};
		reader.readAsText(file);
		e.target.value = ""; // Reset the input so the same file can be selected again
	}

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
							className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-1 rounded hover:opacity-80">
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

            {/* Clear done button */}
						<button
							onClick={clearCompleted}
							className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-1 rounded hover:opacity-80">
							Clear Done
						</button>

						{/* Theme toggle button. */}
						<button
							onClick={() => setTheme(theme === "light" ? "dark" : "light")}
							className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-1 rounded hover:opacity-80">
							{theme === "light" ? "🌙 Dark" : "☀️ Light"}
						</button>
					</div>
				</header>

				{/* Stats row — quick at-a-glance counts. */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
					{[
						{
							label: "Total",
							value: stats.total,
							color: "bg-slate-200 dark:bg-slate-700",
						},
						{
							label: "To Do",
							value: stats.todo,
							color: "bg-blue-100 dark:bg-blue-900",
						},
						{
							label: "In Progress",
							value: stats.inProgress,
							color: "bg-yellow-100 dark:bg-yellow-900",
						},
						{
							label: "Done",
							value: stats.done,
							color: "bg-green-100 dark:bg-green-900",
						},
					].map((s) => (
						<div
							key={s.label}
							className={`${s.color} p-2 rounded text-center transition-colors`}>
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
						<TaskForm />
						<TaskFilter />
					</div>

					{/* Right column: the task list. */}
					<div className="lg:col-span-2">
						<TaskList sortBy={sortBy} onSortChange={setSortBy} />
					</div>
				</div>
			</div>
		</div>
	);
}
