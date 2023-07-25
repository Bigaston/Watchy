type InputList = "LEFT" | "RIGHT" | "UP" | "DOWN" | "A" | "B";
type InputOrigin = "gamepad" | "keyboard" | "none";

const KEY_BINDING: { [key: string]: InputList } = {
  Keyboard_ArrowLeft: "LEFT",
  Keyboard_ArrowRight: "RIGHT",
  Keyboard_ArrowUp: "UP",
  Keyboard_ArrowDown: "DOWN",
  Keyboard_KeyX: "A",
  Keyboard_KeyC: "B",
  Gamepad_Button0: "A",
  Gamepad_Button1: "B",
  Gamepad_Button12: "UP",
  Gamepad_Button13: "DOWN",
  Gamepad_Button14: "LEFT",
  Gamepad_Button15: "RIGHT",
};

let numberGamepadConnected = 0;

const inputStatus: {
  [key in InputList]: { status: boolean; origin: InputOrigin };
} = {
  LEFT: { status: false, origin: "none" },
  RIGHT: { status: false, origin: "none" },
  UP: { status: false, origin: "none" },
  DOWN: { status: false, origin: "none" },
  A: { status: false, origin: "none" },
  B: { status: false, origin: "none" },
};

const hasAlreadyTriggerJustPressed: { [key in InputList]: boolean } = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  A: false,
  B: false,
};

const mustUpdateTriggerJustPressed: InputList[] = [];

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

export function updateInput() {
  mustUpdateTriggerJustPressed.forEach((buttonId) => {
    hasAlreadyTriggerJustPressed[buttonId] = true;
  });

  mustUpdateTriggerJustPressed.length = 0;

  updateGamepad();
}

export function stopInput() {
  document.removeEventListener("keydown", keyDown);
  document.removeEventListener("keyup", keyUp);
}

let lastGamepadButtonStatus: boolean[] = [];

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
        checkGamepadButton(button, index);
        lastGamepadButtonStatus[index] = button.pressed;
      });
    }
  );
}

function checkGamepadButton(button: GamepadButton, index: number) {
  if (Object.keys(KEY_BINDING).includes("Gamepad_Button" + index)) {
    if (button.pressed != lastGamepadButtonStatus[index]) {
      if (button.pressed) {
        buttonDown(KEY_BINDING["Gamepad_Button" + index], "gamepad");
      } else {
        buttonUp(KEY_BINDING["Gamepad_Button" + index], "gamepad");
      }
    }
  }
}

// KEYBOARD
function keyDown(e: KeyboardEvent) {
  if (KEY_BINDING["Keyboard_" + e.code] != null) {
    let binding = KEY_BINDING["Keyboard_" + e.code];

    buttonDown(binding, "keyboard");
  }
}

function keyUp(e: KeyboardEvent) {
  if (KEY_BINDING["Keyboard_" + e.code] != null) {
    let binding = KEY_BINDING["Keyboard_" + e.code];

    buttonUp(binding, "keyboard");
  }
}

function buttonDown(buttonId: string, origin: InputOrigin) {
  inputStatus[buttonId as InputList] = { status: true, origin };
}

function buttonUp(buttonId: string, origin: InputOrigin) {
  if (inputStatus[buttonId as InputList].origin == origin) {
    inputStatus[buttonId as InputList] = { status: false, origin: "none" };
    hasAlreadyTriggerJustPressed[buttonId as InputList] = false;
  }
}

// INTERACTIV FUNCTION
function buttonPressed(buttonId: string) {
  return inputStatus[buttonId as InputList].status;
}

function buttonJustPressed(buttonId: string) {
  if (
    inputStatus[buttonId as InputList].status &&
    !hasAlreadyTriggerJustPressed[buttonId as InputList]
  ) {
    mustUpdateTriggerJustPressed.push(buttonId as InputList);

    return true;
  } else {
    return false;
  }
}
