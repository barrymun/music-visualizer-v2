import { MusicVisualizer } from "music-visualizer/main";
import { playBtn } from "utils/elements";

import mp3Src from "assets/mp3/burn-water-nostalgia-dreams.mp3";

export class Player extends MusicVisualizer {
  constructor() {
    super();
    this.bindListeners();
  }

  private togglePlayback = async () => {
    const audioContext = this.getAudioContext();

    if (!audioContext) {
      await this.setupAudio(mp3Src);
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

  private handleUnload = (): void => {
    playBtn.removeEventListener("click", this.togglePlayback);

    window.removeEventListener("unload", this.handleUnload);
  };
}
