import { WGameDescription } from "../share/types";
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
  setHasNotBeenSaved();
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
          updateGameTitle(fileHandle[0].name);

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

      if (game.descriptionVersion !== defaultGame.descriptionVersion) {
        alert(
          "This game was created with an older version of Watchy. Some features may not work as expected. We tried to feed the file with the default values."
        );

        game = { ...defaultGame, ...game };
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

function generateGameString() {
  let game = loadGame();
  let gameString = OFFUSCATE
    ? btoa(JSON.stringify(game))
    : JSON.stringify(game);

  return gameString;
}

export function saveGameLocal() {
  let game = loadGame();
  let gameString = generateGameString();

  if (usedFileHandle) {
    usedFileHandle
      .createWritable()
      .then((writer) => {
        writer.write(gameString);
        writer.close();
      })
      .then(() => {
        console.log("Saved");
        setHasBeenSaved();
      });
  } else {
    if (window.showSaveFilePicker !== undefined) {
      openSaveAsPicker(gameString);
    } else {
      let link = document.createElement("a");
      link.download = OFFUSCATE
        ? `${game.title}-${Date.now()}.watchy`
        : `${game.title}-${Date.now()}.json`;

      link.href = `data:text/text;charset=utf-8,${gameString}`;

      link.click();
      setHasBeenSaved();
    }
  }
}

export function saveAsGame() {
  let gameString = generateGameString();

  openSaveAsPicker(gameString);
}

function openSaveAsPicker(gameString: string) {
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

      updateGameTitle(fileHandle.name);

      fileHandle
        .createWritable()
        .then((writer) => {
          writer.write(gameString);
          writer.close();
        })
        .then(() => {
          setHasBeenSaved();
          console.log("Saved");
        });
    });
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
      link.download = `Watchy-${game.title}.html`;

      link.href = `data:text/html;charset=utf-8,${encodeURIComponent(outDoc)}`;

      link.click();
    });
}

function updateGameTitle(gameTitle: string) {
  document.getElementById("gameTitle")!.innerText = gameTitle;
}

let hasBeenSaved = true;

function setHasNotBeenSaved() {
  if (!hasBeenSaved) return;

  document.getElementById("gameTitle")!.innerText += "*";
  hasBeenSaved = false;
}

function setHasBeenSaved() {
  if (!hasBeenSaved) {
    document.getElementById("gameTitle")!.innerText = document
      .getElementById("gameTitle")!
      .innerText.replace("*", "");

    hasBeenSaved = true;
  }
}
