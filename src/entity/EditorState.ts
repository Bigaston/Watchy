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
    let screen = document.getElementById('consoleScreen') as HTMLCanvasElement;

    let width = window.innerWidth / 2;
    let height = window.innerWidth * 0.75;

    screen.width = width;
    screen.height = height;

    let ctx = screen.getContext('2d');

    ctx.fillStyle = '#edb4a1';
    ctx.fillRect(0, 0, height, width);

    EditorState.zonesId.forEach((z) => {});
  }
}
