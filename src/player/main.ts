import { MusicVisualizer } from "music-visualizer/main";
import { playBtn } from "utils/elements";

import mp3Src from "assets/mp3/burn-water-nostalgia-dreams.mp3";

export class Player {
  private musicVisualizer!: MusicVisualizer;

  private getMusicVisualizer = () => this.musicVisualizer;

  private setMusicVisualizer = (musicVisualizer: MusicVisualizer) => (this.musicVisualizer = musicVisualizer);

  constructor() {
    this.bindListeners();
    this.setMusicVisualizer(new MusicVisualizer());
  }

  private togglePlayback = async () => {
    const audioContext = this.getMusicVisualizer().getAudioContext()!;

    if (!audioContext) {
      await this.getMusicVisualizer().setupAudio(mp3Src);
      return;
    }

    if (audioContext.state === "running") {
      await audioContext.suspend();
    } else if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
  };

  private bindListeners = () => {
    playBtn.addEventListener("click", this.togglePlayback);

    window.addEventListener("unload", this.handleUnload);
  };

  private handleUnload = () => {
    playBtn.removeEventListener("click", this.togglePlayback);

    window.removeEventListener("unload", this.handleUnload);
  };
}
