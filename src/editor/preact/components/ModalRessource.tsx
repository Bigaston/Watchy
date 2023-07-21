import { useEffect, useState } from "preact/hooks";
import { Modal } from "./Modal";
import { addNumber, addSprite } from "../../editorView";
import gameAtom from "../atoms/gameAtom";
import { useAtom } from "jotai";
import {
  WNumberDescription,
  WSoundDescriptionJSFXR,
} from "../../../share/types";
import { saveGame } from "../../storage";
import { onAddResourceListener } from "../Listeners";

export function ModalRessource() {
  const [isOpened, setIsOpened] = useState(false);
  const [isModalSoundOpened, setIsModalSoundOpened] = useState(false);
  const [isModalTextOpen, setIsModalTextOpen] = useState(false);

  useEffect(() => {
    onAddResourceListener.addListener(() => {
      setIsOpened(true);
    });
  }, []);

  const [game, setGame] = useAtom(gameAtom);

  const [labelSoundValue, setLabelSoundValue] = useState("");
  const [soundCodeValue, setSoundCodeValue] = useState("");

  const [labelTextValue, setLabelTextValue] = useState("");
  const [textNumberDigit, setTextNumberDigit] = useState(5);

  function addImage() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/svg+xml";

    input.addEventListener("change", () => {
      if (!input.files) return;

      addSprite(input.files![0]);
      setIsOpened(false);
    });

    input.click();
  }

  function addSound() {
    setIsOpened(false);
    setIsModalSoundOpened(true);
  }

  function handleAddSound() {
    let sound: WSoundDescriptionJSFXR = {
      type: "jsfxr",
      content: soundCodeValue,
      id: game.nextAvailableSoundId,
      name: labelSoundValue,
    };

    game.sounds.push(sound);
    game.nextAvailableSoundId++;

    saveGame(game);
    setGame(game);

    setIsOpened(false);
    setIsModalSoundOpened(false);
  }

  function addText() {
    setIsModalTextOpen(true);
    setIsOpened(false);
  }

  function handleAddText() {
    if (labelTextValue === "") return;
    if (textNumberDigit === 0) return;

    let wNumber: WNumberDescription = {
      id: game.nextAvailableNumberId,
      name: labelTextValue,
      x: 0,
      y: 0,
      height: 30,
      numberDigit: textNumberDigit,
    };

    saveGame({
      ...game,
      nextAvailableNumberId: game.nextAvailableNumberId + 1,
      numbers: game.numbers.concat(wNumber),
    });
    setGame({
      ...game,
      nextAvailableNumberId: game.nextAvailableNumberId + 1,
      numbers: game.numbers.concat(wNumber),
    });

    addNumber(wNumber);
    setIsModalTextOpen(false);
  }

  return (
    <>
      <Modal isOpened={isOpened} onClose={() => setIsOpened(false)}>
        <h2>Add Ressource</h2>

        <button className="button-primary" onClick={addImage}>
          🖼️ Add Sprite
        </button>
        <button className="button-primary" onClick={addSound}>
          🔊 Add Sound
        </button>
        <button className="button-primary" onClick={addText}>
          📝 Add Text
        </button>
      </Modal>

      <Modal
        isOpened={isModalSoundOpened}
        onClose={() => setIsModalSoundOpened(false)}
      >
        <h2>Add Sounds</h2>

        <p>
          Watchy use{" "}
          <a href="https://sfxr.me/" target="_blank">
            JSFXR
          </a>{" "}
          to generate souynd. You can past the code generated by JSFXR here:
        </p>

        <label>Sound Name</label>
        <input
          value={labelSoundValue}
          onChange={(e) =>
            setLabelSoundValue((e.target as HTMLInputElement).value)
          }
          style={{ width: "100%" }}
        />

        <label>Sound code</label>
        <input
          value={soundCodeValue}
          onChange={(e) =>
            setSoundCodeValue((e.target as HTMLInputElement).value)
          }
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button className="button-primary" onClick={handleAddSound}>
          Add Sound
        </button>
      </Modal>

      <Modal
        isOpened={isModalTextOpen}
        onClose={() => setIsModalTextOpen(false)}
      >
        <h2>Add Text</h2>

        <label>Number name</label>
        <input
          value={labelTextValue}
          onChange={(e) =>
            setLabelTextValue((e.target as HTMLInputElement).value)
          }
        />

        <br />

        <label>Number of digits</label>
        <input
          type="number"
          value={textNumberDigit}
          onChange={(e) => {
            if ((e.target as HTMLInputElement).value === "") return;

            setTextNumberDigit(parseInt((e.target as HTMLInputElement).value));
          }}
        />

        <button className="button-primary" onClick={handleAddText}>
          Add Text
        </button>
      </Modal>
    </>
  );
}
