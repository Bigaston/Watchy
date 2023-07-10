import { WGameDescription } from "../types/types";
import defaultCode from "./defaultCode.lua?raw";

export let defaultGame: WGameDescription = {
  descriptionVersion: 3,
  nextAvailableImageId: 0,
  nextAvailableSoundId: 0,
  nextAvailableImageGroupId: 0,
  images: [],
  imageGroups: [],
  sounds: [],
  code: defaultCode,
  title: "My Watchy Game",
};
