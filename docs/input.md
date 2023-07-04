---
title: Input
tags: nav
---

### Functions
#### watchy.btn_pressed(inputId)
Return the status of the button with the given id.

##### Parameters
- inputId (string): The ID of the Input (see [inputId](#inputId)).

#### watchy.btn_just_pressed(inputId)
Return true the first time the function is called since the button was pressed.

##### Parameters
- inputId (string): The ID of the Input (see [inputId](#inputId)).

### Types
#### inputId
The id of the button to check. One of:
- LEFT
- RIGHT
- UP
- DOWN
- A
- B