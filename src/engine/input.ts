import { LuaEngine } from "wasmoon";

const inputStatus: { [key: string]: boolean } = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  A: false,
  B: false,
};

const inputStatusInstant: { [key: string]: boolean } = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  A: false,
  B: false,
};

const KEY_BINDING: { [key: string]: string } = {
  Keyboard_ArrowLeft: "LEFT",
  Keyboard_ArrowRight: "RIGHT",
  Keyboard_ArrowUp: "UP",
  Keyboard_ArrowDown: "DOWN",
  Keyboard_KeyX: "A",
  Keyboard_KeyC: "B",
};

const hasBeenRelease: { [key: string]: boolean } = {};

export function initInput(lua: LuaEngine) {
  document.addEventListener("keydown", (e) => {
    if (KEY_BINDING["Keyboard_" + e.code] != null) {
      if (
        hasBeenRelease[KEY_BINDING["Keyboard_" + e.code]] ||
        hasBeenRelease[KEY_BINDING["Keyboard_" + e.code]] == undefined
      ) {
        hasBeenRelease[KEY_BINDING["Keyboard_" + e.code]] = false;

        inputStatus[KEY_BINDING["Keyboard_" + e.code]] = true;
        inputStatusInstant[KEY_BINDING["Keyboard_" + e.code]] = true;
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    if (KEY_BINDING["Keyboard_" + e.code] != null) {
      inputStatus[KEY_BINDING["Keyboard_" + e.code]] = false;
      inputStatusInstant[KEY_BINDING["Keyboard_" + e.code]] = false;

      hasBeenRelease[KEY_BINDING["Keyboard_" + e.code]] = true;
    }
  });

  lua.global.set("BUTTON_PRESSED", buttonPressed);
  lua.global.set("BUTTON_JUST_PRESSED", buttonJustPressed);
}

function buttonPressed(buttonId: string) {
  return inputStatus[buttonId];
}

function buttonJustPressed(buttonId: string) {
  let status = inputStatusInstant[buttonId];

  if (status) {
    inputStatusInstant[buttonId] = false;
  }

  return status;
}
