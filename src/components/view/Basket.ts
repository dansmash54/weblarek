import { Component } from "../base/Component";
import { IBasketData } from "../../types/index";
import { EventEmitter } from "../base/Events";

export class Basket extends Component<IBasketData> {
  protected _list: HTMLElement; // список
  protected _total: HTMLElement; // сумма
  protected _button: HTMLButtonElement; // оформить заказ (кнопка)

  constructor(
    container: HTMLElement,
    protected events: EventEmitter,
  ) {
    super(container);

    // находим элементы в DOM
    this._list = container.querySelector(".basket__list") as HTMLElement;
    this._total = container.querySelector(".basket__total") as HTMLElement;
    this._button = container.querySelector(
      ".basket__button",
    ) as HTMLButtonElement;

    // при клике на "Оформить" генерируем событие для презентера
    if (this._button) {
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
