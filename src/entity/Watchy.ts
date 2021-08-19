import Zone from './Zone';

type Key = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'A' | 'B';

let KeyDown: string[] = [];

window.addEventListener('keydown', (e) => {
  if (!KeyDown.includes(e.key)) KeyDown.push(e.key);

  KeyListener[KeyAssociationInverted[e.key]].forEach((func) => {
    func(KeyAssociationInverted[e.key] as Key);
  });
});

window.addEventListener('keyup', (e) => {
  if (KeyDown.includes(e.key)) KeyDown = KeyDown.filter((k) => k !== e.key);
});

const KeyAssociation: { [key: string]: string[] } = {
  UP: ['ArrowUp'],
  DOWN: ['ArrowDown'],
  LEFT: ['ArrowLeft'],
  RIGHT: ['ArrowRight'],
  A: ['a'],
  B: ['b'],
};

const KeyAssociationInverted: { [key: string]: string } = {};

const KeyListener: { [key: string]: ((key: Key) => void)[] } = {
  UP: [],
  DOWN: [],
  LEFT: [],
  RIGHT: [],
  A: [],
  B: [],
};

Object.keys(KeyAssociation).forEach((k) => {
  KeyAssociation[k].forEach((e) => {
    KeyAssociationInverted[e] = k;
  });
});

export default class Watchy {
  private static zones: { [key: string]: Zone } = {};
  private static zonesId: string[] = [];
  private static _fps: number = 10;

  static init: () => void | undefined = undefined;
  static update: () => void | undefined = undefined;
  static draw: () => void | undefined = undefined;

  static addZone(zone: Zone) {
    if (Watchy.zonesId.includes(zone.id)) {
      throw new Error('Id is already in GameState');
    } else {
      Watchy.zones[zone.id] = zone;
      Watchy.zonesId.push(zone.id);
    }
  }

  static isAvailableIdZone(id: string) {
    return !Watchy.zonesId.includes(id);
  }

  static getZoneById(id: string): Zone | undefined {
    return Watchy.zones[id];
  }

  static isKeyDown(key: Key): boolean {
    return KeyAssociation[key].some((r) => KeyDown.includes(r));
  }

  static onKeyPressed(key: Key, callBack: (key?: Key) => void) {
    KeyListener[key].push(callBack);
  }

  static releaseKeypressed(key: Key, callback: (key?: Key) => void) {
    KeyListener[key] = KeyListener[key].filter((call) => call !== callback);
  }

  static get fps() {
    return Watchy._fps;
  }

  static set fps(newFps: number) {
    Watchy._fps = newFps;
  }
}
