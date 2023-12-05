import van from "vanjs-core";

import { Controls } from "components/controls";
import { SecondaryControls } from "components/secondary-controls";
import { SongSelect } from "components/song-select";
import { Visualizer } from "components/visualizer";
import { appState } from "utils/state";

import "assets/css/main.css";

const dom = document.body as HTMLBodyElement;

van.add(dom, Visualizer());
van.add(dom, Controls());
van.add(dom, SecondaryControls());
van.add(dom, SongSelect());

const handleLoad = () => {
  const observer = new MutationObserver((mutationsList, _observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (appState.mv.val.visualizerCanvas) return;

        const canvas = document.getElementById("visualizer") as HTMLCanvasElement | null;
        if (!canvas) return;

        appState.mv.val.visualizerCanvas = canvas;
        appState.mv.val.visualizerCtx = canvas.getContext("2d")!;
        appState.mv.val.setCanvasSize();
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

const handleUnload = () => {
  window.removeEventListener("load", handleLoad);
  window.removeEventListener("unload", handleUnload);
};

window.addEventListener("load", handleLoad);
window.addEventListener("unload", handleUnload);
