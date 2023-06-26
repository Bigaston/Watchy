export function isOk(res: Response) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Failed to fetch game.json");
  }
}

export function isOkText(res: Response) {
  if (res.ok) {
    return res.text();
  } else {
    throw new Error("Failed to fetch code.lua");
  }
}
