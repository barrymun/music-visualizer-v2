import { MusicVisualizer } from "lib/music-visualizer";

export class App {
  private static musicVisualizer: MusicVisualizer | undefined;

  public static getMusicVisualizer = (): MusicVisualizer => {
    // ensure singleton
    if (!this.musicVisualizer) {
      this.musicVisualizer = new MusicVisualizer({
        window,
        changeTrackCallback: () => {
          const input = document.querySelector(".secondary-controls-input") as HTMLInputElement | null;
          return input ? input.valueAsNumber : 1;
        },
      });
    }
    return this.musicVisualizer;
  };
}
