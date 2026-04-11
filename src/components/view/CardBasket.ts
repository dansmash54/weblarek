import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

/**
 * Карточка товара для отображения в корзине
 */
export class CardBasket extends Card {
  protected _index: HTMLElement;

  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    index: number,
    private onDelete: () => void,
  ) {
    super(container);

    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._button = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    this._index.textContent = String(index + 1);

    this._button.addEventListener("click", () => {
      onDelete();
    });
  }

  set price(value: number | null) {
    if (this._price) {
      this.setText(
        this._price,
        value === null ? "Недоступно" : `${value} синапсов`,
      );
    }
  }
}
