type InputList = "LEFT" | "RIGHT" | "UP" | "DOWN" | "A" | "B";

const inputStatus: { [key in InputList]: boolean } = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  A: false,
  B: false,
};

const inputStatusGamepad: { [key in InputList]: boolean } = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  A: false,
  B: false,
};

const inputStatusGamepadInstant: { [key in InputList]: boolean } = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  A: false,
  B: false,
};

const inputStatusInstant: { [key in InputList]: boolean } = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  A: false,
  B: false,
};

const KEY_BINDING: { [key: string]: InputList } = {
  Keyboard_ArrowLeft: "LEFT",
  Keyboard_ArrowRight: "RIGHT",
  Keyboard_ArrowUp: "UP",
  Keyboard_ArrowDown: "DOWN",
  Keyboard_KeyX: "A",
  Keyboard_KeyC: "B",
  Gamepad_N_Button0: "A",
  Gamepad_N_Button1: "B",
  Gamepad_N_Button12: "UP",
  Gamepad_N_Button13: "DOWN",
  Gamepad_N_Button14: "LEFT",
  Gamepad_N_Button15: "RIGHT",
};

const hasBeenRelease: { [key: string]: boolean } = {};
const hasBeenReleaseGamepad: { [key: string]: boolean } = {};

let numberGamepadConnected = 0;

export function initInput(functionObject: { [key: string]: Function }) {
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  window.addEventListener("gamepadconnected", function (_e) {
    numberGamepadConnected++;
  });

  window.addEventListener("gamepaddisconnected", function (_e) {
    numberGamepadConnected--;
  });

  functionObject["btnPressed"] = buttonPressed;
  functionObject["btnJustPressed"] = buttonJustPressed;
}

export function stopInput() {
  document.removeEventListener("keydown", keyDown);
  document.removeEventListener("keyup", keyUp);
}

// GAMEPAD
export function updateGamepad() {
  if (numberGamepadConnected == 0) {
    return;
  }

  let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  if (!gamepads) {
    return;
  }

  (gamepads.filter((gamepad) => gamepad != null) as Gamepad[]).forEach(
    (gamepad) => {
      gamepad.buttons.forEach((button, index) => {
        checkGamepadButton("N", button, index);
        checkGamepadButton("" + gamepad.index, button, index);
      });
    }
  );
}

function checkGamepadButton(
  gamepadIndex: string,
  button: GamepadButton,
  index: number
) {
  if (
    Object.keys(KEY_BINDING).includes(
      "Gamepad_" + gamepadIndex + "_Button" + index
    )
  ) {
    if (button.pressed) {
      inputStatusGamepad[
        KEY_BINDING[
          ("Gamepad_" + gamepadIndex + "_Button" + index) as InputList
        ]
      ] = true;

      if (
        hasBeenReleaseGamepad["Gamepad_" + gamepadIndex + "_Button" + index]
      ) {
        inputStatusGamepadInstant[
          KEY_BINDING["Gamepad_" + gamepadIndex + "_Button" + index]
        ] = true;
        hasBeenReleaseGamepad["Gamepad_" + gamepadIndex + "_Button" + index] =
          false;
      }
    } else {
      inputStatusGamepad[
        KEY_BINDING[
          ("Gamepad_" + gamepadIndex + "_Button" + index) as InputList
        ]
      ] = false;

      hasBeenReleaseGamepad["Gamepad_" + gamepadIndex + "_Button" + index] =
        true;
      inputStatusGamepadInstant[
        KEY_BINDING["Gamepad_" + gamepadIndex + "_Button" + index]
      ] = false;
    }
  }
}

// KEYBOARD
function keyDown(e: KeyboardEvent) {
  if (KEY_BINDING["Keyboard_" + e.code] != null) {
    let inputId = "Keyboard_" + e.code;

    if (
      hasBeenRelease[KEY_BINDING[inputId]] ||
      hasBeenRelease[KEY_BINDING[inputId]] == undefined
    ) {
      hasBeenRelease[KEY_BINDING[inputId]] = false;

      inputStatus[KEY_BINDING[inputId]] = true;
      inputStatusInstant[KEY_BINDING[inputId]] = true;
    }
  }
}

function keyUp(e: KeyboardEvent) {
  if (KEY_BINDING["Keyboard_" + e.code] != null) {
    let buttonId = "Keyboard_" + e.code;

    inputStatus[KEY_BINDING[buttonId]] = false;
    inputStatusInstant[KEY_BINDING[buttonId]] = false;

    hasBeenRelease[KEY_BINDING[buttonId]] = true;
  }
}

// INTERACTIV FUNCTION
function buttonPressed(buttonId: string) {
  return (
    inputStatus[buttonId as InputList] ||
    inputStatusGamepad[buttonId as InputList] ||
    false
  );
}

function buttonJustPressed(buttonId: string) {
  let status =
    inputStatusInstant[buttonId as InputList] ||
    inputStatusGamepadInstant[buttonId as InputList] ||
    false;

  if (status) {
    inputStatusInstant[buttonId as InputList] = false;
    inputStatusGamepadInstant[buttonId as InputList] = false;
  }

  return status;
}
