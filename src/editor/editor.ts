import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as lua from "monaco-editor/esm/vs/basic-languages/lua/lua";
import { initEngine, stopEngine } from "../engine/engine";
import {
  duplicateSprite,
  initEditorView,
  resize as resizeEditor,
} from "./editorView";
import {
  buildGame,
  loadGame,
  loadGameLocal,
  saveAsGame,
  saveGame,
  saveGameLocal,
} from "./storage";

import "../styles/editor.css";

import { render } from "preact";
import { Main } from "./preact/Main";
import { onAddResourceListener } from "./preact/Listeners";
import { defaultGame } from "./defaultGame";

const rendererElement = document.getElementById("renderer")!;

let editor: monaco.editor.IStandaloneCodeEditor;

export function initEditor(editorContainer: HTMLElement) {
  monaco.languages.register({ id: "lua" });
  monaco.languages.setMonarchTokensProvider("lua", lua.language);
  monaco.languages.setLanguageConfiguration("lua", lua.conf);

  editor = monaco.editor.create(editorContainer, {
    value: loadGame().code,
    language: "lua",
    automaticLayout: true,
    theme: "vs-dark",
  });

  editor.onDidChangeModelContent(() => {
    saveGame({ ...loadGame(), code: editor.getValue() });
  });

  initEditorView();
  render(Main, document.getElementById("infoContainer")!);

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
    onAddResourceListener.trigger();
  });

  document.getElementById("save")!.addEventListener("click", saveGameLocal);

  document.getElementById("load")!.addEventListener("click", handleLoadGame);

  document.getElementById("build")!.addEventListener("click", buildGame);

  document.getElementById("openDoc")?.addEventListener("click", () => {
    window.open("./docs/");
  });

  if (window.showSaveFilePicker !== undefined) {
    document.getElementById("saveAs")!.addEventListener("click", saveAsGame);
  } else {
    document.getElementById("saveAs")!.style.display = "none";
  }

  document.getElementById("new")!.addEventListener("click", () => {
    if (confirm("Are you sure you want to start a new game?")) {
      saveGame(defaultGame);
      editor.setValue(defaultGame.code);
      rendererElement.innerHTML = "";

      initEditorView();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();

      saveGameLocal();
    }

    if (e.ctrlKey && e.key === "d") {
      e.preventDefault();

      duplicateSprite();
    }
  });
}

function handleLoadGame() {
  loadGameLocal().then(() => {
    editor.setValue(loadGame().code);

    rendererElement.innerHTML = "";
    initEditorView();
    resizeEditor();
  });
}
