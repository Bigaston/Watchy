import {
  WImage,
  WSoundDescription,
  WSoundDescriptionJSFXR,
} from "../types/types";
import { onSelectSpriteFromDescription, updateBackground } from "./editorView";
import { loadGame, saveGame } from "./storage";
import crel from "crel";

const sfxr = (window as any).sfxr;

const DEBOUNCE_TIME = 300;

let infoDiv = document.getElementById("infoContainer")!;

export function displaySpriteInfo(
  sprite: WImage,
  {
    onChange,
    onDelete,
  }: { onChange: (key: string, value: any) => void; onDelete: () => void }
) {
  infoDiv.innerHTML = "";

  let title = document.createElement("h2");
  title.innerHTML = `Sprite Info <span class="spriteId">(id: ${sprite.id})</span>`;

  infoDiv.appendChild(title);

  let input = createInput({
    label: "Name",
    value: sprite.name,
    onChange: (value) => {
      if (value === "") {
        input.classList.add("error");
      } else {
        input.classList.remove("error");

        onChange("name", value);
      }
    },
  });

  createButton({
    label: "🚮 Delete",
    type: "button-error",
    onClick: () => {
      onDelete();
    },
  });
}

export function clearInfo() {
  infoDiv.innerHTML = "";

  crel(
    infoDiv,
    crel("h2", "Game Info"),
    crel("label", { for: "editorGameTitle" }, "Title: "),
    crel("input", {
      type: "text",
      id: "editorGameTitle",
      value: loadGame().title,
      onchange: (e: any) => {
        saveGame({ ...loadGame(), title: e.target.value });
      },
    }),
    crel(
      "button",
      {
        class: "button-primary",
        onclick: () => {
          let input = document.createElement("input");
          input.type = "file";
          input.accept = "image/png, image/jpg, image/jpeg";

          input.addEventListener("change", () => {
            if (!input.files) return;

            console.log(input.files[0]);

            let reader = new FileReader();
            reader.onload = () => {
              saveGame({ ...loadGame(), background: reader.result as string });

              updateBackground();
            };
            reader.readAsDataURL(input.files[0]);
          });

          input.click();
        },
      },
      "🖼️ Update Wallpaper"
    ),
    crel(
      "button",
      {
        class: "button-error",
        onclick: () => {
          saveGame({ ...loadGame(), background: undefined });
          updateBackground();
        },
      },
      "🖼️🚮 Delete Background"
    )
  );

  // Sprites
  crel(
    infoDiv,
    crel("h3", "Sprites"),
    crel(
      "ul",
      loadGame().images.map((image) =>
        crel(
          "li",
          {
            class: "spriteItem",
            onclick: () => {
              onSelectSpriteFromDescription(image);
            },
          },
          image.name + " (id: " + image.id + ")"
        )
      )
    )
  );

  // Sound List
  crel(
    infoDiv,
    crel("h3", "Sounds"),
    crel(
      "ul",
      loadGame().sounds.map((sound) =>
        crel(
          "li",
          sound.name + " (id: " + sound.id + ")",
          crel("button", { onclick: () => playSound(sound) }, "▶️"),
          crel(
            "button",
            { class: "button-error", onclick: () => onDeleteSound(sound) },
            "🚮"
          )
        )
      )
    )
  );
}

function playSound(sound: WSoundDescription) {
  if (sound.type === "jsfxr") {
    sfxr.toAudio((sound as WSoundDescriptionJSFXR).content).play();
  }
}

function onDeleteSound(sound: WSoundDescription) {
  saveGame({
    ...loadGame(),
    sounds: loadGame().sounds.filter((s) => s.id !== sound.id),
  });

  clearInfo();
}

// Helper Function
function createInput(
  options: {
    type?: string;
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
  } = {}
) {
  let input = document.createElement("input");
  input.type = options.type ?? "text";

  input.value = options.value ?? "";

  if (options.label) {
    let label = document.createElement("label");
    label.innerText = options.label;
    infoDiv.appendChild(label);
  }

  let timeout: number;
  input.addEventListener("input", () => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      options.onChange?.(input.value);
    }, DEBOUNCE_TIME);
  });

  infoDiv.appendChild(input);

  return input;
}

function createButton({
  label,
  onClick,
  type,
}: {
  label?: string;
  onClick?: () => void;
  type?: "button-primary" | "button-error";
}) {
  let button = document.createElement("button");
  button.innerText = label ?? "";

  if (onClick) button.addEventListener("click", onClick);

  if (type) button.classList.add(type);

  infoDiv.appendChild(button);
}
