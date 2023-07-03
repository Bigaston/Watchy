import "./styles/styles.css";
import "./styles/engine.css";
import { initEngine } from "./engine/engine";
import { WGameDescription } from "./types/types";

let editorContainer = document.getElementById("renderer")!;

let gameEncoded = document.getElementById("GAME_DATA")!.innerText.trim();
let game = JSON.parse(atob(gameEncoded)) as WGameDescription;

console.log(game);

initEngine(game, editorContainer);
