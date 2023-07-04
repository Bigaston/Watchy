import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as lua from "monaco-editor/esm/vs/basic-languages/lua/lua";
import { initEngine, stopEngine } from "../engine/engine";
import { addSprite, initEditorView } from "./editorView";
import {
  buildGame,
  loadCode,
  loadGame,
  loadGameLocal,
  saveCode,
  saveGameLocal,
} from "./storage";

import "../styles/editor.css";
import { clearInfo } from "./contextualInfo";

const rendererElement = document.getElementById("renderer")!;

export function initEditor(editorContainer: HTMLElement) {
  monaco.languages.register({ id: "lua" });
  monaco.languages.setMonarchTokensProvider("lua", lua.language);
  monaco.languages.setLanguageConfiguration("lua", lua.conf);

  const editor = monaco.editor.create(editorContainer, {
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

    rendererElement.innerHTML = "";
    stopEngine();
    initEngine(game, rendererElement, true);
  });

  document.getElementById("stop")!.addEventListener("click", () => {
    stopEngine();
    rendererElement.innerHTML = "";

    initEditorView();
  });

  document.getElementById("addImage")!.addEventListener("click", () => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/svg+xml";

    input.addEventListener("change", () => {
      if (!input.files) return;

      addSprite(input.files![0]);
    });

    input.click();
  });

  document.getElementById("save")!.addEventListener("click", saveGameLocal);

  document.getElementById("load")!.addEventListener("click", loadGameLocal);

  document.getElementById("build")!.addEventListener("click", buildGame);
}
