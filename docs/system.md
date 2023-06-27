---
title: System
tags: nav
---
### Main Game Loop
The game loop rely on 4 functions that you can define in your game:
- INIT(): Call on the start of the game by the engine
- UPDATE(): Call every frame by the engine before DRAW()
- GAME_UPDATE(): Call every frame by the engine before DRAW() if the game is not paused
- DRAW(): Call every frame by the engine after UPDATE()

You can control the GAME_UPDATE function with the PAUSE() and RESUME() functions (see below).

### Functions
#### PAUSE()
Pause the game. If the game is paused, the GAME_UPDATE function will not be called.

#### RESUME()
Resume the game. If the game is paused, the GAME_UPDATE function will be called.

### Global Variables
#### IS_PAUSED
True if the game is paused, false otherwise.