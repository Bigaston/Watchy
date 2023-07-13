import * as PIXI from "pixi.js";
import {
  WDigit,
  WGameDescription,
  WImage,
  WImageStatus,
  WNumber,
} from "../share/types";
import { PALETTE } from "../share/colorPalette";
import segments7 from "../share/7segment/7segment";

// import segments7 from "../share/7segment/7segment";

export const sprites: WImage[] = [];
export const numbers: WNumber[] = [];

let game: WGameDescription;

export function initDisplay(
  app: PIXI.Application,
  gameDescription: WGameDescription,
  functionObject: { [key: string]: undefined | Function }
) {
  game = gameDescription;

  functionObject["setStatus"] = setEnabled;
  functionObject["setStatusGroup"] = setEnabledGroup;

  // Create All Sprites
  gameDescription.images.forEach((image) => {
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
    spr.anchor.set(0.5, 0.5);

    spr.tint = PALETTE.OFF;

    sprites.push({
      id: image.id,
      name: image.name,
      type: "image",
      container: spr,
      status: WImageStatus.OFF,
      groups: gameDescription.imageGroups
        .filter((g) => g.images.includes(image.id))
        .map((g) => g.id),
    });

    app.stage.addChild(spr);
  });

  gameDescription.numbers.forEach((number) => {
    let container = new PIXI.Container();
    let digits: WDigit[] = [];

    for (let i = 0; i < number.numberDigit; i++) {
      let digitContainer = new PIXI.Container();

      let topLeft = new PIXI.Sprite(PIXI.Texture.from(segments7.topleft));
      let topRight = new PIXI.Sprite(PIXI.Texture.from(segments7.topright));
      let bottomLeft = new PIXI.Sprite(PIXI.Texture.from(segments7.bottomleft));
      let bottomRight = new PIXI.Sprite(
        PIXI.Texture.from(segments7.bottomright)
      );
      let top = new PIXI.Sprite(PIXI.Texture.from(segments7.top));
      let middle = new PIXI.Sprite(PIXI.Texture.from(segments7.middle));
      let bottom = new PIXI.Sprite(PIXI.Texture.from(segments7.bottom));

      setupDigit(topLeft);
      setupDigit(topRight);
      setupDigit(bottomLeft);
      setupDigit(bottomRight);
      setupDigit(top);
      setupDigit(middle);
      setupDigit(bottom);

      let digit: WDigit = {
        topleft: topLeft,
        topright: topRight,
        bottomleft: bottomLeft,
        bottomright: bottomRight,
        top: top,
        middle: middle,
        bottom: bottom,
      };

      digits.push(digit);

      function setupDigit(digit: PIXI.Sprite) {
        digit.height = number.height;
        digit.width = number.height * 0.6;
        digit.tint = PALETTE.OFF;

        digitContainer.addChild(digit);
      }

      digitContainer.x = i * number.height * 0.6;
      digitContainer.y = 0;

      container.addChild(digitContainer);
    }

    container.x = number.x;
    container.y = number.y;

    numbers.push({
      id: number.id,
      name: number.name,
      type: "number",
      container: container,
      digits: digits,
    });

    app.stage.addChild(container);
  });
}

export function stopDisplay() {
  sprites.splice(0, sprites.length);
}

// FUNCTIONS
function setEnabled(idOrName: number | string, status: boolean) {
  const sprite = sprites.find((s) => {
    return s.id === idOrName || s.name === idOrName;
  });

  if (sprite != null) {
    sprite.status = status ? WImageStatus.ON : WImageStatus.OFF;
    sprite.container.tint = status ? PALETTE.ON : PALETTE.OFF;
  }
}

function setEnabledGroup(idOrName: number | string, status: boolean) {
  let goodIdOrName: number;

  if (typeof idOrName === "string") {
    let findedId = game!.imageGroups.find((g) => g.name === idOrName)?.id;

    if (findedId == null) {
      console.log("Group not found");
      return;
    }

    goodIdOrName = findedId;
  } else {
    goodIdOrName = idOrName;
  }

  const spritesToDisplay = sprites.filter((s) => {
    return s.groups.includes(goodIdOrName as number);
  });

  spritesToDisplay.forEach((s) => {
    s.status = status ? WImageStatus.ON : WImageStatus.OFF;
    s.container.tint = status ? PALETTE.ON : PALETTE.OFF;
  });
}
