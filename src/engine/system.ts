import { LuaEngine } from "wasmoon";

export let isPaused = false;

export function initSystem(lua: LuaEngine) {
  lua.global.set("PAUSE", pause);
  lua.global.set("RESUME", resume);

  function pause() {
    isPaused = true;
    lua.global.set("IS_PAUSED", true);
  }
  function resume() {
    isPaused = false;
    lua.global.set("IS_PAUSED", false);
  }
}
