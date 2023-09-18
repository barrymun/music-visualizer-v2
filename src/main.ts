import van from "vanjs-core";

import { Player } from "components/player";

import "assets/style.css";

const dom = document.body as HTMLBodyElement;

van.add(dom, Player());
