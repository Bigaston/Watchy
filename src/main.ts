import "./styles.css";

import { initEngine } from "./engine/engine";
import { WGameDescription } from "./engine/types/types";
import { isOk, isOkText } from "./utils";

fetch("/game.json")
  .then(isOk)
  .then((game: WGameDescription) => {
    fetch(game.code)
      .then(isOkText)
      .then((code) => {
        initEngine(code, game);
      });
  });
