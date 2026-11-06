// The priority levels a task can have
export type TaskPriority = "low" | "medium" | "high";

// The status of a task
export type TaskStatus = "todo" | "in-progress" | "done";

// What a Task looks like
export interface Task {
    id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string; // stored as "YYYY-MM-DD"
    createdAt: string; // ISO date string
}

// What the form collects (no id/createdAt yet)
export interface TaskFormData {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
}

// How we filter tasks
export interface FilterOptions {
    status: TaskStatus | "all";
    priority: TaskPriority | "all";
    search: string;
}

// How we sort tasks
export type SortOption =
    | "created-desc"
    | "created-asc"
    | "priority-high"
    | "priority-low"
    | "dueDate-asc"
    | "title-asc";

// Theme
export type Theme = "light" | "dark";