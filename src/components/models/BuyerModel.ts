import { IBuyer } from "../../types/index";
import { EventEmitter } from "../base/Events";


export class BuyerModel {
  private _payment: string | null = null; // способ оплаты
  private _address: string = ""; // адрес
  private _phone: string = ""; // мобила
  private _email: string = ""; // емаил

  constructor(private events: EventEmitter) {}

  // Сохранить значение конкретного поля
  setField(field: keyof IBuyer, value: string): void {
    switch (field) {
      case "payment":
        this._payment = value;
        break;
      case "address":
        this._address = value;
        break;
      case "phone":
        this._phone = value;
        break;
      case "email":
        this._email = value;
        break;
    }
    this.events.emit("buyer:changed");
  }

  // Получить все данные покупателя
  getData(): IBuyer {
    return {
      payment: this._payment || "",
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  // Очистить все данные
  clear(): void {
    this._payment = null;
    this._address = "";
    this._phone = "";
    this._email = "";
    this.events.emit("buyer:changed");
  }

  // Проверка для первого шага (способ оплаты + адрес)
  isOrderValid(): boolean {
    return !!this._payment && !!this._address.trim();
  }

  // Проверка для второго шага (email + телефон)
  isContactsValid(): boolean {
    return !!this._email.trim() && !!this._phone.trim();
  }

  // Получить ошибки для первого шага
  getOrderErrors(): string[] {
    const errors: string[] = [];
    if (!this._payment) errors.push("Выберите способ оплаты");
    if (!this._address.trim()) errors.push("Введите адрес доставки");
    return errors;
  }

  // Получить ошибки для второго шага
  getContactsErrors(): string[] {
    const errors: string[] = [];
    if (!this._email.trim()) errors.push("Введите email");
    if (!this._phone.trim()) errors.push("Введите номер телефона");
    return errors;
  }

  // Полная валидация для отправки заказа
  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._payment) {
      errors.payment = "Выберите способ оплаты";
    }
    if (!this._address.trim()) {
      errors.address = "Введите адрес доставки";
    }
    if (!this._phone.trim()) {
      errors.phone = "Введите номер телефона";
    }
    if (!this._email.trim()) {
      errors.email = "Введите email";
    }

    return errors;
  }
}