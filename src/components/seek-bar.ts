import van from "vanjs-core";

import { App } from "lib/app";
import { secondsToMinSec } from "utils/helpers";

const { div } = van.tags;

export const SeekBar = () => {
  const elapsedTime = van.state<string>("0:00");
  const duration = van.state<string>("0:00");
  const left = van.state<number>(0);

  setInterval(() => {
    const musicVisualizer = App.getMusicVisualizer();
    const a = musicVisualizer.getElapsedTime();
    const b = musicVisualizer.getDuration();
    elapsedTime.val = secondsToMinSec(a);
    duration.val = secondsToMinSec(b);
    left.val = (a / b) * 100;
  }, 100);

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
    div(
      {
        class: "seek-bar-track",
      },
      div({
        class: "seek-bar-thumb",
        style: () => `left: ${left.val}%;`,
      }),
    ),
    div(
      {
        class: "total-time",
      },
      duration,
    ),
  );
};
