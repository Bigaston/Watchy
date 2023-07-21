import { useEffect, useState } from "preact/hooks";
import { WNumber } from "../../share/types";
import { onChangeTextListener, onDeleteTextListener } from "./Listeners";

export function TextView({ text }: { text: WNumber }) {
  const [textName, setTextName] = useState(text.name);

  const [numberOfDigits, setNumberOfDigits] = useState(text.numberOfDigits);

  useEffect(() => {
    setTextName(text.name);
    setNumberOfDigits(text.numberOfDigits);
  }, [text]);

  function handleChangeName(event: any) {
    if (event.target.value === "") return;

    setTextName(event.target.value);

    onChangeTextListener.trigger({
      key: "name",
      value: event.target.value,
    });
  }

  function handleChangeDigit(event: any) {
    if (event.target.value === "") return;

    setNumberOfDigits(parseInt(event.target.value));

    onChangeTextListener.trigger({
      key: "numberOfDigits",
      value: parseInt(event.target.value),
    });
  }

  function handleDelete() {
    onDeleteTextListener.trigger();
  }

  return (
    <>
      <h2>
        Text info <span className="spriteId">(id: {text.id})</span>
      </h2>

      <label for="textName">Text Name</label>
      <input
        type="text"
        id="textName"
        value={textName}
        onChange={handleChangeName}
      />

      <label for="numberOfDigits">Number of digits</label>
      <input
        type="number"
        id="numberOfDigits"
        value={numberOfDigits}
        onChange={handleChangeDigit}
      />

      <button onClick={handleDelete}>🚮Delete</button>
    </>
  );
}
