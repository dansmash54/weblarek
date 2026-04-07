import { Component } from '../base/Component';
import { IFormData } from '../../types/index';
import { EventEmitter } from '../base/Events';

export abstract class Form<T> extends Component<IFormData> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLFormElement, protected events: EventEmitter) {
    super(container);
    
    this._submitButton = container.querySelector('button[type=submit]') as HTMLButtonElement;
    this._errors = container.querySelector('.form__errors') as HTMLElement;
    
    // Добавить проверки
    if (!this._submitButton) {
      console.error('Form: кнопка submit не найдена');
    }
    
    container.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });
    
    container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  protected abstract onInputChange(field: keyof T, value: string): void;
  protected abstract onSubmit(): void;

  set valid(value: boolean) {
    if (this._submitButton) {
      this._submitButton.disabled = !value;
    }
  }

  set errors(value: string[]) {
    if (this._errors) {
      this.setText(this._errors, value.join(', '));
    }
  }
}