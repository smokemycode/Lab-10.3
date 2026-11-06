import type { Task, FilterOptions, SortOption, TaskFormData } from "../types";

// Make a unique ID for each task
export function generateId(): string {
    return crypto.randomUUID();
}

// Sort tasks based on the chosen option
export function sortTasks(tasks: Task[], sortBy: SortOption): Task[] {
    // Copy the array so we don't change the original
    const copy = [...tasks];
    const priorityRank = { high: 3, medium: 2, low: 1 };

    switch (sortBy) {
        case "created-desc":
            return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        case "created-asc": 
            return copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        case "priority-high":
            return copy.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
        case "priority-low":
            return copy.sort((a,b) => priorityRank[a.priority] - priorityRank[b.priority]);
        case "dueDate-asc":
            return copy.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        case "title-asc":
            return copy.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return copy;
    }
}

// Filter tasks by status, priority, and search text
export function filterTasks(tasks: Task[], filters: FilterOptions): Task[] {
    return tasks.filter((task) => {
        if (filters.status !== "all" && task.status !== filters.status) return false;
        if (filters.priority !== "all" && task.priority !== filters.priority) return false;
        if (filters.search.trim()) {
            const q = filters.search.toLowerCase();
            const matches = task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q);
            if (!matches) return false;
        }
        return true;
    });
}

// Validate the form and return error messages
export function validateTaskForm(data: TaskFormData): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!data.title.trim()) errors.title = "Title is required.";
    else if (data.title.trim().length < 3) errors.title = "Title must be at least 3 characters long.";
    else if (data.title.length > 80) errors.title = "Title must be less than 80 characters long.";

    if (data.description.length > 500) errors.description = "Description must be less than 500 characters long.";

    if (!data.dueDate) errors.dueDate = "Due date is required.";

    return errors;
}

// Format a date string for display
export function formatDate(dateString: string): string {
    if (!dateString) return "No date";
    const d = new Date(dateString + "T00:00:00"); // Ensure it's treated as local date
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// Check if a task is overdue
export function isOverdue(task: Task): boolean {
    if (task.status === "done" || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
}