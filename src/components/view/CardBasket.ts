import { Component } from "../base/Component";
import { ICardData } from "../../types/index";
import { ensureElement } from "../../utils/utils";

/**
 * Карточка товара для отображения в корзине
 */
export class CardBasket extends Component<ICardData> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    index: number,
    private onDelete: () => void,
  ) {
    super(container);

    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._price = ensureElement<HTMLElement>(".card__price", container);
    this._button = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    this._index.textContent = String(index + 1);

    this._button.addEventListener("click", () => {
      onDelete();
    });
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number | null) {
    this.setText(
      this._price,
      value === null ? "Недоступно" : `${value} синапсов`,
    );
  }
}
