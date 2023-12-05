import { MusicVisualizer } from "lib/music-visualizer";
import { State } from "vanjs-core";

export type FftSize = 32 | 64 | 128 | 256 | 512 | 1024 | 2048;

export interface Track {
  name: string;
  src: string;
}

export type ChangeTrackCallback = () => number;

export interface AppState {
  mv: State<MusicVisualizer>;
}
