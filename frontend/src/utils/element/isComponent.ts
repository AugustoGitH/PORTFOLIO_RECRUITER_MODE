export const isComponent = <T>(value: T): value is T & React.ComponentType<any>=> {
  return typeof value === "function" || typeof value === "object";
}