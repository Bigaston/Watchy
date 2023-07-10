import {
  WImage,
  WSoundDescription,
  WSoundDescriptionJSFXR,
} from "../types/types";
import { onSelectSpriteFromDescription, updateBackground } from "./editorView";
import { loadGame, saveGame } from "./storage";
import crel from "crel";

const sfxr = (window as any).sfxr;

let infoDiv = document.getElementById("infoContainer")!;

export function displaySpriteInfo(
  sprite: WImage,
  {
    onChange,
    onDelete,
  }: { onChange: (key: string, value: any) => void; onDelete: () => void }
) {
  infoDiv.innerHTML = "";

  crel(
    infoDiv,
    crel(
      "h2",
      "Sprite Info ",
      crel("span", { class: "spriteId" }, `(id: ${sprite.id})`)
    ),
    crel("label", { for: "spriteName" }, "Name: "),
    crel("input", {
      id: "spriteName",
      value: sprite.name,
      onchange: (e: any) => {
        if (e.target.value === "") {
          e.target.classList.add("error");
        } else {
          e.target.classList.remove("error");

          onChange("name", e.target.value);
        }
      },
    }),
    crel("br"),
    crel(
      "button",
      { class: "button-error", onclick: () => onDelete() },
      "🚮 Delete"
    ),
    crel("br"),
    crel("h3")
  );

  crel(
    infoDiv,
    crel("h3", "Sprite Groups"),
    loadGame()
      .imageGroups.filter((group) => group.images.includes(sprite.id))
      .map((group) => crel("p", group.name)),
    crel(
      "select",
      {
        id: "spriteGroupSelect",
      },
      loadGame()
        .imageGroups.filter(
          (imageGroup) => !imageGroup.images.includes(sprite.id)
        )
        .map((group) => crel("option", { value: group.id }, group.name))
    ),
    crel(
      "button",
      {
        onclick: () => {
          console.log(
            (document.getElementById("spriteGroupSelect") as HTMLSelectElement)
              .value
          );
        },
      },
      "➕ Add to group"
    )
  );
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

  // Sprites Groups
  crel(
    infoDiv,
    crel("h3", "Sprite Groups"),
    crel(
      "ul",
      loadGame().imageGroups.map((imageGroup) =>
        crel(
          "li",
          `${imageGroup.name} (id: ${imageGroup.id}): [${imageGroup.images.length} sprites]`
        )
      )
    ),
    crel(
      "button",
      {
        onclick: () => {
          let name = prompt("Group Name");
          if (name) {
            saveGame({
              ...loadGame(),
              imageGroups: [
                ...loadGame().imageGroups,
                {
                  id: loadGame().nextAvailableImageGroupId++,
                  name,
                  images: [],
                },
              ],
            });
            clearInfo();
          }
        },
      },
      "➕ Add Group"
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
