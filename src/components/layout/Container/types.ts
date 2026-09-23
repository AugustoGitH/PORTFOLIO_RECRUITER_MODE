import type { ComponentPropsWithoutRef, PropsWithChildren } from "react"

export type ContainerProps = PropsWithChildren<Omit<ComponentPropsWithoutRef<"section">, "children"> & {
  contentClassName?: string
}>
