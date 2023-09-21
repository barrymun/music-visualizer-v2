import van from "vanjs-core";

import { Controls } from "components/controls";
import { SecondaryControls } from "components/secondary-controls";
import { SongSelect } from "components/song-select";
import { Visualizer } from "components/visualizer";

import "assets/style.css";

const dom = document.body as HTMLBodyElement;

van.add(dom, Visualizer());
van.add(dom, Controls());
van.add(dom, SecondaryControls());
van.add(dom, SongSelect());
