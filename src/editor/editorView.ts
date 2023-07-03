import * as PIXI from "pixi.js";
import { WImage, WImageStatus } from "../types/types";
import { loadGame } from "./storage";
import { PALETTE } from "../types/colorPalette";

const width = 900;
const height = 600;

const rendererElement = document.getElementById("renderer")!;

let app: PIXI.Application;

let selectedSprite: WImage | undefined;
let selectSquare: PIXI.Graphics;

export const sprites: WImage[] = [];

export function initEditorView() {
  app = new PIXI.Application({
    width: width,
    height: height,
    background: 0xedb4a1,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  rendererElement.appendChild(app.view as any as Node);

  window.addEventListener("resize", resize);
  resize();

  app.ticker.add(ticker);

  // Add image background
  let background = new PIXI.Sprite(PIXI.Texture.EMPTY);
  background.width = width;
  background.height = height;
  background.eventMode = "static";

  background.on("pointerdown", (_event) => {
    selectedSprite = undefined;
  });

  app.stage.addChild(background);

  // Load Game Sprites
  let game = loadGame();

  game.images.forEach((image) => {
    let spr = new PIXI.Sprite(PIXI.Texture.from(image.path));

    spr.x = image.x;
    spr.y = image.y;
    spr.width = image.width;
    spr.height = image.height;

    spr.tint = PALETTE.OFF;
    spr.eventMode = "static";

    let wImage = {
      id: image.id,
      name: image.name,
      sprite: spr,
      status: WImageStatus.OFF,
    };

    sprites.push(wImage);

    spr.on("pointerdown", (event) => {
      onSelectSprite(wImage);
    });

    spr.cursor = "pointer";

    app.stage.addChild(spr);
  });

  // Initialize Select Square
  selectSquare = new PIXI.Graphics();

  app.stage.addChild(selectSquare);
}

function onSelectSprite(sprite: WImage) {
  selectedSprite = sprite;
}

function ticker(delta: number) {
  if (selectedSprite) {
    selectSquare.lineStyle(2, 0x000000, 1);
    selectSquare.drawRect(
      selectedSprite.sprite.x,
      selectedSprite.sprite.y,
      selectedSprite.sprite.width,
      selectedSprite.sprite.height
    );
  } else {
    selectSquare.clear();
  }
}

function resize() {
  // current screen size
  const screenWidth = rendererElement.clientWidth;
  const screenHeight = rendererElement.clientHeight;

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
