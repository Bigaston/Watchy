import Zone from './Zone';

export class GameState {
  private static zones: { [key: string]: Zone } = {};
  private static zonesId: string[] = [];

  static addZone(zone: Zone) {
    if (GameState.zonesId.includes(zone.id)) {
      throw new Error('Id is already in GameState');
    } else {
      GameState.zones[zone.id] = zone;
      GameState.zonesId.push(zone.id);
    }

    console.log(GameState.zones);
  }

  static isAvailableIdZone(id: string) {
    return !GameState.zonesId.includes(id);
  }
}
