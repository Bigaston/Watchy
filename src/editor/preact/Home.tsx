import { useState } from "preact/hooks";
import { loadGame, saveGame } from "../storage";
import { onSelectSpriteFromDescription, updateBackground } from "../editorView";

export function Home() {
  let [game, setGame] = useState(loadGame());
  let [title, setTitle] = useState(loadGame().title);

  function handleChangeTitle(event: any) {
    saveGame({ ...loadGame(), title: event.target.value });
    setTitle(event.target.value);
  }

  function handleUpdateBackground() {
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
  }

  function handleDeleteBackground() {
    saveGame({ ...loadGame(), background: undefined });
    updateBackground();
  }

  function handleAddGroup() {
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

      setGame(loadGame());
    }
  }

  return (
    <>
      <h2>Game Info</h2>
      <label for="editorGameTitle">Title:</label>
      <input
        type="text"
        id="editorGameTitle"
        name="editorGameTitle"
        value={title}
        onChange={handleChangeTitle}
      />

      <button class="button-primary" onClick={handleUpdateBackground}>
        🖼️ Update Wallpaper
      </button>
      <button class="button-error" onClick={handleDeleteBackground}>
        🖼️🚮 Delete Background
      </button>

      <h3>Sprites</h3>
      <ul>
        {game.images.map((image) => (
          <li
            class="spriteItem"
            onClick={() => onSelectSpriteFromDescription(image)}
          >
            {image.name} (id: {image.id}){" "}
          </li>
        ))}
      </ul>

      <h3>Sprites Groups</h3>
      <ul>
        {game.imageGroups.map((group) => (
          <li>
            {group.name} (id: {group.id}): [{group.images.length} sprites]
          </li>
        ))}
      </ul>

      <button onClick={handleAddGroup}>➕ Add Group</button>
    </>
  );
}
