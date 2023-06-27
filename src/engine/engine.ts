import { LuaFactory } from "wasmoon";
import * as PIXI from "pixi.js";
import { WGameDescription } from "./types/types";
import { initInput } from "./input";
import { initDisplay } from "./display";

const factory = new LuaFactory();

const width = 900;
const height = 600;

export async function initEngine(
  code: string,
  gameDescription: WGameDescription
) {
  let lua = await factory.createEngine();

  // PIXIJS
  const app = new PIXI.Application({
    width: width,
    height: height,
    background: 0xedb4a1,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  document.body.appendChild(app.view as any as Node);

  window.addEventListener("resize", () => resize(app));
  resize(app);

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

function resize(app: PIXI.Application) {
  // current screen size
  const screenWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  const screenHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

  // uniform scale for our game
  const scale = Math.min(screenWidth / width, screenHeight / height);

  // the "uniformly englarged" size for our game
  const enlargedWidth = Math.floor(scale * width);
  const enlargedHeight = Math.floor(scale * height);

  // margins for centering our game
  const horizontalMargin = (screenWidth - enlargedWidth) / 2;
  const verticalMargin = (screenHeight - enlargedHeight) / 2;

  // now we use css trickery to set the sizes and margins
  app.view.style!.width = `${enlargedWidth}px`;
  app.view.style!.height = `${enlargedHeight}px`;
  (app.view as unknown as HTMLCanvasElement).style.marginLeft = (
    app.view as unknown as HTMLCanvasElement
  ).style.marginRight = `${horizontalMargin}px`;
  (app.view as unknown as HTMLCanvasElement).style.marginTop = (
    app.view as unknown as HTMLCanvasElement
  ).style.marginBottom = `${verticalMargin}px`;
}
