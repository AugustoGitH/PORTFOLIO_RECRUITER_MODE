export const setDefaultPartialProps = <T extends Record<string, unknown>>(props: {
  [K in keyof T]: T[K][];
}): T => {
  const defaults = {} as T;

  for (const key in props) {
    let value: T[typeof key] | undefined;

    for (const item of props[key]) {
      if (item) {
        value = item;
        break;
      }
    }

    if (value === undefined) {
      throw new Error("ts");
    }

    defaults[key] = value;
  }

  return defaults;
};
