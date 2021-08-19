import './style.css';
import './Console/ConsoleScreen';

import Zone from './entity/Zone';
import GameState from './entity/EditorState';

import Game from '../projects/Train/Train';

// Préparation du jeu
document.title = Game.name + ' - Watchy';

Game.zones.forEach((z) => {
  let zone = new Zone(z.id, z.x, z.y, z.width, z.height, z.svg);

  GameState.addZone(zone);
});
