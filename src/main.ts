import { Core2D5 } from "./model/core";
import { Game } from "./view/game";
import "./style.css";
import { Signals } from "./controller/gameSignals";
import url from "./goal.png?url";

let engine = new Core2D5(2);
let game = new Game(100, engine);
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

const goalImage = document.getElementById("goal-image") as HTMLImageElement;
goalImage.src = url;
console.log(url);

const sizeInput = document.getElementById("size-input") as HTMLInputElement;
const orderInput = document.getElementById("order-input") as HTMLInputElement;
function setView(){
  game.destroy();
  engine = new Core2D5(Number(orderInput.value));
  game = new Game(Number(sizeInput.value), engine);
  Signals.render.notify(engine);
}
sizeInput.addEventListener("change", setView);
orderInput.addEventListener("change", setView);