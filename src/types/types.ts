import { Sprite } from "pixi.js";

export interface WGameDescription {
  nextAvailableImageId: number;
  images: WImageDescription[];
  code: string;
}

export interface WImageDescription {
  id: number;
  name: string;
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WImageDescriptionUpdate extends Partial<WImageDescription> {}

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
