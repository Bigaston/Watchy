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

    EditorState.updateScreen();
  }

  static isAvailableIdZone(id: string) {
    return !EditorState.zonesId.includes(id);
  }

  static updateScreen() {
    let screen = document.getElementById('consoleScreen') as HTMLDivElement;

    EditorState.zonesId.forEach((id) => {
      EditorState.zones[id].draw();
    });
  }
}
