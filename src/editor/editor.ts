import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as lua from "monaco-editor/esm/vs/basic-languages/lua/lua";
import { isOk } from "../utils";
import { WGameDescription } from "../types/types";
import { initEngine, stopEngine } from "../engine/engine";
import { initEditorView } from "./editorView";
import { loadCode, saveCode } from "./storage";

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

    fetch("./game.json")
      .then(isOk)
      .then((game: WGameDescription) => {
        stopEngine();
        initEngine(code, game, rendererElement);
      });
  });

  document.getElementById("stop")!.addEventListener("click", () => {
    stopEngine();
  });
}
