import * as PIXI from "pixi.js";
import { WGameDescription, WImage, WImageStatus } from "../types/types";
import { PALETTE } from "../types/colorPalette";

export const sprites: WImage[] = [];

export function initDisplay(
  app: PIXI.Application,
  gameDescription: WGameDescription,
  functionObject: { [key: string]: undefined | Function }
) {
  functionObject["setStatus"] = setEnabled;

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

    spr.tint = PALETTE.OFF;

    sprites.push({
      id: image.id,
      name: image.name,
      sprite: spr,
      status: WImageStatus.OFF,
    });

    app.stage.addChild(spr);
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
    sprite.sprite.tint = status ? PALETTE.ON : PALETTE.OFF;
  }
}
