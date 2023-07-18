import * as PIXI from "pixi.js";
import {
  WImage,
  WImageDescription,
  WImageStatus,
  WNumber,
  WNumberDescription,
  WSelectable,
} from "../share/types";
import { loadGame, saveGame } from "./storage";
import { PALETTE } from "../share/colorPalette";
import segments7 from "../share/7segment/7segment";
import {
  currentScreenListener,
  currentSpriteListener,
  onChangeSpriteListener,
  onDeleteSpriteListener,
  refreshGameListener,
} from "./preact/Listeners";

const width = 900;
const height = 600;

const rendererElement = document.getElementById("renderer")!;

let app: PIXI.Application;

let selectedSprite: WSelectable | undefined;
let isSelectedSpriteDragged = false;
let isSelectedResized = false;
let isSelectorRotate = false;

let mouseOffset = { x: 0, y: 0 };
let mousePosition = { x: 0, y: 0 };
let lastMousePosition = { x: 0, y: 0 };

let hoverSelector = new PIXI.Container();

export const sprites: WImage[] = [];
export const numbers: WNumber[] = [];

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
    stopSelection();
  });

  app.stage.addChild(background);

  // Load Game Sprite

  game.images.forEach(createSprite);
  game.numbers.forEach(addNumber);

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

  spr.anchor.set(0.5, 0.5);

  spr.x = image.x;
  spr.y = image.y;
  spr.width = image.width;
  spr.height = image.height;
  spr.angle = image.angle;

  spr.tint = PALETTE.OFF;
  spr.eventMode = "static";

  let wImage = {
    id: image.id,
    type: "image" as const,
    name: image.name,
    container: spr,
    status: WImageStatus.OFF,
    groups: [],
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
  currentScreenListener.trigger("sprite");
  currentSpriteListener.trigger(sprite);

  onDeleteSpriteListener.clearListeners();
  onDeleteSpriteListener.addListener(onDelete);

  onChangeSpriteListener.clearListeners();
  onChangeSpriteListener.addListener(onChange);

  function onDelete() {
    onDeleteSpriteListener.removeListener(onDelete);

    sprite.container.removeFromParent();
    sprites.splice(sprites.indexOf(sprite), 1);
    game.images = game.images.filter((image) => image.id !== sprite.id);
    game.imageGroups = game.imageGroups.map((group) => {
      group.images = group.images.filter((image) => image !== sprite.id);
      return group;
    });

    saveGame(game);
    refreshGameListener.trigger();

    stopSelection();
  }

  function onChange({ key, value }: { key: string; value: any }) {
    if (key === "name") {
      game.images = game.images.map((image) => {
        if (image.id === sprite.id) {
          image.name = value;
        }
        return image;
      });

      saveGame(game);
    }

    refreshGameListener.trigger();
  }

  initSelectionBox(sprite.container, sprite);
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

  currentScreenListener.trigger("home");
  currentSpriteListener.trigger(null);
}

