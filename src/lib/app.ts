import { MusicVisualizer } from "lib/music-visualizer";

export class App {
  static #musicVisualizer?: MusicVisualizer;

  public static getMusicVisualizer = (): MusicVisualizer => {
    if (!this.#musicVisualizer) {
      // ensure singleton
      this.#musicVisualizer = new MusicVisualizer({
        windowObj: window,
        changeTrackCallback: () => {
          const input = document.querySelector(".secondary-controls-input") as HTMLInputElement | null;
          return input ? input.valueAsNumber : 1;
        },
      });
    }
    return this.#musicVisualizer;
  };
}
