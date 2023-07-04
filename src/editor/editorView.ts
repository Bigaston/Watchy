import * as PIXI from "pixi.js";
import { WImage, WImageDescription, WImageStatus } from "../types/types";
import { loadGame, saveGame } from "./storage";
import { PALETTE } from "../types/colorPalette";
import { clearInfo, displaySpriteInfo } from "./contextualInfo";

const width = 900;
const height = 600;

const rendererElement = document.getElementById("renderer")!;

let app: PIXI.Application;

let selectedSprite: WImage | undefined;
let isSelectedSpriteDragged = false;
let isSelectedResized = false;

let mouseOffset = { x: 0, y: 0 };
let mousePosition = { x: 0, y: 0 };

let hoverSelector = new PIXI.Container();

export const sprites: WImage[] = [];

export function initEditorView() {
  let game = loadGame();

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
  let background = new PIXI.Sprite(
    game.background ? PIXI.Texture.from(game.background) : PIXI.Texture.EMPTY
  );
  background.width = width;
  background.height = height;
  background.eventMode = "static";

  background.on("pointerdown", (_event) => {
    selectedSprite = undefined;
    clearInfo();
    stopSelection();
  });

  app.stage.addChild(background);

  // Load Game Sprite

  game.images.forEach(createSprite);

  // Handle Mouse Position
  (app.view as unknown as HTMLElement).addEventListener(
    "mousemove",
    (event) => {
      mousePosition.x =
        (event.offsetX / (app.view as unknown as HTMLElement).clientWidth) *
        width;
      mousePosition.y =
        (event.offsetY / (app.view as unknown as HTMLElement).clientHeight) *
        height;
    }
  );

  app.stage.addChild(hoverSelector);
}

async function createSprite(image: WImageDescription) {
  let texture = PIXI.Texture.from(image.path, {
    scaleMode: PIXI.SCALE_MODES.NEAREST,
    resourceOptions: {
      scale: 3,
    },
  });

  let spr = new PIXI.Sprite(texture);

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
    isSelectedSpriteDragged = true;

    mouseOffset.x = event.data.global.x - spr.x;
    mouseOffset.y = event.data.global.y - spr.y;

    spr.cursor = "move";
  });

  let game = loadGame();

  spr.on("pointerup", (_event) => {
    isSelectedSpriteDragged = false;

    game.images = game.images.map((image) => {
      if (image.id === wImage.id) {
        image.x = spr.x;
        image.y = spr.y;
      }
      return image;
    });

    saveGame(game);

    spr.cursor = "pointer";
  });

  spr.cursor = "pointer";

  app.stage.addChild(spr);
}

function onSelectSprite(sprite: WImage) {
  let game = loadGame();

  selectedSprite = sprite;

  initSelectionBox(sprite.sprite, sprite);

  displaySpriteInfo(sprite, {
    onChange: (key, value) => {
      if (key === "name") {
        updateImage(sprite.id, { name: value });
        sprite.name = value;
        saveGame(game);
      }
    },
    onDelete: () => {
      sprite.sprite.removeFromParent();
      sprites.splice(sprites.indexOf(sprite), 1);
      game.images = game.images.filter((image) => image.id !== sprite.id);
      saveGame(game);

      stopSelection();
    },
  });
}

export function onSelectSpriteFromDescription(sprite: WImageDescription) {
  let spr = sprites.find((spr) => spr.id === sprite.id);

  if (spr) {
    onSelectSprite(spr);
  }
}

export function updateBackground() {
  let game = loadGame();
  let background = app.stage.getChildAt(0) as PIXI.Sprite;

  background.texture = game.background
    ? PIXI.Texture.from(game.background)
    : PIXI.Texture.EMPTY;

  background.texture.update();
}

function stopSelection() {
  selectedSprite = undefined;
  isSelectedSpriteDragged = false;
  isSelectedResized = false;

  hoverSelector.removeChildren();
  clearInfo();
}

function ticker(_delta: number) {
  if (selectedSprite) {
    hoverSelector.x = selectedSprite.sprite.x;
    hoverSelector.y = selectedSprite.sprite.y;

    if (isSelectedSpriteDragged) {
      selectedSprite.sprite.x = mousePosition.x - mouseOffset.x;
      selectedSprite.sprite.y = mousePosition.y - mouseOffset.y;
    }

    if (isSelectedResized) {
      selectedSprite.sprite.width = mousePosition.x - selectedSprite.sprite.x;
      selectedSprite.sprite.height = mousePosition.y - selectedSprite.sprite.y;

      let square = hoverSelector.getChildAt(0) as PIXI.Graphics;
      square.clear();
      square.lineStyle(2, 0x000000, 1);
      square.drawRect(
        0,
        0,
        selectedSprite.sprite.width,
        selectedSprite.sprite.height
      );

      (hoverSelector.getChildAt(1) as PIXI.Graphics).x =
        selectedSprite.sprite.width;
      (hoverSelector.getChildAt(1) as PIXI.Graphics).y =
        selectedSprite.sprite.height;
    }
  }
}

function initSelectionBox(spr: PIXI.Sprite, wSpr: WImage) {
  let game = loadGame();
  hoverSelector.removeChildren();

  let square = new PIXI.Graphics();
  square.clear();
  square.lineStyle(2, 0x000000, 1);
  square.drawRect(0, 0, spr.width, spr.height);

  let sphere = new PIXI.Graphics();
  sphere.lineStyle(0);
  sphere.beginFill(0xff0000, 0.5);
  sphere.drawCircle(0, 0, 10);

  sphere.x = spr.width;
  sphere.y = spr.height;

  sphere.eventMode = "static";
  sphere.cursor = "nwse-resize";

  sphere.on("pointerdown", (event) => {
    isSelectedResized = true;

    mouseOffset.x = event.data.global.x - spr.width;
    mouseOffset.y = event.data.global.y - spr.height;
  });

  sphere.on("pointerup", (_event) => {
    isSelectedResized = false;

    game.images = game.images.map((image) => {
      if (image.id === wSpr.id) {
        image.width = spr.width;
        image.height = spr.height;
      }
      return image;
    });

    saveGame(game);
  });

  hoverSelector.addChild(square);
  hoverSelector.addChild(sphere);
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

export function addSprite(file: File) {
  let game = loadGame();

  const reader = new FileReader();
  reader.onloadend = () => {
    let xmlString = reader.result?.toString() as string;

    // Check if XML has height and width
    let height = xmlString.match(/height="(\d+)(|px)"/);
    let width = xmlString.match(/width="(\d+)(|px)"/);

    if (!height || !width) {
      alert("Invalid SVG file, you need to have an height and width attribute");
      return;
    }

    let fillRegex = new RegExp(`fill="#.{6}"`, "g");
    xmlString = xmlString.replace(fillRegex, `fill="#ffffff"`);

    let strokeRegex = new RegExp(`stroke="#.{6}"`, "g");
    xmlString = xmlString.replace(strokeRegex, `stroke="#000000"`);

    let dataURL = `data:image/svg+xml;base64,${btoa(xmlString)}`;

    let img: WImageDescription = {
      id: game.nextAvailableImageId,
      name: file.name,
      path: dataURL,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };

    game.images.push(img);

    game.nextAvailableImageId++;

    saveGame(game);

    createSprite(img);
  };
  reader.readAsText(file);
}

function updateImage(id: number, img: Partial<WImageDescription>) {
  let game = loadGame();

  game.images = game.images.map((image) => {
    if (image.id === id) {
      image = { ...image, ...img };
    }
    return image;
  });
}
