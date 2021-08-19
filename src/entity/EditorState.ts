import Zone from './Zone';

export default class GameState {
  private static zones: { [key: string]: Zone } = {};
  private static zonesId: string[] = [];

  static addZone(zone: Zone) {
    if (GameState.zonesId.includes(zone.id)) {
      throw new Error('Id is already in GameState');
    } else {
      GameState.zones[zone.id] = zone;
      GameState.zonesId.push(zone.id);
    }

    GameState.updateAssets();
  }

  static isAvailableIdZone(id: string) {
    return !GameState.zonesId.includes(id);
  }

  static getZoneById(id: string): Zone | undefined {
    return GameState.zones[id];
  }

  static updateAssets() {}
}
