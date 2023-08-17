import "./styles/styles.css";
import "./styles/engine.css";
import { initEngine } from "./engine/engine";
import { WGameDescription } from "./share/types";

let editorContainer = document.getElementById("renderer")!;

console.log(window.location.hash);

if (window.location.hash) {
  let hash = window.location.hash.substring(1);
  let hashQuery = new URLSearchParams(hash);

  let gameFileURL = hashQuery.get("gameFileURL");
  if (gameFileURL) {
    fetch(gameFileURL)
      .then((response) => response.text())
      .then((text) => {
        let game = JSON.parse(atob(text)) as WGameDescription;

        initEngine(game, editorContainer);
      });
  }
} else {
  let gameEncoded = document.getElementById("GAME_DATA")!.innerText.trim();
  let game = JSON.parse(atob(gameEncoded)) as WGameDescription;

  initEngine(game, editorContainer);
}
