import { atom } from "jotai";

const currentScreenAtom = atom<"home" | "sprite">("home");

export default currentScreenAtom;
