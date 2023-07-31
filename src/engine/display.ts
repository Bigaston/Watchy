import * as PIXI from "pixi.js";
import {
  WDigit,
  WGameDescription,
  WImage,
  WImageStatus,
  WNumber,
} from "../share/types";
import segments7 from "../share/7segment/7segment";

// import segments7 from "../share/7segment/7segment";

export const sprites: WImage[] = [];
export const numbers: WNumber[] = [];

let game: WGameDescription;

export function initDisplay(
  gameContainer: PIXI.Container,
  gameDescription: WGameDescription,
  functionObject: { [key: string]: undefined | Function }
) {
  game = gameDescription;

  functionObject["setStatus"] = setEnabled;
  functionObject["setStatusGroup"] = setEnabledGroup;
  functionObject["printText"] = printText;

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

    spr.tint = game.palette.off;

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

    gameContainer.addChild(spr);
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
        digit.tint = game.palette.off;

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
      numberOfDigits: number.numberDigit,
    });

    gameContainer.addChild(container);
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
    sprite.container.tint = status ? game.palette.on : game.palette.off;
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
    s.container.tint = status ? game.palette.on : game.palette.off;
  });
}

function printText(idOrName: string | number, numberToPrint: number | string) {
  let number = numbers.find((n) => {
    return n.id === idOrName || n.name === idOrName;
  });

  if (number == undefined) {
    console.log("Number not found");
    return;
  }

  let numberString = numberToPrint.toString();

  if (numberString.match(/[^0-9]/g)) {
    console.log("Number not valid");
    return;
  }

  if (numberString.length > number.digits!.length) {
    console.log("Number too big");
    return;
  }

  let numberArray = numberString.split("");

  numberArray.forEach((digitToPrint, index) => {
    let digit =
      number!.digits![index + (number!.digits!.length - numberArray.length)];
    resetDigit(digit);

    switch (digitToPrint) {
      case "0":
        digit.topleft.tint = game.palette.on;
        digit.topright.tint = game.palette.on;
        digit.bottomleft.tint = game.palette.on;
        digit.bottomright.tint = game.palette.on;
        digit.top.tint = game.palette.on;
        digit.bottom.tint = game.palette.on;
        break;
      case "1":
        digit.topright.tint = game.palette.on;
        digit.bottomright.tint = game.palette.on;
        break;
      case "2":
        digit.top.tint = game.palette.on;
        digit.topright.tint = game.palette.on;
        digit.middle.tint = game.palette.on;
        digit.bottomleft.tint = game.palette.on;
        digit.bottom.tint = game.palette.on;
        break;
      case "3":
        digit.top.tint = game.palette.on;
        digit.topright.tint = game.palette.on;
        digit.middle.tint = game.palette.on;
        digit.bottomright.tint = game.palette.on;
        digit.bottom.tint = game.palette.on;
        break;
      case "4":
        digit.topleft.tint = game.palette.on;
        digit.topright.tint = game.palette.on;
        digit.middle.tint = game.palette.on;
        digit.bottomright.tint = game.palette.on;
        break;
      case "5":
        digit.topleft.tint = game.palette.on;
        digit.top.tint = game.palette.on;
        digit.middle.tint = game.palette.on;
        digit.bottomright.tint = game.palette.on;
        digit.bottom.tint = game.palette.on;
        break;
      case "6":
        digit.topleft.tint = game.palette.on;
        digit.top.tint = game.palette.on;
        digit.middle.tint = game.palette.on;
        digit.bottomleft.tint = game.palette.on;
        digit.bottomright.tint = game.palette.on;
        digit.bottom.tint = game.palette.on;
        break;
      case "7":
        digit.top.tint = game.palette.on;
        digit.topright.tint = game.palette.on;
        digit.bottomright.tint = game.palette.on;
        break;
      case "8":
        digit.topleft.tint = game.palette.on;
        digit.top.tint = game.palette.on;
        digit.topright.tint = game.palette.on;
        digit.middle.tint = game.palette.on;
        digit.bottomleft.tint = game.palette.on;
        digit.bottom.tint = game.palette.on;
        digit.bottomright.tint = game.palette.on;
        break;
      case "9":
        digit.topleft.tint = game.palette.on;
        digit.top.tint = game.palette.on;
        digit.topright.tint = game.palette.on;
        digit.middle.tint = game.palette.on;
        digit.bottomright.tint = game.palette.on;
        digit.bottom.tint = game.palette.on;
        break;
    }
  });
}

function resetDigit(digit: WDigit) {
  digit.topleft.tint = game.palette.off;
  digit.topright.tint = game.palette.off;
  digit.bottomleft.tint = game.palette.off;
  digit.bottomright.tint = game.palette.off;
  digit.top.tint = game.palette.off;
  digit.middle.tint = game.palette.off;
  digit.bottom.tint = game.palette.off;
}
