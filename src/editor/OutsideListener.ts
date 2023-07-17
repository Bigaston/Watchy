export class OutsideListener<T> {
  private _listeners: Array<(passedValue: T) => void> = [];

  public addListener(listener: (passedValue: T) => void) {
    this._listeners.push(listener);
  }

  public removeListener(listener: (passedValue: T) => void) {
    this._listeners = this._listeners.filter((l) => l !== listener);
  }

  public clearListeners() {
    this._listeners = [];
  }

  public trigger(passedValue: T) {
    this._listeners.forEach((l) => l(passedValue));
  }
}
