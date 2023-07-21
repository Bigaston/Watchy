import { useEffect, useState } from "preact/hooks";
import { Home } from "./Home";
import currentScreenAtom from "./atoms/currentScreen";
import { useAtom } from "jotai";
import { WImage, WNumber } from "../../share/types";
import { SpriteView } from "./SpriteView";
import gameAtom from "./atoms/gameAtom";
import { loadGame } from "../storage";
import {
  currentScreenListener,
  currentSpriteListener,
  currentTextListener,
  refreshGameListener,
} from "./Listeners";
import { ModalRessource } from "./components/ModalRessource";
import { TextView } from "./TextView";

function App() {
  let [currentScreen, setCurrentScreen] = useAtom(currentScreenAtom);
  let [, setGame] = useAtom(gameAtom);
  let [currentSprite, setCurrentSprite] = useState<WImage | null>(null);
  let [currentText, setCurrentText] = useState<WNumber | null>(null);

  useEffect(() => {
    currentScreenListener.addListener((screen) => setCurrentScreen(screen));
    currentSpriteListener.addListener((sprite) => setCurrentSprite(sprite));
    currentTextListener.addListener((text) => setCurrentText(text));
    refreshGameListener.addListener(() => setGame(loadGame()));
  }, []);

  return (
    <>
      {currentScreen === "home" && <Home />}
      {currentScreen === "sprite" && <SpriteView sprite={currentSprite!} />}
      {currentScreen === "text" && <TextView text={currentText!} />}

      <ModalRessource />
    </>
  );
}

export let Main = <App />;
