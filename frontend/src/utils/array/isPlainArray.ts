/**
 * Determines whether the passed value is an Array.
 *
 * This utility function is a direct reference to the native Array.isArray method,
 * which tests if a value is an array. It provides a consistent naming convention
 * within the application's utility functions.
 *
 * @param {any} value - The value to be checked
 * @returns {boolean} True if the value is an Array, otherwise false
 *
 * @example
 * // Returns true
 * isPlainArray([1, 2, 3]);
 *
 * @example
 * // Returns false
 * isPlainArray({ length: 3 });
 *
 * @example
 * // Returns false
 * isPlainArray('array');
 *
 * @example
 * // Returns false
 * isPlainArray(null);
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray|Array.isArray}
 */
export const isPlainArray = Array.isArray;
