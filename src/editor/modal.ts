import "../styles/modal.css";

import crel from "crel";

export class Modal {
  private _modal: HTMLElement;
  private _background: HTMLElement;

  constructor(content?: HTMLElement) {
    this._background = crel("div", { class: "modal-background" });
    this._background.classList.add("modal-background");

    this._modal = document.createElement("div");
    this._modal.classList.add("modal");
    if (content) this._modal.appendChild(content);

    this._background.appendChild(this._modal);

    this._background.addEventListener("click", (e) => {
      if (e.target !== this._background) return;
      this.close();
    });

    document.body.appendChild(this._background);
  }

  public setContent(content: HTMLElement) {
    this._modal.innerHTML = "";
    this._modal.appendChild(content);
  }

  public close() {
    this._modal.remove();
    this._background.remove();
  }
}
