import { Card } from "./Card";



export class CardCatalog extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private onCardClick: () => void,
    private onButtonClick: () => void
  ) {
    super(container);

    this._image = container.querySelector(".card__image") as HTMLImageElement;
    this._category = container.querySelector(".card__category") as HTMLElement;
    this._button = container.querySelector(".card__button") as HTMLButtonElement;

    // Обработчик клика по карточке
    container.addEventListener("click", () => {
      onCardClick();
    });

    // Обработчик клика по кнопке
    if (this._button) {
      this._button.addEventListener("click", (e) => {
        e.stopPropagation();
        onButtonClick();
      });
    }
  }

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this.title);
    }
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      // Устанавливаем класс для цвета фона
      const categoryMap: Record<string, string> = {
        "софт-скил": "card__category_soft",
        "хард-скил": "card__category_hard",
        "другое": "card__category_other",
        "дополнительное": "card__category_additional",
        "кнопка": "card__category_button",
      };
      const categoryClass = categoryMap[value];
      if (categoryClass) {
        this._category.classList.add(categoryClass);
      }
    }
  }
}