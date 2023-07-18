import { WImage } from "../../share/types";
import { OutsideListener } from "../OutsideListener";

export let currentScreenListener = new OutsideListener<"home" | "sprite">();
export let currentSpriteListener = new OutsideListener<WImage | null>();
export let refreshGameListener = new OutsideListener<void>();
export let onDeleteSpriteListener = new OutsideListener<void>();
export let onChangeSpriteListener = new OutsideListener<{
  key: string;
  value: any;
}>();

export let onAddResourceListener = new OutsideListener<void>();
