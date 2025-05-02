import { Core2D5 } from "./model/core";
import { Game } from "./view/game";
import "./style.css";
import { Signals } from "./controller/gameSignals";

const engine = new Core2D5(2);
const game = new Game(100, engine);
Signals.render.notify(engine);

const aboutDialog = document.getElementById("about-dialog") as HTMLDialogElement;
const aboutButton = document.getElementById("about-button") as HTMLButtonElement;
const closeButton = document.getElementById("close-about") as HTMLButtonElement;
aboutButton.addEventListener("click", () => {
  aboutDialog.showModal();
});
closeButton.addEventListener("click", () => {
  aboutDialog.close();
});

const resetButton = document.getElementById("reset-button") as HTMLButtonElement;
resetButton.addEventListener("click", () => {
  game.reset();
})