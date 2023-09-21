import van from "vanjs-core";

import { Player } from "components/player";
import { SeekBar } from "components/seek-bar";
import { ArtistInfo } from "components/artist-info";

const { div } = van.tags;

export const Controls = () => {
  return div(
    {
      class: "controls",
    },
    Player(),
    SeekBar(),
    ArtistInfo(),
  );
};
