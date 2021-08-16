import { toBase64 } from '../editor/utils';

export default class Zone {
  readonly id: string;

  private _image: File;
  private _imageUrl: string;

  width: number;
  height?: number;
  left: number;
  top: number;

  isEnabled: boolean = false;

  constructor(
    id: string,
    image: File,
    imageUrl: string,
    left: number,
    top: number,
    width: number,
    height?: number
  ) {
    this.id = id;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;

    this._image = image;
    this._imageUrl = imageUrl;
  }

  public get image() {
    return this._image;
  }

  public get imageUrl() {
    return this._imageUrl;
  }
}
