import { Container, Sprite } from "pixi.js";

export interface WGameDescription {
  descriptionVersion: 3;
  nextAvailableImageId: number;
  nextAvailableSoundId: number;
  nextAvailableImageGroupId: number;
  nextAvailableNumberId: number;
  images: WImageDescription[];
  imageGroups: WImageGroup[];
  sounds: WSoundDescription[];
  numbers: WNumberDescription[];
  code: string;
  title: string;
  background?: string;
  palette: {
    background: number;
    off: number;
    on: number;
  };
}

export interface WSoundDescription {
  id: number;
  name: string;
  type: "jsfxr" | "audio";
}

export interface WSoundDescriptionJSFXR extends WSoundDescription {
  type: "jsfxr";
  content: string;
}

export interface WSoundDescriptionAudio extends WSoundDescription {
  type: "audio";
  content: string;
}

export interface WImageDescription {
  id: number;
  name: string;
  path: string;
  x: number;
  y: number;
  angle: number;
  width: number;
  height: number;
}

export interface WNumberDescription {
  id: number;
  name: string;
  x: number;
  y: number;
  height: number;
  numberDigit: number;
}

export enum WImageStatus {
  ON,
  OFF,
}

export interface WSelectable {
  id: number;
  type: "image" | "number";
  name: string;
  container: Container;
}

export interface WNumber extends WSelectable {
  type: "number";
  numberOfDigits: number;
  digits?: WDigit[];
}

export interface WDigit {
  top: Sprite;
  middle: Sprite;
  bottom: Sprite;
  topleft: Sprite;
  topright: Sprite;
  bottomleft: Sprite;
  bottomright: Sprite;
}

export interface WImage extends WSelectable {
  type: "image";
  status: WImageStatus;
  groups: number[];
  container: Sprite;
}

export interface WImageGroup {
  id: number;
  name: string;
  images: number[];
}
