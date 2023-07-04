// import "./libs/riffwave.js";
// import "./libs/sfxr.js";

const sfxr = (window as any).sfxr;

export function initSound(objectFunction: { [key: string]: Function }) {
  objectFunction["playDefaultSound"] = playDefaultSound;
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
