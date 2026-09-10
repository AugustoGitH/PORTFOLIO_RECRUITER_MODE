import type { PropsWithChildren } from "react";

export type TabsContextValue = {
    currentTab: number;
    /** True once the user has navigated at least once (not the initial mount). */
    hasNavigated: boolean;
    navigateToTab: (tabIndex: number) => void;
    isCurrentTab: (tabIndex: number) => boolean
}

export type TabsProviderProps = PropsWithChildren