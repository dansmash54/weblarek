import { Card } from "./Card";
import { EventEmitter } from "../base/Events";


export class CardCatalog extends Card {
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
  }

  // Обработчик клика по кнопке "Купить"
  protected onButtonClick(): void {
    this.events.emit("card:add", { id: this._id });
  }

  // Обработчик клика по карточке (открывает модальное окно с деталями) 
  protected onCardClick(): void {
    this.events.emit("card:select", { id: this._id });
  }
}