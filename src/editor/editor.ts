import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as lua from "monaco-editor/esm/vs/basic-languages/lua/lua";
import { initEngine, stopEngine } from "../engine/engine";
import { addSprite, initEditorView } from "./editorView";
import { destroyStorage, loadCode, loadGame, saveCode } from "./storage";

import "../styles/editor.css";

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

  // Lauch game
  document.getElementById("run")!.addEventListener("click", () => {
    let code = editor.getValue();
    let game = loadGame();

    rendererElement.innerHTML = "";
    stopEngine();
    initEngine(code, game, rendererElement);
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

  document.getElementById("resetCache")!.addEventListener("click", () => {
    destroyStorage();
  });
}
