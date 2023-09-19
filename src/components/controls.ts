import van from "vanjs-core";

import { Player } from "components/player";

const { div } = van.tags;

export const Controls = () => {
  return div(
    {
      class: "controls",
    },
    Player(),
  );
};
