import van from "vanjs-core";

import { MusicVisualizer } from "music-visualizer/main";

import mp3Src from "assets/mp3/burn-water-nostalgia-dreams.mp3";

const { button, div } = van.tags;

export const Player = () => {
  const musicVisualizer = new MusicVisualizer();
  const audioContextState = van.state<AudioContextState | undefined>(undefined);
  const playbackStatus = van.derive(() => (audioContextState.val === "running" ? "Pause" : "Play"));

  const handlePrevious = async () => {};

  const handleNext = async () => {};

  const togglePlayback = async () => {
    const audioContext = musicVisualizer.getAudioContext();

    if (!audioContext) {
      await musicVisualizer.setupAudio(mp3Src);
    } else {
      switch (audioContext.state) {
        case "running":
          await audioContext.suspend();
          break;
        case "suspended":
          await audioContext.resume();
          break;
        default:
          break;
      }
    }
    audioContextState.val = musicVisualizer.getAudioContext()!.state;
  };

  return div(
    {
      class: "player",
    },
    button(
      {
        id: "previous",
        onclick: handlePrevious,
      },
      "Previous",
    ),
    button(
      {
        id: "play",
        onclick: togglePlayback,
      },
      playbackStatus,
    ),
    button(
      {
        id: "next",
        onclick: handleNext,
      },
      "Next",
    ),
  );
};
