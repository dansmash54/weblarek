import { Component } from "../base/Component";
import { ICardData } from "../../types/index";
import { EventEmitter } from "../base/Events";

/**
 * Карточка товара для отображения в корзине
 */
export class CardBasket extends Component<ICardData> {
  protected _id: string = "";
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: EventEmitter,
    index: number,
  ) {
    super(container);

    this._index = container.querySelector(".basket__item-index") as HTMLElement;
    this._title = container.querySelector(".card__title") as HTMLElement;
    this._price = container.querySelector(".card__price") as HTMLElement;
    this._button = container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;

    if (this._index) {
      this._index.textContent = String(index + 1);
    }

    if (this._button) {
      this._button.addEventListener("click", () => {
        this.events.emit("card:remove", { id: this._id });
      });
    }
  }

  set id(value: string) {
    this._id = value;
  }

  set title(value: string) {
    if (this._title) {
      this.setText(this._title, value);
    }
  }

  set price(value: number | null) {
    if (this._price) {
      if (value === null) {
        this.setText(this._price, "Недоступно");
      } else {
        this.setText(this._price, `${value} синапсов`);
      }
    }
  }
}
