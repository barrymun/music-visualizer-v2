import van from "vanjs-core";

import { App } from "lib/app";

const { div } = van.tags;

export const ArtistInfo = () => {
  const mv = App.getMusicVisualizer();
  const artistName = van.state<string>("🎹");

  setInterval(() => {
    artistName.val = mv.getCurrentTrack()?.name ?? "🎹";
  }, 100);

  return div(
    {
      class: "artist-info",
    },
    artistName,
  );
};
