import { Core2D5 } from "./model/core";
import { Game } from "./view/game";
import "./style.css";
import { Signals } from "./controller/gameSignals";

const engine = new Core2D5(2);
const game = new Game(100, engine);

Signals.render.notify(engine);

;(async function () {
  // engine.gridX[0][0].depth = 1;
  // engine.gridY[0][0].depth = 1;
  // engine.gridZ[0][0].depth = 1;

  // engine.gridX[0][1].depth = 1;
  // engine.gridY[0][1].depth = 1;
  // engine.gridZ[0][0].depth = 2;
  // engine.signals.render.notify(engine);
  // await new Promise(resolve => setTimeout(resolve, 1000));
  // game.dent(0,0,0);
  // await new Promise(resolve => setTimeout(resolve, 1000));
  // game.dent(0,0,1);
  // await new Promise(resolve => setTimeout(resolve, 1000));
  // game.jut(0,0,1);
  // game.concave(0,0,0);
})();