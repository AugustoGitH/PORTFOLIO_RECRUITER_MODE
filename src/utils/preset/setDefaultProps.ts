import { filterObject, isPlainObject } from "../object";

/**
 * Merges default properties with provided properties, ignoring undefined values.
 * Additionally applies recursive merging for nested objects.
 *
 * Key features:
 * - Preserves exact literal types from default properties
 * - Makes defaulted properties required AND non-undefined
 * - Only affects properties specified in defaultProps; others remain unchanged
 * - Maintains full type safety with TypeScript's type inference
 * - Provides complete IntelliSense for available properties
 *
 * @param props - The properties provided by the user
 * @param defaultProps - The default properties to use when not specified in props
 * @param visited - Set to track visited objects to prevent infinite recursion
 * @returns A new object combining properties with precise typing
 *
 * @example
 * // Basic usage with a React component
 * type ButtonProps = {
 *   size?: "sm" | "md" | "lg" | undefined;  // Optional
 *   variant?: "primary" | "secondary" | undefined;  // Optional
 *   disabled?: boolean;  // Optional
 *   children: React.ReactNode;  // Required
 * };
 *
 * function Button(props: ButtonProps) {
 *   // Make size and variant required with specific literal types
 *   const finalProps = setDefaultProps(props, {
 *     size: "md",
 *     variant: "primary"
 *   });
 *
 *   // finalProps type: {
 *   //   size: "md";           // Now required with literal type (no undefined)
 *   //   variant: "primary";   // Now required with literal type (no undefined)
 *   //   disabled?: boolean;   // Still optional
 *   //   children: React.ReactNode;  // Still required
 *   // }
 *
 *   // Safe to use without checks or optional chaining
 *   const className = `btn-${finalProps.size} btn-${finalProps.variant}`;
 *
 *   // Optional properties still need optional chaining or checks
 *   const disabledClass = finalProps.disabled ? " disabled" : "";
 *
 *   return (
 *     <button className={className + disabledClass}>
 *       {finalProps.children}
 *     </button>
 *   );
 * }
 */
export const setDefaultProps = <
  Props = object,
  Defaults extends Partial<
    Pick<Props, Extract<keyof Props, keyof Defaults>>
  > = object,
>(
  props: Props,
  defaultProps: Defaults,
  visited = new WeakSet()
): Omit<Props, keyof Defaults> & {
  [K in keyof Defaults & keyof Props]-?: Defaults[K] extends undefined
    ? Props[K] // If default is undefined, keep original type
    : Defaults[K] extends Props[K]
      ? Exclude<Defaults[K], undefined> // Use exact type but remove undefined
      : Exclude<Props[K], undefined>; // Remove undefined from original type
} => {
  type Result = Omit<Props, keyof Defaults> & {
    [K in keyof Defaults & keyof Props]-?: Defaults[K] extends undefined
      ? Props[K]
      : Defaults[K] extends Props[K]
        ? Exclude<Defaults[K], undefined>
        : Exclude<Props[K], undefined>
  }

  // Early return for null or undefined inputs
  if (!props || !defaultProps) {
    return (props || defaultProps || {}) as Result;
  }

  // Prevent infinite recursion with circular references
  if (visited.has(props) || visited.has(defaultProps)) {
    return props as Result;
  }

  // Track visited objects
  visited.add(props);
  visited.add(defaultProps);

  // First, create a new object with properties from defaults and defined props
  const filtered = filterObject(
    props,
    ([, value]) => value !== undefined,
    false // Non-recursive filtering, we'll handle recursion ourselves
  );

  // Create the merged object
  const result: Record<string, unknown> = { ...defaultProps };

  // Add filtered props
  for (const key in filtered) {
    result[key] = filtered[key];
  }

  // Process nested objects recursively
  for (const key in result) {
    // Only process properties that exist in both objects
    if (key in defaultProps && key in (props as object)) {
      const resultValue = result[key];
      const defaultValue = defaultProps[key as keyof typeof defaultProps];
      const propsValue = props[key as keyof typeof props];

      // If all values are plain objects, recursively merge them
      if (
        isPlainObject(resultValue) &&
        isPlainObject(defaultValue) &&
        isPlainObject(propsValue)
      ) {
        // Pass the visited set to the recursive call
        // Use type assertion to handle nested objects safely
        result[key] = setDefaultProps<Record<string, unknown>, Record<string, unknown>>(
          propsValue,
          defaultValue,
          visited
        );
      }
    }
  }

  return result as Result;
};
