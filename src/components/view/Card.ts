import { Component } from "../base/Component";
import { ICardData } from "../../types/index";

export abstract class Card extends Component<ICardData> {
  protected _id: string = "";
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _description?: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    // Находим все необходимые элементы внутри контейнера
    const title = container.querySelector(".card__title");
    const price = container.querySelector(".card__price");
    const image = container.querySelector(".card__image");
    const category = container.querySelector(".card__category");
    const button = container.querySelector(".card__button");
    const description = container.querySelector(".card__description");

    // Проверка элементов
    if (!title || !price) {
      throw new Error(
        "Card: обязательные элементы .card__title и .card__price не найдены",
      );
    }

    // Сохраняем найденные элементы
    this._title = title as HTMLElement;
    this._price = price as HTMLElement;
    this._image = (image as HTMLImageElement) || undefined;
    this._category = (category as HTMLElement) || undefined;
    this._button = (button as HTMLButtonElement) || undefined;
    this._description = (description as HTMLElement) || undefined;

    // Обработчик клика по кнопке (если кнопка существует)
    if (this._button) {
      this._button.addEventListener("click", (e) => {
        e.stopPropagation(); // Останавливаем всплытие, чтобы не сработал клик по карточке
        this.onButtonClick();
      });
    }

    // Обработчик клика по карточке
    container.addEventListener("click", (e) => {
      // Если клик был по кнопке или внутри кнопки — не вызываем onCardClick
      if (
        this._button &&
        (e.target === this._button || this._button.contains(e.target as Node))
      ) {
        return;
      }
      this.onCardClick();
    });
  }

  //ID товара 
  set id(value: string) {
    this._id = value;
  }

  // Название товара
  set title(value: string) {
    if (this._title) {
      this.setText(this._title, value);
    }
  }

  //Цена товара (null = товар нет) 
  set price(value: number | null) {
    if (this._price) {
      if (value === null) {
        this.setText(this._price, "Недоступно");
        if (this._button) {
          this._button.disabled = true;
          this._button.textContent = "Недоступно";
        }
      } else {
        this.setText(this._price, `${value} синапсов`);
        if (this._button) {
          this._button.disabled = false;
          this._button.textContent = "Купить";
        }
      }
    }
  }

  //URL изображения товара
  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this.title);
    }
  }

  //Категория товара (определяет цвет фона) 
  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
    }
  }

  //Полное описание товара 
  set description(value: string) {
    if (this._description) {
      this.setText(this._description, value);
    }
  }

  //Текст на кнопке (купить, удалить) 
  set buttonText(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }

  // Блокировка кнопки (без цены ттвар) 
  set disabled(value: boolean) {
    if (this._button) {
      this.setDisabled(this._button, value);
    }
  }

  
  protected abstract onButtonClick(): void;
  protected abstract onCardClick(): void;
}
