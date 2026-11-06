// Instead of Prop drilling filters, They will live here so any component can read and change directly with useFilter()
import React, { createContext, useContext, useState } from "react";
import type { FilterOptions } from "../types";

// The filters used when the app first loads and when it is cleared
export const defaultFilters: FilterOptions = {
    status: "all",
    priority: "all",
    search: "",
};

// What the context provides
interface FilterContextValue {
    filters: FilterOptions;
    setFilters: (filters: FilterOptions) => void;
}

// Create the context
const FilterContext = createContext<FilterContextValue | null>(null);

// Makes the filter available everywhere
export function FilterProvider({ children }: { children:React.ReactNode }) {
    // Simple local state
    const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

    const value: FilterContextValue = { filters, setFilters };

    return ( <FilterContext.Provider value={value}>{children}</FilterContext.Provider> );
}

// Custom hook
export function useFilter(): FilterContextValue {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilter must be used inside a <FilterProvider>");
    }
    return context;
}