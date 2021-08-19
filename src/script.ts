import './style.css';
import './Console/ConsoleScreen';

import Zone from './entity/Zone';
import Watchy from './entity/Watchy';

import GameConfig from '../projects/Train/config';
import '../projects/Train/train';

// Préparation du jeu
document.title = GameConfig.name + ' - Watchy';

GameConfig.zones.forEach((z) => {
  let zone = new Zone(z.id, z.x, z.y, z.width, z.height, z.svg);

  Watchy.addZone(zone);
});

if (Watchy.init !== undefined) {
  Watchy.init();
}

let lastFrame = Date.now();
function tick() {
  if (Date.now() - lastFrame > 1000 / Watchy.fps) {
    lastFrame = Date.now();
    if (Watchy.update !== undefined) {
      Watchy.update();
    }

    if (Watchy.draw !== undefined) {
      Watchy.draw();
    }
  }

  window.requestAnimationFrame(tick);
}

tick();
