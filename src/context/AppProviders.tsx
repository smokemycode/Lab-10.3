// Nesting the 3 providers here to keep the App.tsx file clean.
import { ThemeProvider } from "./ThemeContext";
import { FilterProvider } from "./FilterContext";
import { TodoProvider } from "./TodoContext";

export function AppProviders({ children }: { children: React.ReactNode}) {
    return (
        <ThemeProvider>
            <FilterProvider>
                <TodoProvider>{children}</TodoProvider>
            </FilterProvider>
        </ThemeProvider>
    );
}