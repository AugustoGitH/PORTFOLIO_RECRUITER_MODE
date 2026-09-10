import type { PropsWithChildren } from 'react'


export type RecruiterModeContextValue = {
    isRecruiterMode: boolean;
    changeRecruiterMode: (state: boolean) => void;
    toggleRecruiterMode: () => void;
}

export type RecruiterModeProviderProps = PropsWithChildren
