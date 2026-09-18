import { ButtonProps, LinkButtonProps } from "./types"

export const isLinkButton = (props: ButtonProps): props is LinkButtonProps => Boolean(props.href)

export const getElementProps = <T extends ButtonProps>(props: T) => {
  const elementProps = { ...props }

  delete elementProps.children
  delete elementProps.startAdornment
  delete elementProps.className
  delete elementProps.loading
  delete elementProps.highlight

  return elementProps
}