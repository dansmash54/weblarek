import { Form } from "./Form";
import { IContactsFormData } from "../../types/index";
import { EventEmitter } from "../base/Events";

export class ContactsForm extends Form<IContactsFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    protected events: EventEmitter,
  ) {
    super(container, events);

    this._emailInput = container.querySelector(
      '[name="email"]',
    ) as HTMLInputElement;
    this._phoneInput = container.querySelector(
      '[name="phone"]',
    ) as HTMLInputElement;
  }

  //Обработка изменения полей формы
  protected onInputChange(field: keyof IContactsFormData, value: string): void {
    this.events.emit("form:change", { field, value });
  }

  //Обработка отправки формы
  protected onSubmit(): void {
    if (!this._emailInput || !this._phoneInput) return;

    this.events.emit("contacts:submit", {
      email: this._emailInput.value,
      phone: this._phoneInput.value,
    });
  }

  //Установить значение емаил
  set email(value: string) {
    if (this._emailInput) {
      this._emailInput.value = value;
    }
  }

  //Установить значение телефона
  set phone(value: string) {
    if (this._phoneInput) {
      this._phoneInput.value = value;
    }
  }
}
