import { LuaEngine } from "wasmoon";

export let _isPaused = false;

export function initSystem(
  lua: LuaEngine,
  functionObject: { [key: string]: Function }
) {
  functionObject["pause"] = pause;
  functionObject["resume"] = resume;
  functionObject["isPaused"] = isPaused;
  functionObject["load"] = load;
  functionObject["save"] = save;

  _isPaused = false;

  function pause() {
    _isPaused = true;
    lua.global.set("isPaused", true);
  }
  function resume() {
    _isPaused = false;
    lua.global.set("isPaused", false);
  }

  function isPaused() {
    return isPaused;
  }
}

function load(key: string): string {
  let value = localStorage.getItem("game-" + key);

  if (value == null) return "";

  return value;
}

function save(key: string, value: string) {
  localStorage.setItem("game-" + key, value);
}
