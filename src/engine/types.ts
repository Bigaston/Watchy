import { Sprite } from "pixi.js";

export interface WGameDescription {
  images: WImageDescription[];
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
