import * as PIXI from "pixi.js";
import { WGameDescription, WImage, WImageStatus } from "../types/types";
import { PALETTE } from "../types/colorPalette";

export const sprites: WImage[] = [];

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
      sprite: spr,
      status: WImageStatus.OFF,
      groups: gameDescription.imageGroups
        .filter((g) => g.images.includes(image.id))
        .map((g) => g.id),
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
    s.sprite.tint = status ? PALETTE.ON : PALETTE.OFF;
  });
}
