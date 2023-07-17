import { Home } from "./Home";
import currentScreenAtom from "./atoms/currentScreen";
import { useAtom } from "jotai";

function App() {
  let [currentScreen, setCurrentScreen] = useAtom(currentScreenAtom);

  return <>{currentScreen === "home" && <Home />}</>;
}

export let Main = <App />;
