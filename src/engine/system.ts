import { LuaEngine } from "wasmoon";

export let isPaused = false;

export function initSystem(
  lua: LuaEngine,
  functionObject: { [key: string]: Function }
) {
  functionObject["pause"] = pause;
  functionObject["resume"] = resume;

  lua.global.set("is_paused", false);

  function pause() {
    isPaused = true;
    lua.global.set("is_paused", true);
  }
  function resume() {
    isPaused = false;
    lua.global.set("is_paused", false);
  }
}
