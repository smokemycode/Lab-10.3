import { TrashIcon } from "@heroicons/react/24/outline";
import type { Task, TaskStatus } from "../../types";
import { formatDate, isOverdue } from "../../utils/taskUtils";
import { useTodo } from "../../context/TodoContext";

// Lookup table: priority -> Tailwind classes so the TSX is cleaner.
const priorityColors: Record<string, string> = {
	high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
	medium:
		"bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
	low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
};

export default function TaskItem({ task }: { task: Task}) {
	const overdue = isOverdue(task); // Compute once per render.
	const { updateStatus, deleteTask } = useTodo();

	return (
		<div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow flex flex-col gap-2 transition-colors border-l-4 border-blue-500">
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1">
					{/* Done tasks get line-through + faded text. */}
					<h3
						className={`font-semibold text-slate-900 dark:text-slate-100 ${
							task.status === "done" ? "line-through opacity-60" : ""
						}`}>
						{task.title}
					</h3>
					{task.description && (
						<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
							{task.description}
						</p>
					)}
				</div>
				<button
					onClick={() => deleteTask(task.id)}
					className="text-slate-400 hover:text-red-500 transition-colors p-1"
					aria-label="Delete task"> {/* Arrow fn so we can pass id. */}
					<TrashIcon className="w-5 h-5" />
				</button>
			</div>

			<div className="flex flex-wrap gap-2 items-center text-xs">
        {/* Priority badge */}
				<span
					className={`px-2 py-1 rounded font-medium ${priorityColors[task.priority]}`}>
					{task.priority.toUpperCase()}
				</span>

        {/* Inline status  */}
				<select
					value={task.status}
					onChange={(e) =>
						updateStatus(task.id, e.target.value as TaskStatus)
					}
					className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
					<option value="todo">To Do</option>
					<option value="in-progress">In Progress</option>
					<option value="done">Done</option>
				</select>

        {/* Due date + overdue warning */}
				<span
					className={`${
						overdue
							? "text-red-600 dark:text-red-400 font-semibold"
							: "text-slate-500 dark:text-slate-400"
					}`}>
					📅 {formatDate(task.dueDate)}
					{overdue && " (Overdue)"}
				</span>
			</div>
		</div>
	);
}
