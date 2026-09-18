export const unstable_cache = <T extends (...args: never[]) => unknown>(callback: T) => callback
export const revalidateTag = () => undefined
