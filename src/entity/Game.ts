export interface Zone {
  width: number;
  height: number;
  x: number;
  y: number;
  svg: string;
  id: string;
}

export default interface GameConfig {
  name: string;
  zones: Zone[];
}
