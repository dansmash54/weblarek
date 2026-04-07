import { Component } from '../base/Component';
import { ISuccessData } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class Success extends Component<ISuccessData> {
  protected _closeButton: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    
    this._closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
    this._total = container.querySelector('.order-success__description') as HTMLElement;
    
    this._closeButton.addEventListener('click', () => {
      this.close();
    });
  }

  set total(value: number) {
    this.setText(this._total, `Списано ${value} синапсов`);
  }

  private close(): void {
    this.events.emit('modal:close');
  }
}