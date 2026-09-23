import { cn } from "../../../utils/tailwind"
import type { ButtonProps } from "./types"
import { getElementProps, isLinkButton } from "./utils"


export const Button = (_props: ButtonProps) => {
  const { children, startAdornment, endAdornment, className, loading, ...props } = _props
  const isLoading = typeof loading === "object" ? loading.state : Boolean(loading)
  const isDisabled = isLoading
  const loadingLabel = typeof loading === "object" ? loading.verb : children
  const buttonClassName = cn("flex items-center gap-2 rounded-md border border-ud-neutral-300 px-5 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple", {
    "bg-ud-auxiliary-purple text-ud-neutral-0 border-ud-auxiliary-purple hover:bg-transparent hover:text-ud-auxiliary-purple": props.highlight,
    "hover:border-ud-neutral-950 hover:text-ud-neutral-950": !props.highlight,
    "pointer-events-none border-ud-neutral-300 bg-ud-neutral-300 text-ud-secondary-600 ": isDisabled,
    "animate-pulse": isLoading,
  }, className)

  const content = (
    <>
      {startAdornment}
      <span>
        {isLoading ? loadingLabel : children}
        {isLoading && (
          <span aria-hidden="true" className="inline-flex gap-0.5 ml-1">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="animate-typing-dot motion-reduce:animate-none"
                style={{ animationDelay: `${dot * 160}ms` }}
              >
                .
              </span>
            ))}
          </span>
        )}
      </span>
      {endAdornment}
    </>
  )

  if (isLinkButton(_props)) {
    const linkProps = getElementProps(_props)

    return (
      <a
        {...linkProps}
        className={buttonClassName}
        aria-busy={isLoading || undefined}
        aria-disabled={isLoading || undefined}
        tabIndex={isLoading ? -1 : linkProps.tabIndex}
        onClick={(event) => {
          if (isLoading) {
            event.preventDefault()
            return
          }

          linkProps.onClick?.(event)
        }}
      >
        {content}
      </a>
    )
  }

  const buttonProps = getElementProps(_props)

  return (
    <button
      {...buttonProps}
      className={buttonClassName}
      aria-busy={isLoading || undefined}
      aria-disabled={isLoading || undefined}
      disabled={isLoading || buttonProps.disabled}
      onClick={(event) => {
        if (!isLoading) {
          buttonProps.onClick?.(event)
        }
      }}
    >
      {content}
    </button>
  )
}
