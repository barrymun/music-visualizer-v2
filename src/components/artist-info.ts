import van from "vanjs-core";

import { App } from "lib/app";
import { noArtistName } from "utils/constants";

const { div } = van.tags;

export const ArtistInfo = () => {
  const mv = App.getMusicVisualizer();
  const artistName = van.state<string>(noArtistName);

  setInterval(() => {
    artistName.val = mv.currentTrack?.name ?? noArtistName;
  }, 100);

  return div(
    {
      class: "artist-info",
    },
    artistName,
  );
};
