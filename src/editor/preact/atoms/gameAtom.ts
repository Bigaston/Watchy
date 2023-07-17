import { atom } from "jotai";
import { WGameDescription } from "../../../share/types";
import { loadGame } from "../../storage";

const gameAtom = atom<WGameDescription>(loadGame());

export default gameAtom;
