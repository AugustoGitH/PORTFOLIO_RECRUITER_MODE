export type ChildrenRenderer<D> =
  | React.ReactNode
  | ((data: D) => React.ReactNode);

export type PropsWithChildrenRenderer<D, P extends Record<string, any> = Record<string, any>> = P & {
  children?: ChildrenRenderer<D>
}
