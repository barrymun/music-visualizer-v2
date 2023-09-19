import van from "vanjs-core";

import { Player } from "components/player";
import { SeekBar } from "components/seek-bar";

const { div } = van.tags;

export const Controls = () => {
  return div(
    {
      class: "controls",
    },
    Player(),
    SeekBar(),
  );
};
