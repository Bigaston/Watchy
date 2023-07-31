import { WGameDescription } from "../share/types";
import defaultCode from "./defaultCode.lua?raw";

export let defaultGame: WGameDescription = {
  descriptionVersion: 3,
  nextAvailableImageId: 0,
  nextAvailableSoundId: 0,
  nextAvailableImageGroupId: 0,
  nextAvailableNumberId: 0,
  images: [],
  imageGroups: [],
  numbers: [],
  sounds: [],
  code: defaultCode,
  title: "My Watchy Game",
  palette: {
    background: 0xedb4a1,
    off: 0xdb9797,
    on: 0x2c2137,
  },
};
