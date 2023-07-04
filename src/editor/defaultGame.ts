import { WGameDescription } from "../types/types";

export let defaultGame: WGameDescription = {
  nextAvailableImageId: 0,
  images: [],
  code: "function INIT()\n\nend\n\nfunction UPDATE(dt)\n\nend\n\nfunction GAME_UPDATE(dt)\n\nend\n\nfunction DRAW()\n\nend",
  title: "My Watchy Game",
};
