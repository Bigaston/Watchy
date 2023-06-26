import { LuaFactory } from "wasmoon";

const factory = new LuaFactory();

export function initEngine(code: string) {
  factory.createEngine().then((lua) => {
    lua.doString(code).then(() => {
      const init = lua.global.get("INIT");
      const update = lua.global.get("UPDATE");
      const draw = lua.global.get("DRAW");

      if (init != null && typeof init === "function") {
        init();
      }

      updateEngine(update, draw);
    });
  });
}

function updateEngine(updateFunction: Function, drawFunction: Function) {
  updateFunction();
  drawFunction();

  requestAnimationFrame(() => {
    updateEngine(updateFunction, drawFunction);
  });
}
