import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as lua from "monaco-editor/esm/vs/basic-languages/lua/lua";
import { initEngine, stopEngine } from "../engine/engine";
import {
  addSprite,
  initEditorView,
  resize as resizeEditor,
  addNumber,
} from "./editorView";
import {
  buildGame,
  loadCode,
  loadGame,
  loadGameLocal,
  saveAsGame,
  saveCode,
  saveGame,
  saveGameLocal,
} from "./storage";

import "../styles/editor.css";
import { clearInfo } from "./contextualInfo";
import { Modal } from "./modal";
import crel from "crel";
import { WNumberDescription, WSoundDescriptionJSFXR } from "../share/types";

const rendererElement = document.getElementById("renderer")!;

let editor: monaco.editor.IStandaloneCodeEditor;

export function initEditor(editorContainer: HTMLElement) {
  monaco.languages.register({ id: "lua" });
  monaco.languages.setMonarchTokensProvider("lua", lua.language);
  monaco.languages.setLanguageConfiguration("lua", lua.conf);

  editor = monaco.editor.create(editorContainer, {
    value: loadCode(),
    language: "lua",
    automaticLayout: true,
    theme: "vs-dark",
  });

  editor.onDidChangeModelContent(() => {
    saveCode(editor.getValue());
  });

  initEditorView();
  clearInfo();

  // Lauch game
  document.getElementById("run")!.addEventListener("click", () => {
    let game = loadGame();

    (document.getElementById("run")! as HTMLButtonElement).disabled = true;
    (document.getElementById("stop")! as HTMLButtonElement).disabled = false;

    rendererElement.innerHTML = "";
    stopEngine();
    initEngine(game, rendererElement, true);
  });

  document.getElementById("stop")!.addEventListener("click", () => {
    (document.getElementById("run")! as HTMLButtonElement).disabled = false;
    (document.getElementById("stop")! as HTMLButtonElement).disabled = true;

    stopEngine();
    rendererElement.innerHTML = "";

    initEditorView();
    resizeEditor();
  });

  document.getElementById("addResource")!.addEventListener("click", () => {
    let modal = new Modal();

    modal.setContent(
      crel(
        "div",
        crel("h2", "Add Ressource"),
        crel(
          "button",
          {
            class: "button-primary",
            onclick: () => addImage(modal),
          },
          "🖼️ Add Sprite"
        ),
        crel(
          "button",
          {
            class: "button-primary",
            onclick: () => addSound(modal),
          },
          "🎵 Add Sound"
        ),
        crel(
          "button",
          {
            class: "button-primary",
            onclick: () => addText(modal),
          },
          "📝 Add Text"
        )
      )
    );
  });

  document.getElementById("save")!.addEventListener("click", saveGameLocal);

  document.getElementById("load")!.addEventListener("click", handleLoadGame);

  document.getElementById("build")!.addEventListener("click", buildGame);

  if (window.showSaveFilePicker !== undefined) {
    document.getElementById("saveAs")!.addEventListener("click", saveAsGame);
  } else {
    document.getElementById("saveAs")!.style.display = "none";
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();

      saveGameLocal();
    }
  });
}

function handleLoadGame() {
  loadGameLocal().then(() => {
    clearInfo();

    editor.setValue(loadCode());

    rendererElement.innerHTML = "";
    initEditorView();
    resizeEditor();
  });
}

function addImage(modal: Modal) {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = "image/svg+xml";

  input.addEventListener("change", () => {
    if (!input.files) return;

    modal.close();

    addSprite(input.files![0]);
  });

  input.click();
}

function addSound(modal: Modal) {
  modal.close();

  let modalSound = new Modal();
  modalSound.setContent(
    crel(
      "div",
      crel("h2", "Add Sound"),
      crel(
        "p",
        "Watchy use ",
        crel("a", { href: "https://sfxr.me/", target: "_blank" }, "JSFXR"),
        " to generate sound. You can past the code generated by JSFXR here:"
      ),
      crel("label", "Sound Name"),
      crel("input", {
        type: "text",
        id: "soundName",
        style: "width: 100%;",
      }),
      crel("label", "Sound code"),
      crel("input", {
        type: "text",
        id: "soundCode",
        style: "width: 100%;margin-bottom: 10px",
      }),
      crel(
        "button",
        { class: "button-primary", onclick: () => handleAddSound(modalSound) },
        "Add Sound"
      )
    )
  );
}

function handleAddSound(modal: Modal) {
  let codeValue = (document.getElementById("soundCode") as HTMLInputElement)
    .value;
  let nameValue = (document.getElementById("soundName") as HTMLInputElement)
    .value;

  console.log(codeValue);

  let game = loadGame();

  let sound: WSoundDescriptionJSFXR = {
    type: "jsfxr",
    content: codeValue,
    id: game.nextAvailableSoundId,
    name: nameValue,
  };

  game.sounds.push(sound);
  game.nextAvailableSoundId++;

  saveGame(game);

  clearInfo();
  modal.close();
}

function addText(modal: Modal) {
  modal.close();

  let wNumber: WNumberDescription = {
    id: loadGame().nextAvailableNumberId,
    name: "Text" + loadGame().nextAvailableNumberId,
    x: 0,
    y: 0,
    height: 30,
    numberDigit: 5,
  };

  saveGame({
    ...loadGame(),
    nextAvailableNumberId: loadGame().nextAvailableNumberId + 1,
    numbers: loadGame().numbers.concat(wNumber),
  });

  addNumber(wNumber);
}
