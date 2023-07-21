import { atom } from "jotai";

const currentScreenAtom = atom<"home" | "sprite" | "text">("home");

export default currentScreenAtom;
