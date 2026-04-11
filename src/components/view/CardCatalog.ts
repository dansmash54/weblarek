import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";


export class CardCatalog extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(
    container: HTMLElement,
    private onCardClick: () => void,
  ) {
    super(container);

    this._image = container.querySelector(".card__image") as HTMLImageElement;
    this._category = container.querySelector(".card__category") as HTMLElement;

    // Обработчик клика по карточке
    container.addEventListener("click", () => {
      onCardClick();
    });
  }

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this.title);
    }
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      const categoryClass = categoryMap[value as keyof typeof categoryMap];
      if (categoryClass) {
        this._category.classList.add(categoryClass);
      }
    }
  }
}