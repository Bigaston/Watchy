import { WGameDescription } from "../types/types";
import defaultCode from "./defaultCode.lua?raw";

export let defaultGame: WGameDescription = {
  nextAvailableImageId: 0,
  nextAvailableSoundId: 0,
  images: [],
  sounds: [],
  code: defaultCode,
  title: "My Watchy Game",
};
