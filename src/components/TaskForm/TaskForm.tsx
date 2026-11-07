import { useState } from "react";
import type { Task, TaskFormData } from "../../types";
import { validateTaskForm, generateId } from "../../utils/taskUtils";
import { useTodo } from "../../context/TodoContext";

// Blank form values — used at first load and to reset after submit.
const emptyFormData: TaskFormData = {
	title: "",
	description: "",
	priority: "medium",
	status: "todo",
	dueDate: "",
};

export default function TaskForm() {
	const [form, setForm] = useState<TaskFormData>(emptyFormData); // What the user typed.
	const [errors, setErrors] = useState<Record<string, string>>({}); // Validation messages per field.
	const [submitted, setSubmitted] = useState(false); // Only show errors AFTER first submit attempt.
	const { addTask } = useTodo();

	// One handler for every input — uses `name` to know which field to update.
	function handleChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) {
		const { name, value } = e.target;
		const next = { ...form, [name]: value }; // Copy, then override one field.
		setForm(next);
		if (submitted) setErrors(validateTaskForm(next)); // Live re-validation after first submit.
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitted(true);
		const validation = validateTaskForm(form);
		setErrors(validation);
		if (Object.keys(validation).length > 0) return; // Exit if any errors.

		addTask({
			...form,
			id: generateId(),
			createdAt: new Date().toISOString(),
		}); // Send new task up to parent.
		setForm(emptyFormData);
		setErrors({});
		setSubmitted(false);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow space-y-3 transition-colors"
			noValidate>
			<h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
				Add a Task
			</h2>

      {/* Title — required, 3-80 chars. */}
			<div>
				<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
					Title *
				</label>
				<input
					name="title"
					value={form.title}
					onChange={handleChange}
					className="w-full p-2 mt-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
					placeholder="What do you need to do?"
				/>
				{errors.title && (
					<p className="text-red-500 text-sm mt-1">{errors.title}</p>
				)} {/* Only render if there's an error. */}
			</div>

      {/* Description — optional, max 500 chars. */}
			<div>
				<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
					Description
				</label>
				<textarea
					name="description"
					value={form.description}
					onChange={handleChange}
					rows={2}
					className="w-full p-2 mt-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
					placeholder="Optional details"
				/>
				{errors.description && (
					<p className="text-red-500 text-sm mt-1">{errors.description}</p>
				)}
			</div>

      {/* Priority + due date side by side. */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
						Priority
					</label>
					<select
						name="priority"
						value={form.priority}
						onChange={handleChange}
						className="w-full p-2 mt-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
						Due date *
					</label>
					<input
						type="date"
						name="dueDate"
						value={form.dueDate}
						onChange={handleChange}
						className="w-full p-2 mt-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
					/>
					{errors.dueDate && (
						<p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
					)}
				</div>
			</div>

			<button
				type="submit"
				className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors">
				Add Task
			</button>
		</form>
	);
}
