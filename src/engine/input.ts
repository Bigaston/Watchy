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

export function initInput(functionObject: { [key: string]: Function }) {
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  functionObject["btn_pressed"] = buttonPressed;
  functionObject["btn_just_pressed"] = buttonJustPressed;
}

export function stopInput() {
  document.removeEventListener("keydown", keyDown);
  document.removeEventListener("keyup", keyUp);
}

function keyDown(e: KeyboardEvent) {
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
}

function keyUp(e: KeyboardEvent) {
  if (KEY_BINDING["Keyboard_" + e.code] != null) {
    inputStatus[KEY_BINDING["Keyboard_" + e.code]] = false;
    inputStatusInstant[KEY_BINDING["Keyboard_" + e.code]] = false;

    hasBeenRelease[KEY_BINDING["Keyboard_" + e.code]] = true;
  }
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
