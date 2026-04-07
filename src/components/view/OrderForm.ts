import { Form } from './Form';
import { IOrderFormData } from '../../types/index';
import { EventEmitter } from '../base/Events';

/**
 * Форма оформления заказа (первый шаг)
 * Содержит: выбор способа оплаты (карта/наличные) и адрес доставки
 */
export class OrderForm extends Form<IOrderFormData> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: EventEmitter) {
    super(container, events);
    
    this._cardButton = container.querySelector('[name="card"]') as HTMLButtonElement;
    this._cashButton = container.querySelector('[name="cash"]') as HTMLButtonElement;
    this._addressInput = container.querySelector('[name="address"]') as HTMLInputElement;
    
    // Обработчики для кнопок выбора способа оплаты
    this._cardButton.addEventListener('click', () => {
      this.setPaymentMethod('card');
    });
    
    this._cashButton.addEventListener('click', () => {
      this.setPaymentMethod('cash');
    });
  }

  /** Установить выбранный способ оплаты и обновить визуальное состояние кнопок */
  setPaymentMethod(method: string): void {
    if (!this._cardButton || !this._cashButton) return;
    
    this._cardButton.classList.remove('button_alt-active');
    this._cashButton.classList.remove('button_alt-active');
    
    if (method === 'card') {
      this._cardButton.classList.add('button_alt-active');
    } else if (method === 'cash') {
      this._cashButton.classList.add('button_alt-active');
    }
    
    this.events.emit('form:change', {
      field: 'payment',
      value: method
    });
  }

  /** Обработка изменения полей формы */
  protected onInputChange(field: keyof IOrderFormData, value: string): void {
    this.events.emit('form:change', { field, value });
  }

  // Обработка отправки формы (после оплаты и адреса) */
  protected onSubmit(): void {
    if (!this._cardButton || !this._cashButton || !this._addressInput) return;
    
    this.events.emit('order:submit', {
      payment: this._cardButton.classList.contains('button_alt-active') ? 'card' : 'cash',
      address: this._addressInput.value
    });
  }

  // значение адреса 
  set address(value: string) {
    if (this._addressInput) {
      this._addressInput.value = value;
    }
  }

  // способ оплаты 
  set payment(value: string) {
    this.setPaymentMethod(value);
  }
}