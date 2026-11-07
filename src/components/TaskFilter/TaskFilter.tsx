import type { FilterOptions } from "../../types";
import { useFilter, defaultFilters } from "../../context/FilterContext";

export default function TaskFilter() {
  const { filters, setFilters } = useFilter();
  const hasActiveFilters = filters.status !== "all" || filters.priority !== "all";

    return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow space-y-2 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters(defaultFilters)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Status filter — spread old filters, override just status. */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value as FilterOptions["status"],
              })
            }
            className="w-full p-2 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority filter — same pattern. */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({
                ...filters,
                priority: e.target.value as FilterOptions["priority"],
              })
            }
            className="w-full p-2 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Active-filter badges so users know why some tasks are hidden. */}      
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1 pt-1">
          {filters.status !== "all" && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded">
              Status: {filters.status}
            </span>
          )}
          {filters.priority !== "all" && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded">
              Priority: {filters.priority}
            </span>
          )}
        </div>
      )}
    </div>
  );
}