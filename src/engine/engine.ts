import { LuaFactory } from "wasmoon";
import * as PIXI from "pixi.js";

const factory = new LuaFactory();

export async function initEngine(code: string) {
  let lua = await factory.createEngine();
  await lua.doString(code);

  // Get the three main functions we need here in TypeScript
  const init = lua.global.get("INIT");
  const update = lua.global.get("UPDATE");
  const draw = lua.global.get("DRAW");

  // If init is a function, call it
  if (init != null && typeof init === "function") {
    init();
  }

  // PIXIJS
  const app = new PIXI.Application({
    width: 900,
    height: 600,
    background: 0xedb4a1,
  });

  document.body.appendChild(app.view as any as Node);

  app.ticker.add((delta) => {
    update(delta);
    draw();
  });
}
