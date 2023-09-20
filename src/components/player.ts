import van from "vanjs-core";

import { App } from "lib/app";

import mp3Src from "assets/mp3/burn-water-nostalgia-dreams.mp3";
import playBtnSrc from "assets/img/play.svg";
import pauseBtnSrc from "assets/img/pause.svg";
import previousBtnSrc from "assets/img/previous.svg";
import nextBtnSrc from "assets/img/next.svg";

const { button, div, img } = van.tags;

export const Player = () => {
  const musicVisualizer = App.getMusicVisualizer();
  const audioContextState = van.state<AudioContextState | undefined>(undefined);
  const playbackStatus = van.derive(() => (audioContextState.val === "running" ? "Pause" : "Play"));

  const handlePrevious = async () => {};

  const handleNext = async () => {
    musicVisualizer.playFromOffset(30);
  };

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
        class: "player-btn",
      },
      img({
        src: previousBtnSrc,
      }),
    ),
    button(
      {
        id: "play",
        onclick: togglePlayback,
        class: "player-btn",
      },
      () =>
        img({
          src: playbackStatus.val === "Play" ? playBtnSrc : pauseBtnSrc,
        }),
    ),
    button(
      {
        id: "next",
        onclick: handleNext,
        class: "player-btn",
      },
      img({
        src: nextBtnSrc,
      }),
    ),
  );
};
