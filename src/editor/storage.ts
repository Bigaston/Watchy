import { WGameDescription } from "../types/types";
import defaultGame from "./defaultGame.json?raw";

export function saveCode(code: string) {
  let game = loadGame();

  game.code = code;

  saveGame(game);
}

export function loadCode() {
  return JSON.parse(localStorage.getItem("game") || defaultGame).code;
}

export function saveGame(game: WGameDescription) {
  localStorage.setItem("game", JSON.stringify(game));

  console.log(game);
}

export function loadGame(): WGameDescription {
  return JSON.parse(localStorage.getItem("game") || defaultGame);
}

export function destroyStorage() {
  localStorage.setItem("game", defaultGame);

  window.location.reload();
}
