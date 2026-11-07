import { useMemo } from "react";
import type { SortOption } from "../../types";
import { filterTasks, sortTasks } from "../../utils/taskUtils";
import { useTodo } from "../../context/TodoContext";
import { useFilter } from "../../context/FilterContext";
import TaskItem from './TaskItem';

// TaskList middle-man. It just renders and forwards props to TaskItem.
interface TaskListProps {
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
}

export default function TaskList({ sortBy, onSortChange }: TaskListProps) {
    const { tasks } = useTodo();
    const { filters, setFilters } = useFilter();

    const visibleTasks = useMemo(
        () => sortTasks(filterTasks(tasks, filters), sortBy),
        [tasks, filters, sortBy]
    );

    return (
        <div className="space-y-3">
            {/* Search + sort controls above the list. */}
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                value={filters.search}
                onChange={(e) => setFilters({...filters, search:e.target.value})}
                placeholder="🔍 Search tasks..."
                className="flex-1 p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
                <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                >
                <option value="created-desc">Newest first</option>
                <option value="created-asc">Oldest first</option>
                <option value="priority-high">Priority: high → low</option>
                <option value="priority-low">Priority: low → high</option>
                <option value="dueDate-asc">Due date soonest</option>
                <option value="title-asc">Title A → Z</option>
                </select>
            </div>

            {/* Empty state */}
            {visibleTasks.length === 0 ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <p className="text-lg">No tasks found 🎉</p>
                    <p className="text-sm">Try changing filters or add a new task!</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {/* One TaskItem per task */}
                    {visibleTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
                </div>
            )}
        </div>
    );
}