// import "./libs/riffwave.js";
// import "./libs/sfxr.js";

import {
  WGameDescription,
  WSoundDescription,
  WSoundDescriptionJSFXR,
} from "../types/types";

const sfxr = (window as any).sfxr;

let audios: WSoundDescription[] = [];

export function initSound(
  objectFunction: { [key: string]: Function },
  gameDescription: WGameDescription
) {
  objectFunction["playDefaultSound"] = playDefaultSound;
  objectFunction["playSound"] = playSound;

  audios.splice(0, audios.length);
  audios = [...gameDescription.sounds];
}

const availableName = [
  "pickupCoin",
  "laserShoot",
  "explosion",
  "powerUp",
  "hitHurt",
  "jump",
  "blipSelect",
  "synth",
  "tone",
  "click",
  "random",
];

function playDefaultSound(soundName: string) {
  if (!availableName.includes(soundName)) {
    console.error("Sound name not available: " + soundName);

    return;
  }

  let sound = sfxr.generate(soundName);
  sfxr.play(sound);
}

function playSound(idOrName: string | number) {
  const audio = audios.find((s) => {
    return s.id === idOrName || s.name === idOrName;
  });

  if (audio == null) return;

  if (audio.type === "jsfxr") {
    sfxr.toAudio((audio as WSoundDescriptionJSFXR).content).play();
  }
}
