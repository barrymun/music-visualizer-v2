import van from "vanjs-core";

import { App } from "lib/app";

import playBtnSrc from "assets/img/play.svg";
import pauseBtnSrc from "assets/img/pause.svg";
import previousBtnSrc from "assets/img/previous.svg";
import nextBtnSrc from "assets/img/next.svg";

const { button, div, img } = van.tags;

export const Player = () => {
  const mv = App.getMusicVisualizer();

  const playbackStatus = van.state<"Play" | "Pause">("Play");

  setInterval(() => {
    playbackStatus.val = mv.getAudioContext()?.state === "running" ? "Pause" : "Play";
  }, 100);

  const handlePrevious = async () => {};

  const handleNext = async () => {};

  const togglePlayback = async () => {
    const audioContext = mv.getAudioContext();

    if (!audioContext) {
      await mv.setupAudio();
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
  };

  return div(
    {
      class: "player",
    },
    button(
      {
        disabled: true,
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
        disabled: true,
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
