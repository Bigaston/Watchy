import full from "./full.svg?raw";
import bottom from "./bottom.svg?raw";
import bottomleft from "./bottomleft.svg?raw";
import bottomright from "./bottomright.svg?raw";
import middle from "./middle.svg?raw";
import top from "./top.svg?raw";
import topleft from "./topleft.svg?raw";
import topright from "./topright.svg?raw";

export let segments7 = {
  full: toDataUrl(full),
  bottom: toDataUrl(bottom),
  bottomleft: toDataUrl(bottomleft),
  bottomright: toDataUrl(bottomright),
  middle: toDataUrl(middle),
  top: toDataUrl(top),
  topleft: toDataUrl(topleft),
  topright: toDataUrl(topright),
};

function toDataUrl(svg: string) {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export default segments7;
