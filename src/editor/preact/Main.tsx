import { useEffect, useState } from "preact/hooks";
import { Home } from "./Home";
import currentScreenAtom from "./atoms/currentScreen";
import { useAtom } from "jotai";
import { WImage } from "../../share/types";
import { SpriteView } from "./SpriteView";
import gameAtom from "./atoms/gameAtom";
import { loadGame } from "../storage";
import {
  currentScreenListener,
  currentSpriteListener,
  refreshGameListener,
} from "./Listeners";
import { ModalRessource } from "./components/ModalRessource";

function App() {
  let [currentScreen, setCurrentScreen] = useAtom(currentScreenAtom);
  let [, setGame] = useAtom(gameAtom);
  let [currentSprite, setCurrentSprite] = useState<WImage | null>(null);

  useEffect(() => {
    currentScreenListener.addListener((screen) => setCurrentScreen(screen));
    currentSpriteListener.addListener((sprite) => setCurrentSprite(sprite));
    refreshGameListener.addListener(() => setGame(loadGame()));
  }, []);

  return (
    <>
      {currentScreen === "home" && <Home />}
      {currentScreen === "sprite" && <SpriteView sprite={currentSprite!} />}

      <ModalRessource />
    </>
  );
}

export let Main = <App />;
