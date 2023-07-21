import { WImage, WNumber } from "../../share/types";
import { OutsideListener } from "../OutsideListener";

export let currentScreenListener = new OutsideListener<
  "home" | "sprite" | "text"
>();
export let currentSpriteListener = new OutsideListener<WImage | null>();
export let currentTextListener = new OutsideListener<WNumber | null>();
export let refreshGameListener = new OutsideListener<void>();
export let onAddResourceListener = new OutsideListener<void>();

export let onDeleteSpriteListener = new OutsideListener<void>();
export let onChangeSpriteListener = new OutsideListener<{
  key: string;
  value: any;
}>();

export let onDeleteTextListener = new OutsideListener<void>();
export let onChangeTextListener = new OutsideListener<{
  key: string;
  value: any;
}>();
