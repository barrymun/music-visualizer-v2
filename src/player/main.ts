import { MusicVisualizer } from "music-visualizer/main";
import { playBtn } from "utils/elements";

export class Player extends MusicVisualizer {
  private isSourceInitialized = false;

  public getIsSourceInitialized = () => this.isSourceInitialized;

  private setIsSourceInitialized = (isSourceInitialized: boolean) => (this.isSourceInitialized = isSourceInitialized);

  constructor() {
    super();
    this.bindListeners();
  }

  private play = async () => {
    if (!this.getIsSourceInitialized()) {
      this.getSource().start();
      this.setIsSourceInitialized(true);
    }
    await this.getAudioContext().resume();
  };

  private pause = async () => {
    await this.getAudioContext().suspend();
  };

  private togglePlayback = async () => {
    console.log(this.getAudioContext().state);
    if (this.getAudioContext().state === "running") {
      await this.pause();
    } else if (this.getAudioContext().state === "suspended") {
      await this.play();
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
