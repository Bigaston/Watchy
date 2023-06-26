import { LuaFactory } from "wasmoon";
import * as PIXI from "pixi.js";
import { WGameDescription, WImage, WImageStatus } from "./types";
import { PALETTE } from "./colorPalette";
import { initInput } from "./input";

const factory = new LuaFactory();

const sprites: WImage[] = [];

export async function initEngine(
  code: string,
  gameDescription: WGameDescription
) {
  let lua = await factory.createEngine();

  lua.global.set("SET_ENABLED", setEnabled);

  initInput(lua);

  // PIXIJS
  const app = new PIXI.Application({
    width: 900,
    height: 600,
    background: 0xedb4a1,
  });

  document.body.appendChild(app.view as any as Node);

  // Create All Sprites
  gameDescription.images.forEach((image) => {
    let spr = new PIXI.Sprite(PIXI.Texture.from(image.path));

    spr.x = image.x;
    spr.y = image.y;
    spr.width = image.width;
    spr.height = image.height;

    spr.tint = PALETTE.OFF;

    sprites.push({
      id: image.id,
      name: image.name,
      sprite: spr,
      status: WImageStatus.OFF,
    });

    app.stage.addChild(spr);
  });

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

function setEnabled(idOrName: number | string, status: boolean) {
  const sprite = sprites.find((s) => {
    return s.id === idOrName || s.name === idOrName;
  });

  if (sprite != null) {
    sprite.status = status ? WImageStatus.ON : WImageStatus.OFF;
    sprite.sprite.tint = status ? PALETTE.ON : PALETTE.OFF;
  }
}
