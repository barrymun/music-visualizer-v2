import van from "vanjs-core";

import { App } from "lib/app";
import { secondsToMinSec } from "utils/helpers";

const { div } = van.tags;

export const SeekBar = () => {
  const elapsedTime = van.state<string>("0:00");
  const duration = van.state<string>("0:00");

  setInterval(() => {
    const musicVisualizer = App.getMusicVisualizer();
    elapsedTime.val = secondsToMinSec(musicVisualizer.getElapsedTime());
    duration.val = secondsToMinSec(musicVisualizer.getDuration());
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
    div({
      class: "seek-bar-line",
    }),
    div(
      {
        class: "total-time",
      },
      duration,
    ),
  );
};