function ticker(_delta: number) {
  if (selectedSprite) {
    hoverSelector.x = selectedSprite.container.x;
    hoverSelector.y = selectedSprite.container.y;

    if (isSelectedSpriteDragged) {
      selectedSprite.container.x = mousePosition.x - mouseOffset.x;
      selectedSprite.container.y = mousePosition.y - mouseOffset.y;
    }

    if (isSelectedResized) {
      // let distanceCenterMouse = Math.sqrt(
      //   Math.pow(mousePosition.x - selectedSprite.sprite.x, 2) +
      //     Math.pow(mousePosition.y - selectedSprite.sprite.y, 2)
      // );

      // let angleCenterMouse = Math.atan2(
      //   mousePosition.y - selectedSprite.sprite.y,
      //   mousePosition.x - selectedSprite.sprite.x
      // );

      // let heightOfSprite = distanceCenterMouse * Math.sin(angleCenterMouse);
      // let widthOfSprite = distanceCenterMouse * Math.cos(angleCenterMouse);

      // selectedSprite.sprite.width = widthOfSprite * 2;
      // selectedSprite.sprite.height = heightOfSprite * 2;

      if (selectedSprite.type === "image") {
        selectedSprite.container.width =
          mousePosition.x - selectedSprite.container.x;
        selectedSprite.container.height =
          mousePosition.y - selectedSprite.container.y;

        let square = hoverSelector.getChildAt(0) as PIXI.Graphics;
        square.clear();
        square.lineStyle(2, 0x000000, 1);
        square.drawRect(
          -selectedSprite.container.width / 2,
          -selectedSprite.container.height / 2,
          selectedSprite.container.width,
          selectedSprite.container.height
        );

        (hoverSelector.getChildAt(1) as PIXI.Graphics).x =
          selectedSprite.container.width / 2;
        (hoverSelector.getChildAt(1) as PIXI.Graphics).y =
          selectedSprite.container.height / 2;

        // (hoverSelector.getChildAt(2) as PIXI.Graphics).x = 0;
        // (hoverSelector.getChildAt(2) as PIXI.Graphics).y =
        //   -20 - selectedSprite.sprite.height / 2;
      } else if (selectedSprite.type === "number") {
        let digits = selectedSprite.container.children;

        let digitHeight = mousePosition.y - selectedSprite.container.y;
        let digitWidth = digitHeight * 0.6;

        digits.forEach((digit, index) => {
          (digit as PIXI.Sprite).width = digitWidth;
          (digit as PIXI.Sprite).height = digitHeight;

          digit.x = digitWidth * index;
        });

        selectedSprite.container.calculateBounds();

        let square = hoverSelector.getChildAt(0) as PIXI.Graphics;
        square.clear();
        square.lineStyle(2, 0x000000, 1);
        square.drawRect(
          0,
          0,
          selectedSprite.container.width,
          selectedSprite.container.height
        );

        (hoverSelector.getChildAt(1) as PIXI.Graphics).x =
          selectedSprite.container.width / 2;
        (hoverSelector.getChildAt(1) as PIXI.Graphics).y =
          selectedSprite.container.height;
      }
    }

    if (isSelectorRotate) {
      let mousePosDiff = {
        x: mousePosition.x - lastMousePosition.x,
        y: mousePosition.y - lastMousePosition.y,
      };

      let angle = (Math.atan2(mousePosDiff.y, mousePosDiff.x) * 180) / Math.PI;

      selectedSprite.container.angle = angle;
      hoverSelector.angle = angle;
    }
  }
}

function initSelectionBox(spr: PIXI.Sprite, wSpr: WImage) {
  let game = loadGame();
  hoverSelector.removeChildren();

  hoverSelector.pivot.set(0.5, 0.5);
  hoverSelector.angle = spr.angle;

  let square = new PIXI.Graphics();
  square.clear();
  square.lineStyle(2, 0x000000, 1);
  square.drawRect(-spr.width / 2, -spr.height / 2, spr.width, spr.height);

  let sphere = new PIXI.Graphics();
  sphere.lineStyle(0);
  sphere.beginFill(0xff0000, 0.5);
  sphere.drawCircle(0, 0, 10);

  sphere.x = spr.width / 2;
  sphere.y = spr.height / 2;

  sphere.eventMode = "static";
  sphere.cursor = "nwse-resize";

  sphere.on("pointerdown", (event) => {
    isSelectedResized = true;

    mouseOffset.x = event.data.global.x - spr.width;
    mouseOffset.y = event.data.global.y - spr.height;

    document.addEventListener("pointerup", endResize);
  });

  function endResize() {
    document.removeEventListener("pointerup", endResize);
    isSelectedResized = false;

    game.images = game.images.map((image) => {
      if (image.id === wSpr.id) {
        image.width = spr.width;
        image.height = spr.height;
      }
      return image;
    });

    saveGame(game);
  }

  // Rotation Sphere
  let rotationSphere = new PIXI.Graphics();
  rotationSphere.lineStyle(0);
  rotationSphere.beginFill(0x0000ff, 0.5);
  rotationSphere.drawCircle(0, 0, 10);

  rotationSphere.x = 0;
  rotationSphere.y = -20 - spr.height / 2;

  rotationSphere.eventMode = "static";
  rotationSphere.cursor = "pointer";

  rotationSphere.on("pointerdown", (event) => {
    isSelectorRotate = true;

    lastMousePosition.x = event.data.global.x;
    lastMousePosition.y = event.data.global.y;

    document.addEventListener("pointerup", endRotation);
  });

  function endRotation() {
    document.removeEventListener("pointerup", endRotation);
    isSelectorRotate = false;

    game.images = game.images.map((image) => {
      if (image.id === wSpr.id) {
        image.angle = spr.angle;
      }
      return image;
    });

    saveGame(game);
  }

  hoverSelector.addChild(square);
  hoverSelector.addChild(sphere);
  // hoverSelector.addChild(rotationSphere);
}

