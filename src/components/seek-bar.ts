import van from "vanjs-core";
import { isNaN, isFinite } from "lodash";

import { App } from "lib/app";
import { secondsToMinSec } from "utils/helpers";

const { div, input } = van.tags;

let isDragging: boolean = false;

export const SeekBar = () => {
  const elapsedTime = van.state<string>("0:00");
  const duration = van.state<string>("0:00");
  const left = van.state<number>(0);

  setInterval(() => {
    if (isDragging) return;
    const mv = App.getMusicVisualizer();
    const d = mv.getDuration();
    const pt = mv.getPlaybackTime();
    duration.val = secondsToMinSec(d);
    elapsedTime.val = secondsToMinSec(pt);
    const leftVal = (pt / d) * 100;
    left.val = isNaN(leftVal) || !isFinite(leftVal) ? 0 : leftVal;
  }, 100);

  const handleMouseDown = (_event: Event) => {
    isDragging = true;
  };

  const handleMouseMove = (_event: Event) => {
    if (!isDragging) return;
  };

  const handleMouseUp = (event: Event) => {
    const leftVal = (event.target as HTMLInputElement).valueAsNumber ?? 0;

    const mv = App.getMusicVisualizer();
    const d = mv.getDuration();
    const pt = (leftVal / 100) * d;
    duration.val = secondsToMinSec(d);
    elapsedTime.val = secondsToMinSec(pt);
    left.val = leftVal;
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
      value: () => left.val,
      class: "seek-bar-input",
      onmousedown: handleMouseDown,
      onmousemove: handleMouseMove,
      onmouseup: handleMouseUp,
    }),
    div(
      {
        class: "total-time",
      },
      duration,
    ),
  );
};
