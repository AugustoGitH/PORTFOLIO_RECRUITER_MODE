import type { TypographyProps } from "./types";

export const Typography = (props: TypographyProps) => {
  const T = props.as || 'p';

  return <T >{props.children}</T>
}