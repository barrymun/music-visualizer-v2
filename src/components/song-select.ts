import van from "vanjs-core";
import { isNaN } from "lodash";

import { App } from "lib/app";
import { tracks } from "utils/constants";
import { Track } from "utils/types";

const { div, option, select } = van.tags;

export const SongSelect = () => {
  const mv = App.getMusicVisualizer();

  const currentTrack = van.state<Track | undefined>(mv.getCurrentTrack());

  setInterval(() => {
    currentTrack.val = mv.getCurrentTrack();
  }, 100);

  const handleChange = async (event: Event) => {
    const selectedValue = (event.target as HTMLSelectElement).value ?? 0;
    if (!selectedValue) {
      await mv.destroy();
      mv.setCurrentTrack(undefined);
      return;
    }

    const trackIndex: number = parseInt(selectedValue);
    if (isNaN(trackIndex) || trackIndex < 0 || trackIndex > tracks.length) {
      await mv.destroy();
      mv.setCurrentTrack(undefined);
      return;
    }

    await mv.changeTrack(trackIndex);
  };

  return div(
    {
      class: "song-select",
    },
    select(
      {
        onchange: handleChange,
      },
      option(
        {
          value: "",
        },
        "Select a song",
      ),
      tracks.map((track, index) => {
        return option(
          {
            value: index.toString(),
            selected: () => currentTrack.val?.name === track.name,
          },
          track.name,
        );
      }),
    ),
  );
};
