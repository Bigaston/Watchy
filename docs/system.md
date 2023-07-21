---
title: System
tags: nav
---
### Main Game Loop
The game loop rely on 4 functions that you can define in your game:
- watchy.init(): Call on the start of the game by the engine
- watchy.update(): Call every frame by the engine before DRAW()
- watchy.gameUpdate(): Call every frame by the engine before DRAW() if the game is not paused
- watchy.draw(): Call every frame by the engine after UPDATE()

You can control the GAME_UPDATE function with the PAUSE() and RESUME() functions (see below).

### Functions
#### watchy.pause()
Pause the game. If the game is paused, the GAME_UPDATE function will not be called.

#### watchy.resume()
Resume the game. If the game is paused, the GAME_UPDATE function will be called.

### Global Variables
#### isPaused
True if the game is paused, false otherwise.