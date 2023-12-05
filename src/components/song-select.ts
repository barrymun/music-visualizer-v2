import van from "vanjs-core";
import { isNaN } from "lodash";

import { tracks } from "utils/constants";
import { appState } from "utils/state";
import { Track } from "utils/types";

const { div, option, select } = van.tags;

export const SongSelect = () => {
  const currentTrack = van.state<Track | undefined>(appState.mv.val.currentTrack);

  setInterval(() => {
    currentTrack.val = appState.mv.val.currentTrack;
  }, 100);

  const handleChange = async (event: Event) => {
    const selectedValue = (event.target as HTMLSelectElement).value ?? 0;
    if (!selectedValue) {
      await appState.mv.val.destroy();
      appState.mv.val.currentTrack = undefined;
      return;
    }

    const trackIndex: number = parseInt(selectedValue);
    if (isNaN(trackIndex) || trackIndex < 0 || trackIndex > tracks.length) {
      await appState.mv.val.destroy();
      appState.mv.val.currentTrack = undefined;
      return;
    }

    await appState.mv.val.changeTrack(trackIndex);
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
