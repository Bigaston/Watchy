import './style.css';
import './Console/ConsoleScreen';

import Game from '../projects/Train/Train';
import Zone from './entity/Zone';
import GameState from './entity/EditorState';

// Préparation du jeu
document.title = Game.name + ' - Watchy';

Game.zones.forEach((z) => {
  let zone = new Zone(z.id, z.x, z.y, z.width, z.height, z.svg);

  GameState.addZone(zone);
});
