import { useEffect, useState } from "preact/hooks";
import { OutsideListener } from "../OutsideListener";
import { Home } from "./Home";
import currentScreenAtom from "./atoms/currentScreen";
import { useAtom } from "jotai";
import { WImage } from "../../share/types";
import { SpriteView } from "./SpriteView";
import gameAtom from "./atoms/gameAtom";
import { loadGame } from "../storage";

export let currentScreenListener = new OutsideListener<"home" | "sprite">();
export let currentSpriteListener = new OutsideListener<WImage | null>();
export let refreshGameListener = new OutsideListener<void>();
export let onDeleteSpriteListener = new OutsideListener<void>();
export let onChangeSpriteListener = new OutsideListener<{
  key: string;
  value: any;
}>();

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
    </>
  );
}

export let Main = <App />;
