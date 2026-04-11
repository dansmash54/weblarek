import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";

export class CardPreview extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _description?: HTMLElement;

  constructor(
    container: HTMLElement,
    private onAction: () => void
  ) {
    super(container);

    // элементы DOM
    this._image = container.querySelector(".card__image") as HTMLImageElement;
    this._category = container.querySelector(".card__category") as HTMLElement;
    this._button = container.querySelector(".card__button") as HTMLButtonElement;
    this._description = container.querySelector(".card__description") as HTMLElement;

    // Обработчик клика по кнопке
    if (this._button) {
      this._button.addEventListener("click", (e) => {
        e.stopPropagation();
        onAction();
      });
    }
  }

  // Название товара
  set title(value: string) {
    
    if (this._title) {
      this.setText(this._title, value);
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
      const categoryClass = categoryMap[value as keyof typeof categoryMap];
      if (categoryClass) {
        this._category.classList.add(categoryClass);
      }
    }
  }

  /** Цена товара */
  set price(value: number | null) {
   
    if (this._price) {
      this.setText(
        this._price,
        value === null ? "Недоступно" : `${value} синапсов`,
      );
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
