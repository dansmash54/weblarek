import { Card } from "./Card";
import { EventEmitter } from "../base/Events";


export class CardPreview extends Card {
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
  }

  //Обработчик клика по кнопке (добавление/удаление из корзины)
  protected onButtonClick(): void {
    this.events.emit("card:add", { id: this._id });
  }

  // Обработчик клика по карточке (не используется, так как модальное окно уже открыто) 
  protected onCardClick(): void {
  
  }
}