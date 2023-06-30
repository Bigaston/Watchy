import { WGameDescription } from "../types/types";
import defaultCode from "./default.lua?raw";
import defaultGame from "./defaultGame.json?raw";

export function saveCode(code: string) {
  localStorage.setItem("code", code);
}

export function loadCode() {
  return localStorage.getItem("code") || defaultCode;
}

export function saveGame(game: WGameDescription) {
  localStorage.setItem("game", JSON.stringify(game));
}

export function loadGame(): WGameDescription {
  return JSON.parse(localStorage.getItem("game") || defaultGame);
}
