let screen = document.getElementById('consoleScreen') as HTMLDivElement;

export default class Zone {
  readonly id: string;

  private _image: File;
  private _component: SVGElement;

  width: number;
  height?: number;
  x: number;
  y: number;

  isEnabled: boolean = false;

  constructor(id: string, image: File, svgContent: string) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.width = 50;

    this._image = image;

    let template = document.createElement('template');
    svgContent = svgContent.trim();
    template.innerHTML = svgContent;

    let svg = template.content.firstChild as SVGElement;
    console.log(svg);

    svg.id = 'zone-' + id;
    svg.classList.add('zone');

    svg.setAttribute('preserveAspectRatio', 'none');

    svg.style.width = '50%';

    this.height = (svg.clientHeight / screen.clientHeight) * 100;
    this._component = svg;

    document.getElementById('consoleScreen').appendChild(svg);
  }

  public get image() {
    return this._image;
  }
}
