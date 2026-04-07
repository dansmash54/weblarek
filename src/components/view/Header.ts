import { Component } from '../base/Component';
import { IHeaderData } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class Header extends Component<IHeaderData> {
  protected _basketButton: HTMLButtonElement;
  protected _counter: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    
    this._basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this._counter = container.querySelector('.header__basket-counter') as HTMLElement;
    
    this._basketButton.addEventListener('click', () => {
      events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.setText(this._counter, String(value));
  }
}