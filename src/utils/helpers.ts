import { FftSize } from "utils/types";

/**
 * Delays the execution of subsequent code by a specified number of seconds.
 *
 * @param {number} s - The number of seconds to delay.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export const delay = (s: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, s * 1000));

/**
 * Converts a given number of seconds to a minute:second format rounded to the nearest whole number.
 *
 * @param {number} seconds - The number of seconds to be converted.
 * @returns {string} The formatted time string in minute:second format.
 *
 * @example
 * const formattedTime = secondsToMinSec(229);
 * console.log(formattedTime);  // Output: "3:49"
 */
export const secondsToMinSec = (seconds: number): string => {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.round(seconds % 60);

  // If rounding the seconds results in 60, adjust the minutes and reset seconds
  if (remainingSeconds === 60) {
    remainingSeconds = 0;
    minutes += 1;
  }

  // If seconds is a single digit, pad with a 0 (e.g., "2:05" instead of "2:5")
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : String(remainingSeconds);
  return `${minutes}:${formattedSeconds}`;
};

export const getFftSize = (): FftSize => {
  let fftSize: FftSize = 256;
  if (window.innerWidth <= 400) {
    fftSize = 32;
  } else if (window.innerWidth > 400 && window.innerWidth <= 1000) {
    fftSize = 64;
  } else if (window.innerWidth > 1000 && window.innerWidth < 1600) {
    fftSize = 128;
  } else {
    fftSize = 256;
  }
  console.log({ fftSize });
  return fftSize;
};
