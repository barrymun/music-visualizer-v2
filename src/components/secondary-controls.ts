import van from "vanjs-core";

import { App } from "lib/app";

import muteButtonSrc from "assets/img/volume.svg";
import muteXButtonSrc from "assets/img/volume-x.svg";

const { button, div, img, input } = van.tags;

let isDragging: boolean = false;

export const SecondaryControls = () => {
  const mv = App.getMusicVisualizer();

  const sliderValue = van.state<number>(mv.getDefaultGainValue()); // default gainNode.gain.value is 1
  const isMuted = van.derive<boolean>(() => sliderValue.val === 0);

  const toggleMute = (_event: Event) => {
    if (sliderValue.val === 0) {
      // check that the default gain value is not 0
      let newValue = mv.getDefaultGainValue();
      if (newValue === 0) newValue = 1;

      sliderValue.val = newValue;
      mv.getGainNode().gain.value = newValue;
    } else {
      // save the current volume setting
      mv.setDefaultGainValue(sliderValue.val);

      sliderValue.val = 0;
      if (mv.getGainNode()) {
        mv.getGainNode().gain.value = 0;
      } else {
        mv.setDefaultGainValue(0);
      }
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
    mv.setDefaultGainValue(inputValue);

    if (!mv.getAudioContext()) return;
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
      onmousemove: handleMouseMove,
      onmouseup: handleMouseUp,
      onchange: handleMouseUp,
    }),
  );
};
