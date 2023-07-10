import { Sprite } from "pixi.js";

export interface WGameDescription {
  descriptionVersion: 3;
  nextAvailableImageId: number;
  nextAvailableSoundId: number;
  nextAvailableImageGroupId: number;
  images: WImageDescription[];
  imageGroups: WImageGroup[];
  sounds: WSoundDescription[];
  code: string;
  title: string;
  background?: string;
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

export enum WImageStatus {
  ON,
  OFF,
}

export interface WImage {
  id: number;
  name: string;
  sprite: Sprite;
  status: WImageStatus;
}

export interface WImageGroup {
  id: number;
  name: string;
  images: number[];
}
