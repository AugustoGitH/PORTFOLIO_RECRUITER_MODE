export type ChildrenRenderer<D> =
  | React.ReactNode
  | ((data: D) => React.ReactNode);

export type PropsWithChildrenRenderer<D, P extends object = Record<string, unknown>> = P & {
  children?: ChildrenRenderer<D>
}
