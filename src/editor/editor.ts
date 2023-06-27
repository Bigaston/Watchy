import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as lua from "monaco-editor/esm/vs/basic-languages/lua/lua";
import defaultCode from "./default.lua?raw";
import { isOk } from "../utils";
import { WGameDescription } from "../engine/types/types";
import { initEngine, stopEngine } from "../engine/engine";

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

  document.getElementById("run")!.addEventListener("click", () => {
    let code = editor.getValue();

    fetch("/game.json")
      .then(isOk)
      .then((game: WGameDescription) => {
        stopEngine();
        initEngine(code, game, document.getElementById("renderer")!);
      });
  });

  document.getElementById("stop")!.addEventListener("click", () => {
    stopEngine();
  });
}

function saveCode(code: string) {
  localStorage.setItem("code", code);
}

function loadCode() {
  return localStorage.getItem("code") || defaultCode;
}
