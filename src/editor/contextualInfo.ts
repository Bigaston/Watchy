import { WImage } from "../types/types";
import { onSelectSpriteFromDescription } from "./editorView";
import { loadGame, saveGame } from "./storage";

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

  let title = document.createElement("h2");
  title.innerHTML = `Game Info`;

  infoDiv.appendChild(title);

  createInput({
    label: "Title",
    value: loadGame().title,
    onChange: (value) => {
      saveGame({ ...loadGame(), title: value });
    },
  });

  let spritesTitle = document.createElement("h3");
  spritesTitle.innerHTML = `Sprites`;

  infoDiv.appendChild(spritesTitle);

  let sprites = loadGame().images;

  let spriteList = document.createElement("ul");
  infoDiv.appendChild(spriteList);

  sprites.forEach((sprite) => {
    let spriteItem = document.createElement("li");
    spriteItem.innerHTML = sprite.name + " (id: " + sprite.id + ")";

    spriteItem.classList.add("spriteItem");

    spriteItem.addEventListener("click", () => {
      onSelectSpriteFromDescription(sprite);
    });

    spriteList.appendChild(spriteItem);
  });
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
