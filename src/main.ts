import van from "vanjs-core";

import { Player } from "components/player";
import { Visualizer } from "components/visualizer";

import "assets/style.css";

const dom = document.body as HTMLBodyElement;

van.add(dom, Visualizer());
van.add(dom, Player());
