# Task Dashboard — Context API Refactor

A React + TypeScript + Tailwind Todo/Task dashboard. Originally built with **prop drilling** — one `Dashboard` component owned all the state and passed everything down. This lab refactored it to use **React Context API** so any component can read and update shared state directly.

## What it does

- Add, edit, delete tasks with title, description, priority, and due date
- Change task status inline (To Do → In Progress → Done)
- Filter by status and priority
- Search tasks by title or description
- Sort by created date, priority, due date, or title
- Toggle light/dark theme (saved to localStorage)
- Export tasks to JSON, import them back in
- Clear all completed tasks in one click
- **Persistence**: tasks and theme survive page refreshes

## How the refactor works

Three contexts, each with its own job:

| Context | What it holds | Who uses it |
|---|---|---|
| `ThemeContext` | `theme` (light/dark) + `toggleTheme` | `Dashboard` (header button) |
| `FilterContext` | `filters` (status/priority/search) + `setFilters` | `TaskFilter`, `TaskList` |
| `TodoContext` | `tasks` + all actions (add/edit/delete/update status/clear done/replace all) | `TaskForm`, `TaskItem`, `TaskList`, `Dashboard` |

`AppProviders.tsx` stacks the three providers so `App.tsx` stays tiny

## What I learned

- Prop drilling becomes painful fast. The original `Dashboard` was passing 7+ props to `TaskList` alone. Context turned that into one hook call.
- Contexts aren't a dumping ground. `sortBy` stays local because only one component writes it and one component reads it — moving it to context wouldn't remove any prop drilling. Contexts are for state multiple, unrelated components need.
- Rules of hooks are real. Calling `useTodo()` inside an event handler breaks the app. Hooks go at the top of the component, always.
- `useCallback` isn't decoration. Without it, `useMemo` on the value object would re-create on every render, defeating its own purpose.
- Syntax errors are 90% mismatched brackets. When Vite says "expected `,` or `)"` — count the parens. The error message is usually one character away from the fix.

