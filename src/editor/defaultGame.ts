import { WGameDescription } from "../types/types";
import defaultCode from "./defaultCode.lua?raw";

export let defaultGame: WGameDescription = {
  nextAvailableImageId: 0,
  images: [],
  code: defaultCode,
  title: "My Watchy Game",
};
