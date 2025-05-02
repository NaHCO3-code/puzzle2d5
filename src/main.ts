import { Core2D5 } from "./model/core";
import { Game } from "./view/game";
import "./style.css";
import { Signals } from "./controller/gameSignals";

const engine = new Core2D5(2);
new Game(100, engine);

Signals.render.notify(engine);
