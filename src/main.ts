import { initEngine } from "./engine/engine";
import { WGameDescription } from "./engine/types";
import { isOk, isOkText } from "./utils";

fetch("/code.lua")
  .then(isOkText)
  .then((code) => {
    fetch("/game.json")
      .then(isOk)
      .then((game: WGameDescription) => {
        initEngine(code, game);
      });
  });
