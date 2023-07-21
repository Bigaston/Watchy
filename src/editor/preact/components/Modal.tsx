import { ComponentChildren } from "preact";
import "./modal.css";

export function Modal({
  children,
  isOpened,
  onClose,
}: {
  children: ComponentChildren | null;
  isOpened: boolean;
  onClose?: () => void;
}) {
  function onClickClose(e: any) {
    if (e.target.classList.contains("modal-background")) {
      if (onClose) onClose();
    }
  }

  return isOpened ? (
    <>
      <p>Bruh</p>
      <div className="modal-background" onClick={onClickClose}>
        <div className="modal">{children}</div>
      </div>
    </>
  ) : null;
}
