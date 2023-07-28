import { useEffect, useState } from "preact/hooks";
import { WGameDescription, WImage } from "../../share/types";
import classNames from "classnames";
import { saveGame } from "../storage";
import { onChangeSpriteListener, onDeleteSpriteListener } from "./Listeners";
import { useAtom } from "jotai";
import gameAtom from "./atoms/gameAtom";
import { createSprite } from "../editorView";

export function SpriteView({
  sprite,
}: // onChange,
// onDelete,
{
  sprite: WImage;
  // onChange: (key: string, value: any) => void;
  // onDelete: () => void;
}) {
  let [game, setGame] = useAtom(gameAtom);
  let [spriteName, setSpriteName] = useState(sprite.name);
  let [errorSpriteName, setErrorSpriteName] = useState("");

  useEffect(() => {
    setSpriteName(sprite.name);
    setErrorSpriteName("");
  }, [sprite]);

  let [addGroupValue, setAddGroupValue] = useState("-1");

  function handleChangeSpriteName(event: any) {
    if (event.target.value === "") {
      setErrorSpriteName("Name cannot be empty");
    } else {
      setErrorSpriteName("");
      setSpriteName(event.target.value);
      onChangeSpriteListener.trigger({
        key: "name",
        value: event.target.value,
      });

      setGame({
        ...game,
        images: game.images.map((image) => {
          if (image.id === sprite.id) {
            image.name = event.target.value;
          }
          return image;
        }),
      });
    }
  }

  function handleDelete() {
    onDeleteSpriteListener.trigger();
  }

  function handleAddGroup() {
    if (addGroupValue === "-1") return;

    let group = game.imageGroups.find(
      (group) => group.id === parseInt(addGroupValue)
    );

    if (group) {
      group.images.push(sprite.id);

      saveGame({
        ...game,
        imageGroups: game.imageGroups.map((g) =>
          g.id === group!.id ? group! : g
        ),
      });

      setGame({
        ...game,
        imageGroups: game.imageGroups.map((g) =>
          g.id === group!.id ? group! : g
        ),
      });

      setAddGroupValue("-1");
    }
  }

  function handleDeleteGroup(groupId: number) {
    let g: WGameDescription = {
      ...game,
      imageGroups: game.imageGroups.map((g) => {
        if (g.id === groupId) {
          g.images = g.images.filter((id) => id !== sprite.id);
        }
        return g;
      }),
    };

    saveGame(g);
    setGame(g);
  }

  function handleDuplicate() {
    let spr = game.images.find((i) => i.id === sprite.id)!;

    let newSpr = {
      ...spr,
      id: game.nextAvailableImageId,
      name: spr.name + " (copy)",
      x: spr.x + 10,
      y: spr.y + 10,
    };

    let g: WGameDescription = {
      ...game,
      nextAvailableImageId: game.nextAvailableImageId + 1,
      images: [...game.images, newSpr],
    };

    saveGame(g);
    setGame(g);
    createSprite(newSpr);
  }

  return (
    <>
      <h2>
        Sprite Info <span className="spriteId">(id: {sprite.id})</span>
      </h2>

      <label for="editorSpriteName">Name:</label>
      <input
        type="text"
        id="editorSpriteName"
        name="editorSpriteName"
        value={spriteName}
        onChange={handleChangeSpriteName}
        className={classNames({ error: errorSpriteName })}
      />

      <br />

      <button className="button-error" onClick={handleDelete}>
        🚮 Delete
      </button>

      <button onClick={handleDuplicate}>📝 Duplicate</button>

      <br />

      <h3>Sprite Groups</h3>
      {game.imageGroups.length === 0 ? (
        <p>No groups yet, go to the game page to add some</p>
      ) : (
        <>
          <ul>
            {game.imageGroups
              .filter((group) => group.images.includes(sprite.id))
              .map((group) => (
                <li key={group.id}>
                  {group.name}{" "}
                  <button onClick={() => handleDeleteGroup(group.id)}>
                    🚮
                  </button>
                </li>
              ))}
          </ul>

          <div class="selectGroup">
            <select
              value={addGroupValue}
              onChange={(e) =>
                setAddGroupValue((e.target as HTMLSelectElement).value)
              }
            >
              <option value="-1">Select a group...</option>
              {game.imageGroups
                .filter((imageGroup) => !imageGroup.images.includes(sprite.id))
                .map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
            </select>

            <button onClick={handleAddGroup} disabled={addGroupValue === "-1"}>
              ➕ Add to group
            </button>
          </div>
        </>
      )}
    </>
  );
}
