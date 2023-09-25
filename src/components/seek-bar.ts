import van from "vanjs-core";
import { isNaN, isFinite } from "lodash";

import { App } from "lib/app";
import { secondsToMinSec } from "utils/helpers";

const { div, input } = van.tags;

let isDragging: boolean = false;

export const SeekBar = () => {
  const mv = App.getMusicVisualizer();

  const elapsedTime = van.state<string>("0:00");
  const duration = van.state<string>("0:00");
  const sliderValue = van.state<number>(0);

  setInterval(() => {
    if (isDragging) return;
    const d = mv.duration;
    const pt = mv.getPlaybackTime();
    duration.val = secondsToMinSec(d);
    elapsedTime.val = secondsToMinSec(pt);
    const leftVal = (pt / d) * 100;
    sliderValue.val = isNaN(leftVal) || !isFinite(leftVal) ? 0 : leftVal;
  }, 100);

  const handleMouseDown = (_event: Event) => {
    isDragging = true;
  };

  const handleMouseMove = (_event: Event) => {
    if (!isDragging) return;
  };

  const handleMouseUp = async (event: Event) => {
    if (!mv.audioContext) {
      await mv.setupAudio();
      // don't start the player if the user slides the seek bar before pressing play
      await mv.audioContext!.suspend();
    }

    const inputValue = (event.target as HTMLInputElement).valueAsNumber ?? 0;

    const d = mv.duration;
    const pt = (inputValue / 100) * d;
    duration.val = secondsToMinSec(d);
    elapsedTime.val = secondsToMinSec(pt);
    sliderValue.val = inputValue;
    mv.playFromOffset(pt);
    isDragging = false;
  };

  return div(
    {
      class: "seek-bar",
    },
    div(
      {
        class: "elapsed-time",
      },
      elapsedTime,
    ),
    input({
      type: "range",
      min: "0",
      max: "100",
      step: "0.01",
      class: "seek-bar-input",
      value: () => sliderValue.val,
      onmousedown: handleMouseDown,
      ontouchstart: handleMouseDown,
      onmousemove: handleMouseMove,
      ontouchmove: handleMouseMove,
      onmouseup: handleMouseUp,
      ontouchend: handleMouseUp,
    }),
    div(
      {
        class: "total-time",
      },
      duration,
    ),
  );
};
