import van from "vanjs-core";

import { App } from "lib/app";

const { div } = van.tags;

export const SeekBar = () => {
  const elapsedTime = van.state<number>(0);
  const duration = van.state<number>(0);

  setInterval(() => {
    const musicVisualizer = App.getMusicVisualizer();
    elapsedTime.val = Math.round(musicVisualizer.getElapsedTime());
    duration.val = Math.round(musicVisualizer.getDuration());
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
