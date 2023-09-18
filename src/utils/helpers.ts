/**
 * Delays the execution of subsequent code by a specified number of seconds.
 *
 * @param {number} s - The number of seconds to delay.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export const delay = (s: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, s * 1000));
