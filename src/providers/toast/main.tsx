"use client"

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { useINTLContext } from "../intl"
import { Toast } from "./components"
import type { ToastContextValue, ToastEntry, ToastOptions, ToastProviderProps } from "./types"

const DEFAULT_DURATION = 5_000
const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}

export const ToastProvider = (props: ToastProviderProps) => {
  const intl = useINTLContext()
  const nextId = useRef(0)
  const [toast, setToast] = useState<ToastEntry | null>(null)

  const showToast = useCallback((options: ToastOptions) => {
    const id = ++nextId.current
    setToast({ ...options, id, duration: options.duration ?? DEFAULT_DURATION })
    return id
  }, [])

  const dismissToast = useCallback((id?: number) => {
    setToast((current) => !current || (id !== undefined && current.id !== id) ? current : null)
  }, [])

  const value = useMemo(() => ({ showToast, dismissToast }), [dismissToast, showToast])

  return (
    <ToastContext.Provider value={value}>
      {props.children}
      <div
        className="pointer-events-none fixed right-3 top-3 z-toast w-fit max-w-[calc(100vw-1.5rem)] sm:right-6 sm:top-6"
        aria-live="polite"
      >
        {toast && (
          <div className="pointer-events-auto" key={toast.id}>
            <Toast
              toast={toast}
              closeLabel={intl.t("CloseNotification")}
              onDismiss={() => dismissToast(toast.id)}
            />
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}
