import { CheckCircleIcon, HeartIcon, SparklesIcon, XCircleIcon, XIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { cn } from "../../../../utils/tailwind"
import type { ToastProps } from "./types"

const iconContainerClassName = "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"

const getIcon = (props: ToastProps): ReactNode => {
  const { toast } = props

  if (toast.variant === "status") {
    return (
      <span className={cn(
        iconContainerClassName,
        toast.status === "success" ? "bg-ud-auxiliary-purple-light" : "bg-ud-semantic-error-light",
      )}>
        {toast.status === "success" ? (
          <CheckCircleIcon className="text-ud-auxiliary-purple" size={24} strokeWidth={2} aria-hidden="true" />
        ) : (
          <XCircleIcon className="text-ud-semantic-error" size={24} strokeWidth={2} aria-hidden="true" />
        )}
      </span>
    )
  }

  if (toast.variant === "action") {
    return (
      <span className={cn(iconContainerClassName, "bg-ud-semantic-error-light text-ud-semantic-error")}>
        {toast.icon ?? <HeartIcon size={25} strokeWidth={2} aria-hidden="true" />}
      </span>
    )
  }

  return toast.icon ?? <SparklesIcon className="text-ud-auxiliary-purple" size={42} aria-hidden="true" />
}

export const Toast = (props: ToastProps) => {
  const { toast, onDismiss } = props
  const [isLeaving, setIsLeaving] = useState(false)
  const leavingRef = useRef(false)

  const requestDismiss = useCallback(() => {
    if (leavingRef.current) return

    leavingRef.current = true
    setIsLeaving(true)
    window.setTimeout(onDismiss, 200)
  }, [onDismiss])

  useEffect(() => {
    const timeoutId = window.setTimeout(requestDismiss, toast.duration)
    return () => window.clearTimeout(timeoutId)
  }, [requestDismiss, toast.duration])

  const progressStyle = {
    "--toast-duration": `${toast.duration}ms`,
  } as CSSProperties

  const action = toast.variant === "status" ? undefined : toast.action

  return (
    <section
      role={toast.variant === "status" && toast.status === "error" ? "alert" : "status"}
      aria-atomic="true"
      className={cn(
        "relative min-h-[98px] w-fit max-w-full overflow-hidden rounded-lg border bg-ud-neutral-100 px-4 pb-5 pt-4",
        "shadow-[0_2px_12px_rgba(35,38,49,0.12)]",
        isLeaving ? "ud-toast-exit" : "ud-toast-enter",
        toast.variant === "custom" ? "border-ud-auxiliary-purple" : "border-ud-neutral-300",
        toast.variant === "action" && "before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-ud-auxiliary-purple",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className={cn("shrink-0", toast.variant === "custom" && "flex h-16 w-16 items-end justify-center overflow-hidden")}>
          {getIcon(props)}
        </div>

        <div className="min-w-0 max-w-96">
          <h2 className="truncate text-base font-bold leading-5 text-ud-neutral-999">
            {toast.title}
          </h2>
          <p className="mt-0.5 truncate text-sm leading-5 text-ud-secondary-600">
            {toast.description}
          </p>
        </div>

        {action && (
          <button
            type="button"
            className="shrink-0 rounded-md bg-ud-auxiliary-purple-light px-4 py-2.5 text-sm font-bold text-ud-auxiliary-purple transition-colors hover:bg-ud-auxiliary-purple hover:text-ud-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple"
            onClick={() => {
              action.onClick()
              requestDismiss()
            }}
          >
            {action.label}
          </button>
        )}

        <button
          type="button"
          onClick={requestDismiss}
          aria-label={props.closeLabel}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-ud-secondary-600 transition-colors hover:text-ud-neutral-999 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ud-auxiliary-purple"
        >
          <XIcon size={21} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="absolute bottom-2.5 left-3.5 right-3.5 h-1 overflow-hidden rounded-full bg-ud-neutral-300">
        <div
          className={cn(
            "h-full origin-left animate-toast-progress rounded-full motion-reduce:animate-none",
            toast.variant === "status" && toast.status === "error" ? "bg-ud-semantic-error" : "bg-ud-auxiliary-purple",
          )}
          style={progressStyle}
        />
      </div>
    </section>
  )
}
