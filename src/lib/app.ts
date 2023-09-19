import { MusicVisualizer } from "lib/music-visualizer";

export class App {
  private static musicVisualizer: MusicVisualizer | undefined;

  public static getMusicVisualizer = (): MusicVisualizer => {
    // ensure singleton
    if (!this.musicVisualizer) {
      this.musicVisualizer = new MusicVisualizer();
    }
    return this.musicVisualizer;
  };
}
