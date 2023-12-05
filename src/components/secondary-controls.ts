import van from "vanjs-core";

import { appState } from "utils/state";

import muteButtonSrc from "assets/img/volume.svg";
import muteXButtonSrc from "assets/img/volume-x.svg";

const { button, div, img, input } = van.tags;

let isDragging: boolean = false;

export const SecondaryControls = () => {
  const sliderValue = van.state<number>(appState.mv.val.defaultGainValue); // default gainNode.gain.value is 1
  const isMuted = van.derive<boolean>(() => sliderValue.val === 0);

  const toggleMute = (_event: Event) => {
    if (sliderValue.val === 0) {
      // currently muted, want to unmute
      let newValue = appState.mv.val.defaultGainValue;
      // check that the default gain value is not 0
      if (newValue === 0) newValue = 1;

      if (appState.mv.val.gainNode) {
        appState.mv.val.gainNode.gain.value = newValue;
      }

      sliderValue.val = newValue;
    } else {
      // want to mute
      // save the current volume setting
      appState.mv.val.defaultGainValue = sliderValue.val;

      if (appState.mv.val.gainNode) {
        appState.mv.val.gainNode.gain.value = 0;
      }

      sliderValue.val = 0;
    }
  };

  const handleMouseDown = (_event: Event) => {
    isDragging = true;
  };

  const handleMouseMove = (_event: Event) => {
    if (!isDragging) return;
  };

  const handleMouseUp = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).valueAsNumber ?? 0;

    // always set the default so if the user alters volume before
    // starting playback the selected volume will be used
    appState.mv.val.defaultGainValue = inputValue;

    sliderValue.val = inputValue;
    if (appState.mv.val.gainNode) {
      appState.mv.val.gainNode.gain.value = inputValue;
    }
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
          src: isMuted.val ? muteXButtonSrc : muteButtonSrc,
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
      ontouchstart: handleMouseDown,
      onmousemove: handleMouseMove,
      ontouchmove: handleMouseMove,
      onmouseup: handleMouseUp,
      ontouchend: handleMouseUp,
      onchange: handleMouseUp,
    }),
  );
};
