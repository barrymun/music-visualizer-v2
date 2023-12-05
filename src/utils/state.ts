import van from "vanjs-core";

import { AppState } from "utils/types";
import { App } from "lib/app";
import { MusicVisualizer } from "lib/music-visualizer";

export const appState: AppState = {
  mv: van.state<MusicVisualizer>(App.getMusicVisualizer()),
};
