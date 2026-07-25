export const setDefaultPartialProps = <T extends Record<string, any>>(props: {
  [K in keyof T]: T[K][];
}): T => {
  const defaults = {} as T;

  for (const key in props) {
    const value = props[key].reduce((acc, item) => acc || item, undefined);

    if (value === undefined) {
      throw new Error("ts");
    }

    defaults[key] = value;
  }

  return defaults;
};
