import Zone from './Zone';

export default class EditorState {
  private static zones: { [key: string]: Zone } = {};
  private static zonesId: string[] = [];

  static addZone(zone: Zone) {
    if (EditorState.zonesId.includes(zone.id)) {
      throw new Error('Id is already in GameState');
    } else {
      EditorState.zones[zone.id] = zone;
      EditorState.zonesId.push(zone.id);
    }

    EditorState.updateAssets();
  }

  static isAvailableIdZone(id: string) {
    return !EditorState.zonesId.includes(id);
  }

  static getZoneById(id: string): Zone | undefined {
    return EditorState.zones[id];
  }

  static forEachZone(func: (zone: Zone) => void) {
    EditorState.zonesId.forEach((z) => {
      func(EditorState.zones[z]);
    });
  }

  static updateAssets() {}
}
