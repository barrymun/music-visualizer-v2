import van from "vanjs-core";

import { App } from "lib/app";

import muteButtonSrc from "assets/img/volume.svg";
import muteXButtonSrc from "assets/img/volume-x.svg";

const { button, div, img, input } = van.tags;

let isDragging: boolean = false;

export const SecondaryControls = () => {
  const mv = App.getMusicVisualizer();

  const isMuted = van.state<"Play" | "Pause">("Play");
  const sliderValue = van.state<number>(1); // default gainNode.gain.value is 1

  const toggleMute = (_event: Event) => {};

  const handleMouseDown = (_event: Event) => {
    isDragging = true;
  };

  const handleMouseMove = (_event: Event) => {
    if (!isDragging) return;
  };

  const handleMouseUp = (event: Event) => {
    if (!mv.getAudioContext()) return;
    const inputValue = (event.target as HTMLInputElement).valueAsNumber ?? 0;
    sliderValue.val = inputValue;
    mv.getGainNode().gain.value = inputValue;
    isDragging = false;
  };

  return div(
    {
      class: "secondary-controls",
    },
    button(
      {
        id: "mute",
        onclick: toggleMute,
        class: "mute-btn",
      },
      () =>
        img({
          src: isMuted.val === "Play" ? muteXButtonSrc : muteButtonSrc,
        }),
    ),
    input({
      type: "range",
      min: "0",
      max: "1",
      step: "0.01",
      class: "secondary-controls-input",
      value: () => sliderValue.val,
      onmousedown: handleMouseDown,
      onmousemove: handleMouseMove,
      onmouseup: handleMouseUp,
    }),
  );
};
