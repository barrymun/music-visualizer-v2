import van from "vanjs-core";

import { tracks } from "utils/constants";
import { appState } from "utils/state";

import playBtnSrc from "assets/img/play.svg";
import pauseBtnSrc from "assets/img/pause.svg";
import previousBtnSrc from "assets/img/previous.svg";
import nextBtnSrc from "assets/img/next.svg";

const { button, div, img } = van.tags;

export const Player = () => {
  const playbackStatus = van.state<"Play" | "Pause">("Play");

  setInterval(() => {
    if (appState.mv.val.isEnded()) {
      playbackStatus.val = "Play";
      return;
    }
    playbackStatus.val = appState.mv.val.audioContext?.state === "running" ? "Pause" : "Play";
  }, 100);

  const handlePrevious = async () => {
    if (appState.mv.val.getPlaybackTime() > 5) {
      await appState.mv.val.playFromOffset(0);
      return;
    }

    const trackIndex = tracks.findIndex((track) => track.name === appState.mv.val.currentTrack?.name);
    appState.mv.val.changeTrack(trackIndex > 0 ? trackIndex - 1 : tracks.length - 1);
  };

  const handleNext = async () => {
    const trackIndex = tracks.findIndex((track) => track.name === appState.mv.val.currentTrack?.name);
    appState.mv.val.changeTrack(trackIndex < tracks.length - 1 ? trackIndex + 1 : 0);
  };

  const togglePlayback = async () => {
    const audioContext = appState.mv.val.audioContext;

    if (!audioContext) {
      await appState.mv.val.setupAudio();
      return;
    }

    if (appState.mv.val.isEnded()) {
      await appState.mv.val.playFromOffset(0);
      await audioContext.resume();
      return;
    }

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
