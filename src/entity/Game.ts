export interface Zone {
  width: number;
  height: number;
  x: number;
  y: number;
  svg: string;
  id: string;
}

export default interface Game {
  name: string;
  zones: Zone[];
}
