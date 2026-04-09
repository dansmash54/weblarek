import { Card } from "./Card";

export class CardPreview extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _description?: HTMLElement;

  constructor(
    container: HTMLElement,
    private onAction: () => void,
  ) {
    super(container);

    // элементы DOM
    this._image = container.querySelector(".card__image") as HTMLImageElement;
    this._category = container.querySelector(".card__category") as HTMLElement;
    this._button = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;
    this._description = container.querySelector(
      ".card__description",
    ) as HTMLElement;

    // Обработчик клика по кнопке
    if (this._button) {
      this._button.addEventListener("click", (e) => {
        e.stopPropagation();
        onAction();
      });
    }
  }

  // URL изображения товара
  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this.title);
    }
  }

  // Категория товара
  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      const categoryMap: Record<string, string> = {
        "софт-скил": "card__category_soft",
        "хард-скил": "card__category_hard",
        другое: "card__category_other",
        дополнительное: "card__category_additional",
        кнопка: "card__category_button",
      };
      const categoryClass = categoryMap[value];
      if (categoryClass) {
        this._category.classList.add(categoryClass);
      }
    }
  }

  //описание
  set description(value: string) {
    if (this._description) {
      this.setText(this._description, value);
    }
  }

  // Текст на кнопке
  set buttonText(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }

  //блок кнопки
  set disabled(value: boolean) {
    if (this._button) {
      this.setDisabled(this._button, value);
    }
  }
}
