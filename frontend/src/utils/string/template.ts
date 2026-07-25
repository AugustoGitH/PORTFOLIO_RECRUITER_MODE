

/**
 * Replaces placeholders in a template string with corresponding values from a variants object or a single string/number.
 *
 * @template T - The type of the template string.
 * @template SK - The type of the start marking, defaulting to `"{"`.
 * @template EK - The type of the end marking, defaulting to `"}"`.
 * @template Variants - A mapped object type inferred from the template string, or a string/number value.
 *
 * @param {T} template - The template string containing placeholders defined by the start and end markings.
 * @param {Variants} variants - An object mapping placeholder names to replacement values, or a single string/number to replace all placeholders.
 * @param {Object} [options] - Configuration for the placeholder markings.
 * @param {SK} [options.startMarking="{"] - The character(s) marking the start of a placeholder.
 * @param {EK} [options.endMarking="}"] - The character(s) marking the end of a placeholder.
 *
 * @returns {T} - The template string with placeholders replaced by the corresponding values.
 *
 * @example
 * // Example 1: Using an object for variants
 * const result = template("Hello, {name}!", { name: "Alice" });
 * console.log(result); // "Hello, Alice!"
 *
 * @example
 * // Example 2: Using a single string for all placeholders
 * const result = template("Repeat: {word}, {word}, {word}!", "Echo");
 * console.log(result); // "Repeat: Echo, Echo, Echo!"
 *
 * @example
 * // Example 3: Custom start and end markings
 * const result = template("Hello, [[name]]!", { name: "Alice" }, { startMarking: "[[", endMarking: "]]" });
 * console.log(result); // "Hello, Alice!"
 */

import type { CreateTypeFromString, Primitive } from "../types";

export const template = <
  T extends string,
  SK extends string = "{",
  EK extends string = "}",
  Variants extends CreateTypeFromString<T, SK, EK> | Primitive =
    | CreateTypeFromString<T, SK, EK>
    | Primitive,
>(
  template: T,
  variants: Variants,
  options: { endMarking: EK; startMarking: SK } = {
    startMarking: "{" as SK,
    endMarking: "}" as EK,
  }
) => {
  const replace = (template: string, value: Primitive, variant: string) => {
    const regex = new RegExp(
      `\\${options.startMarking}${variant}\\${options.endMarking}`,
      "g"
    );
    return template.replace(regex, String(value)) as T;
  };
  if (typeof variants !== "object") {
     
    return replace(template, variants, `([^${options.endMarking}]+)`);
  }

  for (const variant in variants) {
    template = replace(template, variants[variant] ?? "", variant);
  }

  return template;
};
