import { Component } from "../base/Component";
import { ICardData } from "../../types/index";

export abstract class Card extends Component<ICardData> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    // Находим все необходимые элементы внутри контейнера
    const title = container.querySelector(".card__title");
    const price = container.querySelector(".card__price");
    // Проверка элементов
    if (!title || !price) {
      throw new Error(
        "Card: обязательные элементы .card__title и .card__price не найдены",
      );
    }

    this._title = title as HTMLElement;
    this._price = price as HTMLElement;
  }

  //Название товара
  set title(value: string) {
    if (this._title) {
      this.setText(this._title, value);
    }
  }

  //Цена товара (null = товар нет)
  set price(value: number | null) {
    if (this._price) {
      this.setText(
        this._price,
        value === null ? "Недоступно" : `${value} синапсов`,
      );
    }
  }
}