function initSelectionBoxNumber(container: PIXI.Container, wNumber: WNumber) {
  hoverSelector.removeChildren();

  hoverSelector.x = container.x;
  hoverSelector.y = container.y;

  let square = new PIXI.Graphics();
  square.clear();
  square.lineStyle(2, 0x000000, 1);
  square.drawRect(0, 0, container.width, container.height);

  let sphere = new PIXI.Graphics();
  sphere.lineStyle(0);
  sphere.beginFill(0xff0000, 0.5);
  sphere.drawCircle(0, 0, 10);

  sphere.x = container.width / 2;
  sphere.y = container.height;

  sphere.eventMode = "static";
  sphere.cursor = "ns-resize";

  sphere.on("pointerdown", (event) => {
    isSelectedResized = true;

    mouseOffset.x = event.data.global.x - container.width;
    mouseOffset.y = event.data.global.y - container.height;

    sphere.addEventListener("pointerup", endResize);
    sphere.addEventListener("pointerupoutside", endResize);
  });

  function endResize() {
    sphere.removeEventListener("pointerup", endResize);
    sphere.removeEventListener("pointerupoutside", endResize);

    isSelectedResized = false;

    saveGame({
      ...loadGame(),
      numbers: loadGame().numbers.map((number) => {
        if (number.id === wNumber.id) {
          number.height = container.height;
        }
        return number;
      }),
    });
  }

  hoverSelector.addChild(square);
  hoverSelector.addChild(sphere);
}

export function resize() {
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

    let fillStyleRegex = new RegExp(`fill:#.{6}`, "g");
    xmlString = xmlString.replace(fillStyleRegex, `fill:#ffffff`);

    let strokeRegex = new RegExp(`stroke="#.{6}"`, "g");
    xmlString = xmlString.replace(strokeRegex, `stroke="#000000"`);

    let dataURL = `data:image/svg+xml;base64,${btoa(xmlString)}`;

    let img: WImageDescription = {
      id: game.nextAvailableImageId,
      name: file.name,
      path: dataURL,
      x: 50,
      y: 50,
      angle: 0,
      width: 100,
      height: 100,
    };

    game.images.push(img);

    game.nextAvailableImageId++;

    saveGame(game);

    refreshGameListener.trigger();
    createSprite(img);
  };
  reader.readAsText(file);
}

export function addNumber(number: WNumberDescription) {
  let numberContainer = new PIXI.Container();

  numberContainer.x = number.x;
  numberContainer.y = number.y;

  for (let i = 0; i < number.numberDigit; i++) {
    let spr = new PIXI.Sprite(PIXI.Texture.from(segments7.full));

    spr.tint = PALETTE.OFF;

    let width = number.height * 0.6;

    spr.x = i * width;
    spr.y = 0;

    spr.width = width;
    spr.height = number.height;

    numberContainer.addChild(spr);
  }

  numberContainer.eventMode = "static";
  numberContainer.cursor = "pointer";

  let wNumber: WNumber = {
    id: number.id,
    name: number.name,
    container: numberContainer,
    type: "number",
  };

  numbers.push(wNumber);

  numberContainer.on("pointerdown", (event) => {
    initSelectionBoxNumber(numberContainer, wNumber);
    selectedSprite = wNumber;

    mouseOffset.x = event.data.global.x - numberContainer.x;
    mouseOffset.y = event.data.global.y - numberContainer.y;

    isSelectedSpriteDragged = true;

    numberContainer.addEventListener("pointerup", endMove);
    numberContainer.addEventListener("pointerupoutside", endMove);
  });

  function endMove() {
    isSelectedSpriteDragged = false;

    numberContainer.removeEventListener("pointerup", endMove);
    numberContainer.removeEventListener("pointerupoutside", endMove);

    saveGame({
      ...loadGame(),
      numbers: loadGame().numbers.map((n) =>
        n.id === number.id
          ? {
              ...n,
              x: numberContainer.x,
              y: numberContainer.y,
            }
          : n
      ),
    });
  }

  app.stage.addChild(numberContainer);
}
