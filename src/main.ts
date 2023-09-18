import van from "vanjs-core";

import { Player } from "player/main";

import "assets/style.css";

const dom = document.body as HTMLBodyElement;

van.add(dom, Player());
