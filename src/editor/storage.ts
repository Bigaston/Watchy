import { WGameDescription, WGameList } from "../types/types";
import { isOkText } from "../utils";
import { defaultGame } from "./defaultGame";

const OFFUSCATE = true;

let GAME: WGameDescription;

export function saveCode(code: string) {
  let game = loadGame();

  game.code = code;

  saveGame(game);
}

export function loadCode() {
  return JSON.parse(
    localStorage.getItem(`game-${currentGameId}`) || JSON.stringify(defaultGame)
  ).code;
}

export function saveGame(game: WGameDescription) {
  GAME = game;
  localStorage.setItem(`game-${currentGameId}`, JSON.stringify(game));
}

export function loadGame(): WGameDescription {
  if (GAME) return GAME;

  return JSON.parse(
    localStorage.getItem(`game-${currentGameId}`) || JSON.stringify(defaultGame)
  );
}

export function destroyStorage() {
  localStorage.setItem(`game-${currentGameId}`, JSON.stringify(defaultGame));

  window.location.reload();
}

export function loadGameLocal() {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = OFFUSCATE ? ".watchy" : ".json";

  input.addEventListener("change", () => {
    if (!input.files) return;

    let file = input.files![0];

    let reader = new FileReader();

    reader.onload = () => {
      let gameString = reader.result as string;

      let game: WGameDescription;

      if (OFFUSCATE) {
        game = JSON.parse(atob(gameString));
      } else {
        game = JSON.parse(gameString);
      }

      saveGame(game);
      window.location.reload();
    };

    reader.readAsText(file);
  });

  input.click();
}

export function saveGameLocal() {
  let game = loadGame();
  let gameString = OFFUSCATE
    ? btoa(JSON.stringify(game))
    : JSON.stringify(game);

  let link = document.createElement("a");
  link.download = OFFUSCATE
    ? `game-${Date.now()}.watchy`
    : `game-${Date.now()}.json`;

  link.href = `data:text/text;charset=utf-8,${gameString}`;

  link.click();
}

export function buildGame() {
  let game = loadGame();
  let gameString = btoa(JSON.stringify(game));

  fetch("./watchy.html")
    .then(isOkText)
    .then((engine) => {
      let outDoc = engine.replace("{{GAME_DATA}}", gameString);

      console.log(outDoc);

      let link = document.createElement("a");
      link.download = `Watchy-${Date.now()}.html`;

      link.href = `data:text/html;charset=utf-8,${encodeURIComponent(outDoc)}`;

      link.click();
    });
}

export let nextAvailableGameId = 1;
let currentGameId = 0;

export function setCurrentGameId(id: number) {
  currentGameId = id;
}

export function loadGameList(): WGameList[] {
  nextAvailableGameId = parseInt(
    localStorage.getItem("nextAvailableGameId") || "1"
  );

  return JSON.parse(
    localStorage.getItem("gameList") || `[{"id": 0, "name": "My Watchy Game"}]`
  );
}
