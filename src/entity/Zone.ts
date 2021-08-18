export default class Zone {
  readonly id: string;

  private _image: File;
  private _component: SVGElement;

  width: number;
  height?: number;
  left: number;
  top: number;

  isEnabled: boolean = false;

  constructor(
    id: string,
    image: File,
    svgContent: string,
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

    let template = document.createElement('template');
    svgContent = svgContent.trim();
    template.innerHTML = svgContent;

    let svg = template.content.firstChild as SVGElement;
    console.log(svg);

    svg.classList.add('zone');

    svg.style.width = width + '%';
    svg.style.height = '100%';
    svg.style.top = top + '%';
    svg.style.left = left + '%';

    this._component = svg;

    document.getElementById('consoleScreen').appendChild(svg);
  }

  public get image() {
    return this._image;
  }

  draw() {}
}
