---
title: Display
tags: nav
---

### Functions
#### watchy.setStatus(zoneId, isEnabled)
Set if the given zone is enabled or not.

##### Parameters
- zoneId (number/string): The ID of the zone (see [zoneId](#zoneId)).
- isEnabled (bool) : True if the zone should be enabled, false otherwise.

#### watchy.setStatusGroup(groupId, isEnabled)
Set if the given group is enabled or not.

##### Parameters
- groupId (number/string): The ID of the group (see [zoneId](#zoneId)).
- isEnabled (bool) : True if the group should be enabled, false otherwise.

#### watchy.printText(idOrName, number)
Print the given text on the given zone.

##### Parameters
- idOrName (number/string): The ID of the text (see [zoneId](#zoneId)).
- number (number/string): The number to print.

### Types
#### zoneId
The id of the zone to enable/disable. If it's a number, the ID of the zone is used, otherwise the name of the zone is used.