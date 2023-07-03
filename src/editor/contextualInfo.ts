import { WImage } from "../types/types";

const debounceTime = 500;

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
    }, debounceTime);
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
