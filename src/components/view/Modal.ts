import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class Modal extends Component<HTMLElement> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    
    this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this._content = container.querySelector('.modal__content') as HTMLElement;
    
    this._closeButton.addEventListener('click', () => {
      this.close();
    });
    
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }

  render(data: HTMLElement): HTMLElement {
    this.content = data;
    this.open();
    return this.container;
  }
}