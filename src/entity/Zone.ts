export default class Zone {
  readonly id: string;

  private image: File;

  width: number;
  height?: number;
  left: number;
  top: number;

  isEnabled: boolean = false;

  constructor(
    id: string,
    image: File,
    left: number,
    top: number,
    width: number,
    height?: number
  ) {
    this.id = id;
    this.image = image;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }
}
