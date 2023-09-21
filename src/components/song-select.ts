import van from "vanjs-core";
import { isNaN } from "lodash";

import { App } from "lib/app";
import { tracks } from "utils/constants";

const { div, option, select } = van.tags;

export const SongSelect = () => {
  const mv = App.getMusicVisualizer();

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

    await mv.destroy();
    mv.setCurrentTrack(tracks[trackIndex]);
    await mv.setupAudio(tracks[trackIndex]);
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
          },
          track.name,
        );
      }),
    ),
  );
};
