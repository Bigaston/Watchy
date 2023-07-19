import { LuaEngine, LuaFactory } from "wasmoon";
import * as PIXI from "pixi.js";
import { WGameDescription } from "../share/types";
import { initInput, stopInput, updateGamepad } from "./input";
import { initDisplay, stopDisplay } from "./display";
import { initSystem, isPaused } from "./system";
import { initSound } from "./sound";

const factory = new LuaFactory();

const width = 900;
const height = 600;

let hasBeenInitialized = false;

let lua: LuaEngine;
let app: PIXI.Application;
let renderElement: HTMLElement;

let gameFunction: { [key: string]: undefined | Function } = {
  init: undefined,
  update: undefined,
  gameUpdate: undefined,
  draw: undefined,
};

export async function initEngine(
  gameDescription: WGameDescription,
  _renderElement: HTMLElement,
  embed: boolean = false
) {
  lua = await factory.createEngine();
  renderElement = _renderElement;

  // PIXIJS
  app = new PIXI.Application({
    width: width,
    height: height,
    background: 0xedb4a1,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  renderElement.appendChild(app.view as any as Node);

  window.addEventListener("resize", resize);
  resize();

  // Init Background
  let background = new PIXI.Sprite(
    gameDescription.background
      ? PIXI.Texture.from(gameDescription.background)
      : PIXI.Texture.EMPTY
  );
  background.width = width;
  background.height = height;

  app.stage.addChild(background);

  let functionObject = {};

  initInput(functionObject);
  initDisplay(app, gameDescription, functionObject);
  initSystem(lua, functionObject);
  initSound(functionObject, gameDescription);

  lua.global.set("watchy", functionObject);

  // Execute Lua Code
  await lua.doString(gameDescription.code);

  // Get the three main functions we need here in TypeScript
  gameFunction.init = lua.global.get("INIT");
  gameFunction.update = lua.global.get("UPDATE");
  gameFunction.gameUpdate = lua.global.get("GAME_UPDATE");
  gameFunction.draw = lua.global.get("DRAW");

  // If init is a function, call it
  if (gameFunction.init != null && typeof gameFunction.init === "function") {
    gameFunction.init();
  }

  app.ticker.add(ticker);

  hasBeenInitialized = true;

  if (!embed) {
    document.title = gameDescription.title + " - Watchy";
  }
}

function ticker(delta: number) {
  updateGamepad();

  if (gameFunction.update) gameFunction.update(delta);

  if (!isPaused) {
    if (gameFunction.gameUpdate) gameFunction.gameUpdate(delta);
  }

  if (gameFunction.draw) gameFunction.draw();
}

export function stopEngine() {
  if (!hasBeenInitialized) return;

  app.ticker.remove(ticker);
  app.destroy();

  lua.global.close();

  stopDisplay();
  stopInput();

  window.removeEventListener("resize", resize);

  renderElement.innerHTML = "";

  gameFunction = {
    init: undefined,
    update: undefined,
    gameUpdate: undefined,
    draw: undefined,
  };

  hasBeenInitialized = false;
}

export function resize() {
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
