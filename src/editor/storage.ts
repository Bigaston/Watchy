import { WGameDescription } from "../types/types";
import { isOkText } from "../utils";
import { defaultGame } from "./defaultGame";

const OFFUSCATE = true;

let GAME: WGameDescription;
let usedFileHandle: FileSystemFileHandle | undefined;

export function saveCode(code: string) {
  let game = loadGame();

  game.code = code;

  saveGame(game);
}

export function loadCode() {
  return JSON.parse(localStorage.getItem(`game`) || JSON.stringify(defaultGame))
    .code;
}

export function saveGame(game: WGameDescription) {
  GAME = game;
  localStorage.setItem(`game`, JSON.stringify(game));
}

export function loadGame(): WGameDescription {
  if (GAME) return GAME;

  return JSON.parse(
    localStorage.getItem(`game`) || JSON.stringify(defaultGame)
  );
}

export function destroyStorage() {
  localStorage.setItem(`game`, JSON.stringify(defaultGame));

  window.location.reload();
}

export function loadGameLocal() {
  return new Promise<void>((resolve, reject) => {
    if (window.showOpenFilePicker) {
      window
        .showOpenFilePicker({
          types: [
            {
              description: "Watchy Game",
              accept: { "text/watchy": [".watchy"] },
            },
          ],
        })
        .then((fileHandle) => {
          if (!fileHandle.length) {
            reject();
            return;
          }

          usedFileHandle = fileHandle[0];

          fileHandle[0].getFile().then((file) => {
            loadContentFromFile(file).then(() => {
              resolve();
            });
          });
        });
    } else {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = OFFUSCATE ? ".watchy" : ".json";

      input.addEventListener("change", () => {
        if (!input.files) {
          reject();
          return;
        }

        let file = input.files![0];

        loadContentFromFile(file).then(() => {
          resolve();
        });
      });

      input.click();
    }
  });
}

function loadContentFromFile(file: File) {
  return new Promise<void>((resolve, reject) => {
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
      resolve();
    };

    reader.onerror = () => {
      reject();
    };

    reader.readAsText(file);
  });
}

export function saveGameLocal() {
  let game = loadGame();
  let gameString = OFFUSCATE
    ? btoa(JSON.stringify(game))
    : JSON.stringify(game);

  if (usedFileHandle) {
    usedFileHandle
      .createWritable()
      .then((writer) => {
        writer.write(gameString);
        writer.close();
      })
      .then(() => {
        console.log("Saved");
      });
  } else {
    if (window.showSaveFilePicker !== undefined) {
      window
        .showSaveFilePicker({
          types: [
            {
              description: "Watchy Game",
              accept: { "text/watchy": [".watchy"] },
            },
          ],
        })
        .then((fileHandle) => {
          usedFileHandle = fileHandle;

          fileHandle
            .createWritable()
            .then((writer) => {
              writer.write(gameString);
              writer.close();
            })
            .then(() => {
              console.log("Saved");
            });
        });
    } else {
      let link = document.createElement("a");
      link.download = OFFUSCATE
        ? `${game.title}-${Date.now()}.watchy`
        : `${game.title}-${Date.now()}.json`;

      link.href = `data:text/text;charset=utf-8,${gameString}`;

      link.click();
    }
  }
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
