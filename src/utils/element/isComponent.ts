export const isComponent = <T>(value: T): value is T & React.ComponentType<unknown> => {
  return typeof value === "function" || typeof value === "object";
}
