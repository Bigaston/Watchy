import { LuaFactory } from "wasmoon";
import * as PIXI from "pixi.js";
import { WGameDescription } from "./types/types";
import { initInput } from "./input";
import { initDisplay } from "./display";

const factory = new LuaFactory();

export async function initEngine(
  code: string,
  gameDescription: WGameDescription
) {
  let lua = await factory.createEngine();

  // PIXIJS
  const app = new PIXI.Application({
    width: 900,
    height: 600,
    background: 0xedb4a1,
  });

  document.body.appendChild(app.view as any as Node);

  initInput(lua);
  initDisplay(lua, app, gameDescription);

  // Execute Lua Code
  await lua.doString(code);

  // Get the three main functions we need here in TypeScript
  const init = lua.global.get("INIT");
  const update = lua.global.get("UPDATE");
  const draw = lua.global.get("DRAW");

  // If init is a function, call it
  if (init != null && typeof init === "function") {
    init();
  }

  app.ticker.add((delta) => {
    update(delta);
    draw();
  });
}
