import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as lua from "monaco-editor/esm/vs/basic-languages/lua/lua";
import { initEngine, stopEngine } from "../engine/engine";
import { initEditorView, resize as resizeEditor } from "./editorView";
import {
  buildGame,
  loadCode,
  loadGame,
  loadGameLocal,
  saveAsGame,
  saveCode,
  saveGameLocal,
} from "./storage";

import "../styles/editor.css";

import { render } from "preact";
import { Main } from "./preact/Main";
import { onAddResourceListener, refreshGameListener } from "./preact/Listeners";

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
    refreshGameListener.trigger();

    editor.setValue(loadCode());

    rendererElement.innerHTML = "";
    initEditorView();
    resizeEditor();
  });
}
