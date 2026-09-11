import { cn } from "../../../utils/tailwind"
import type { ButtonProps, LinkButtonProps } from "./types"

const isLinkButton = (props: ButtonProps): props is LinkButtonProps => Boolean(props.href)

const getElementProps = <T extends ButtonProps>(props: T) => {
  const elementProps = { ...props }

  delete elementProps.children
  delete elementProps.startAdornment
  delete elementProps.className
  delete elementProps.loading
  delete elementProps.highlight

  return elementProps
}

export const Button = (_props: ButtonProps) => {
  const { children, startAdornment, className, loading, ...props } = _props
  const isLoading = typeof loading === "object" ? loading.state : Boolean(loading)
  const isDisabled = isLoading
  const loadingLabel = typeof loading === "object" ? loading.verb : children
  const buttonClassName = cn("flex items-center gap-2 border border-ud-neutral-300 py-1 px-2 rounded-sm text-sm transition", {
    "bg-ud-auxiliary-purple text-ud-neutral-0 font-bold border-ud-auxiliary-purple hover:bg-transparent hover:text-ud-auxiliary-purple": props.highlight,
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
