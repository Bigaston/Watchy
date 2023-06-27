import { LuaFactory } from "wasmoon";
import * as PIXI from "pixi.js";
import { WGameDescription } from "./types/types";
import { initInput } from "./input";
import { initDisplay } from "./display";
import { initSystem, isPaused } from "./system";

const factory = new LuaFactory();

const width = 900;
const height = 600;

export async function initEngine(
  code: string,
  gameDescription: WGameDescription,
  renderElement: HTMLElement
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

  renderElement.appendChild(app.view as any as Node);

  window.addEventListener("resize", () => resize(app, renderElement));
  resize(app, renderElement);

  initInput(lua);
  initDisplay(lua, app, gameDescription);
  initSystem(lua);

  // Execute Lua Code
  await lua.doString(code);

  // Get the three main functions we need here in TypeScript
  const init = lua.global.get("INIT");
  const update = lua.global.get("UPDATE");
  const gameUpdate = lua.global.get("GAME_UPDATE");
  const draw = lua.global.get("DRAW");

  // If init is a function, call it
  if (init != null && typeof init === "function") {
    init();
  }

  app.ticker.add(ticker);

  function ticker(delta: number) {
    if (update) update(delta);

    if (!isPaused) {
      if (gameUpdate) gameUpdate(delta);
    }

    if (draw) draw();
  }
}

function resize(app: PIXI.Application, renderElement: HTMLElement) {
  // current screen size
  const screenWidth = renderElement.clientWidth;
  const screenHeight = renderElement.clientHeight;

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
