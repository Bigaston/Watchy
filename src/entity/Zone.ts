let screen = document.getElementById('consoleScreen') as HTMLDivElement;

export default class Zone {
  readonly id: string;

  private _component: SVGElement;

  width: number;
  height: number;
  x: number;
  y: number;

  isEnabled: boolean = false;

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    svgContent: string
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;

    let template = document.createElement('template');
    svgContent = svgContent.trim();
    template.innerHTML = svgContent;

    let svg = template.content.firstChild as SVGElement;
    console.log(svg);

    svg.id = 'zone-' + id;
    svg.classList.add('zone');

    svg.setAttribute('preserveAspectRatio', 'none');

    svg.style.width = width + '%';
    svg.style.height = height + '%';
    svg.style.left = x + '%';
    svg.style.top = y + '%';

    this._component = svg;

    document.getElementById('consoleScreen').appendChild(svg);
  }

  public get component() {
    return this._component;
  }

  public on() {
    this._component.classList.add('zone-enabled');
  }

  public off() {
    this._component.classList.remove('zone-enabled');
  }

  public setStatus(status: 'ON' | 'OFF') {
    if (status === 'ON') {
      this._component.classList.add('zone-enabled');
    } else {
      this._component.classList.remove('zone-enabled');
    }
  }

  public getStatus(): 'ON' | 'OFF' {
    return this._component.classList.contains('zone-enabled') ? 'ON' : 'OFF';
  }

  public toggleStatus(): 'ON' | 'OFF' {
    this._component.classList.toggle('zone-enabled');

    return this._component.classList.contains('zone-enabled') ? 'ON' : 'OFF';
  }
}
