import { useState } from "preact/hooks";
import { loadGame, saveGame } from "../storage";
import { onSelectSpriteFromDescription, updateBackground } from "../editorView";
import { WSoundDescription, WSoundDescriptionAudio, WSoundDescriptionJSFXR } from "../../share/types";
import { useAtom } from "jotai";
import gameAtom from "./atoms/gameAtom";
import { colourToString, stringToColour } from "../../utils";
import { onPaletteChangeListener } from "./Listeners";
import { PALETTE } from "../../share/colorPalette";
import {Howl} from 'howler';

const sfxr = (window as any).sfxr;

export function Home() {
  let [game, setGame] = useAtom(gameAtom);
  let [title, setTitle] = useState(game.title);

  let [backgroundColor, setBackgroundColor] = useState(
    colourToString(game.palette.background)
  );
  let [onColor, setOnColor] = useState(colourToString(game.palette.on));
  let [offColor, setOffColor] = useState(colourToString(game.palette.off));

  function handleChangeTitle(event: any) {
    saveGame({ ...game, title: event.target.value });
    setGame({ ...game, title: event.target.value });
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
        saveGame({ ...game, background: reader.result as string });
        setGame({ ...game, background: reader.result as string });

        updateBackground();
      };
      reader.readAsDataURL(input.files[0]);
    });

    input.click();
  }

  function handleDeleteBackground() {
    saveGame({ ...game, background: undefined });
    setGame({ ...game, background: undefined });
    updateBackground();
  }

  function handleAddGroup() {
    let name = prompt("Group Name");
    if (name) {
      let g = {
        ...game,
        nextAvailableImageGroupId: game.nextAvailableImageGroupId + 1,
        imageGroups: [
          ...game.imageGroups,
          {
            id: game.nextAvailableImageGroupId,
            name,
            images: [],
          },
        ],
      };
      console.log(g);

      saveGame(g);
      setGame(g);
    }
  }

  function playSound(sound: WSoundDescription) {
    if (sound.type === "jsfxr") {
      sfxr.toAudio((sound as WSoundDescriptionJSFXR).content).play();
    } else {
      let howl = new Howl({
        src: [(sound as WSoundDescriptionAudio).content],
      })

      howl.play();
    }
  }

  function onDeleteSound(sound: WSoundDescription) {
    saveGame({
      ...loadGame(),
      sounds: loadGame().sounds.filter((s) => s.id !== sound.id),
    });

    setGame(loadGame());
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

      <h3>Palette</h3>
      <div className="paletteDiv">
        <label for="backgroundColor">Background Color: </label>
        <input
          type="color"
          id="backgroundColor"
          name="backgroundColor"
          value={backgroundColor}
          onChange={(e) => {
            setBackgroundColor((e.target as HTMLInputElement).value);
            saveGame({
              ...game,
              palette: {
                ...game.palette,
                background: stringToColour(
                  (e.target as HTMLInputElement).value
                ),
              },
            });
            setGame((g) => ({
              ...g,
              palette: {
                ...g.palette,
                background: stringToColour(
                  (e.target as HTMLInputElement).value
                ),
              },
            }));

            onPaletteChangeListener.trigger({
              key: "background",
              color: stringToColour((e.target as HTMLInputElement).value),
            });
          }}
        />
        <label for="onColor">On Color: </label>
        <input
          type="color"
          id="onColor"
          name="onColor"
          value={onColor}
          onChange={(e) => {
            setOnColor((e.target as HTMLInputElement).value);

            saveGame({
              ...game,
              palette: {
                ...game.palette,
                on: stringToColour((e.target as HTMLInputElement).value),
              },
            });
            setGame((g) => ({
              ...g,
              palette: {
                ...g.palette,
                on: stringToColour((e.target as HTMLInputElement).value),
              },
            }));

            onPaletteChangeListener.trigger({
              key: "on",
              color: stringToColour((e.target as HTMLInputElement).value),
            });
          }}
        />
        <label for="offColor">Off Color: </label>
        <input
          type="color"
          id="offColor"
          name="offColor"
          value={offColor}
          onChange={(e) => {
            setOffColor((e.target as HTMLInputElement).value);

            saveGame({
              ...game,
              palette: {
                ...game.palette,
                off: stringToColour((e.target as HTMLInputElement).value),
              },
            });

            setGame((g) => ({
              ...g,
              palette: {
                ...g.palette,
                off: stringToColour((e.target as HTMLInputElement).value),
              },
            }));

            onPaletteChangeListener.trigger({
              key: "off",
              color: stringToColour((e.target as HTMLInputElement).value),
            });
          }}
        />

        <button
          onClick={() => {
            setBackgroundColor(colourToString(PALETTE.BACKGROUND));
            setOnColor(colourToString(PALETTE.ON));
            setOffColor(colourToString(PALETTE.OFF));

            saveGame({
              ...game,
              palette: {
                ...game.palette,
                background: PALETTE.BACKGROUND,
                on: PALETTE.ON,
                off: PALETTE.OFF,
              },
            });

            setGame((g) => ({
              ...g,
              palette: {
                ...g.palette,
                background: PALETTE.BACKGROUND,
                on: PALETTE.ON,
                off: PALETTE.OFF,
              },
            }));

            onPaletteChangeListener.trigger({
              key: "background",
              color: PALETTE.BACKGROUND,
            });

            onPaletteChangeListener.trigger({
              key: "on",
              color: PALETTE.ON,
            });

            onPaletteChangeListener.trigger({
              key: "off",
              color: PALETTE.OFF,
            });
          }}
        >
          Reset Palette
        </button>
      </div>

      <h3>Sprites</h3>
      <ul>
        {game.images.map((image) => (
          <li
            className="spriteItem"
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

      <h3>Sounds</h3>
      <ul>
        {game.sounds.map((sound) => (
          <li>
            {sound.name} (id: {sound.id}){" "}
            <button onClick={() => playSound(sound)}>🔊 Play</button>
            <button onClick={() => onDeleteSound(sound)}>🚮 Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}
