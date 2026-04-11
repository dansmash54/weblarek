import { Component } from "../base/Component";
import { IBasketData } from "../../types/index";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class Basket extends Component<IBasketData> {
  protected _list: HTMLElement; // список
  protected _total: HTMLElement; // сумма
  protected _button: HTMLButtonElement; // оформить заказ (кнопка)

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    // находим элементы в DOM
    this._list = ensureElement<HTMLElement>(".basket__list", container);
    this._total = ensureElement<HTMLElement>(".basket__price", container);
    this._button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    // при клике на "Оформить" генерируем событие для презентера
    if (this._button) {
      this._button.disabled = true;
      this._button.addEventListener("click", () => {
        events.emit("basket:order");
      });
    }
  }

  set items(items: HTMLElement[]) {
    if (this._list) {
      if (items.length === 0) {
        // корзина пуста: очищаем список и показываем сообщение
        this._list.replaceChildren();
        this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
        if (this._button) {
          this._button.disabled = true;
        }
      } else {
        // Есть товары: отображаем их и активируем кнопку
        this._list.replaceChildren(...items);
        if (this._button) {
          this._button.disabled = false;
        }
      }
    }
  }

  // общая сумма
  set total(value: number) {
    if (this._total) {
      this.setText(this._total, `${value} синапсов`);
    }
  }
}
