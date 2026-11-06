// The "task brain" lives here so any component can use it via useTodo()
import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from "react";
import type { Task, TaskStatus } from "../types";

// ------- localStorage helper
const STORAGE_KEY = "task-dashboard-tasks";

// Read saved tasks
function loadTasks(): Task[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        // If JSON.parse fails, dont crash ... start fresh
        return [];
    }
}

// ------- Reducer: All they ways the task can change

// The actions
type TodoAction = 
    | { type: "ADD"; task: Task }
    | { type: "UPDATE_STATUS"; id: string; status: TaskStatus }
    | { type: "DELETE"; id: string; }
    | { type: "EDIT"; id: string; title: string }
    | { type: "CLEAR_DONE" };

function todoReducer(state: Task[], action: TodoAction): Task[] {
    switch (action.type) {
        case "ADD":
            // New task goes to the top of the list by default
            return [action.task, ...state];

        case "UPDATE_STATUS":
            // Only the matching tasks gets a new status
            return state.map((task) => task.id === action.id ? { ...task, status: action.status } : task);

        case "DELETE":
            // Everything except the matching id
            return state.filter((task) => task.id !== action.id);
        
        case "EDIT":
            // Only the task with the matching id
            return state.map((task) => task.id === action.id ? { ...task, title: action.title } : task );

        case "CLEAR_DONE":
            // Keep only tasks that aren't done
            return state.filter((task) => task.status !== "done");

        default:
            return state;
    }
}

// -------  Values given to the app
interface TodoContextValue {
    tasks: Task[];
    addTask: (task: Task) => void;
    updateStatus: (id: string, status: TaskStatus) => void;
    deleteTask: (id: string) => void;
    editTask: (id: string, title: string) => void;
    clearCompleted: () => void;
}

const TodoContext = createContext<TodoContextValue | null>(null);

// ------- Provider
export function TodoProvider({ children }: { children: React.ReactNode }) {
    const [tasks, dispatch] = useReducer(todoReducer, undefined, loadTasks);

    // Whenever tasks change, save them
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    // Keeps the same identity between renders
    const addTask = useCallback((task: Task) => {
        dispatch({ type: "ADD", task });
    }, []);

    const updateStatus = useCallback((id: string, status: TaskStatus) => {
        dispatch({ type: "UPDATE_STATUS", id, status });
    }, []);

    const deleteTask = useCallback((id: string) => {
        dispatch({ type: "DELETE", id });
    }, []);

    const editTask = useCallback((id: string, title: string) => {
        dispatch({ type: "EDIT", id, title });
    }, []);

    const clearCompleted = useCallback(() => {
        dispatch({ type: "CLEAR_DONE" });
    }, []);

    // Only re-render unless tasks or one of the actions change
    const value = useMemo<TodoContextValue>(() => ({ tasks, addTask, updateStatus, deleteTask, editTask, clearCompleted}), [tasks, updateStatus, deleteTask, editTask, clearCompleted]);

    return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

// Custom Hook
export function useTodo(): TodoContextValue {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error("useTodo must be used inside a <TodoProvider>");
    }
    return context;
}