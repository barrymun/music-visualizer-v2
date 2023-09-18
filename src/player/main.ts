import van from "vanjs-core";

import { MusicVisualizer } from "music-visualizer/main";

import mp3Src from "assets/mp3/burn-water-nostalgia-dreams.mp3";

const { button, div } = van.tags;

export const Player = () => {
  const musicVisualizer = new MusicVisualizer();

  const togglePlayback = async () => {
    const audioContext = musicVisualizer.getAudioContext()!;

    if (!audioContext) {
      await musicVisualizer.setupAudio(mp3Src);
      return;
    }

    if (audioContext.state === "running") {
      await audioContext.suspend();
    } else if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
  };

  return div(
    {
      class: "player",
    },
    button(
      {
        id: "play",
        onclick: togglePlayback,
      },
      "Play",
    ),
  );
};
