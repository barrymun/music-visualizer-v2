import van from "vanjs-core";

import { noArtistName } from "utils/constants";
import { appState } from "utils/state";

const { div } = van.tags;

export const ArtistInfo = () => {
  const artistName = van.state<string>(noArtistName);

  setInterval(() => {
    artistName.val = appState.mv.val.currentTrack?.name ?? noArtistName;
  }, 100);

  return div(
    {
      class: "artist-info",
    },
    artistName,
  );
};
