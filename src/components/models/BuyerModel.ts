import { IBuyer } from '../../types/index';

export class BuyerModel {
  private _payment: string | null = null;
  private _address: string = '';
  private _phone: string = '';
  private _email: string = '';

  // Сохранить значение конкретного поля
  setField(field: keyof IBuyer, value: string): void {
    switch (field) {
      case 'payment':
        this._payment = value;
        break;
      case 'address':
        this._address = value;
        break;
      case 'phone':
        this._phone = value;
        break;
      case 'email':
        this._email = value;
        break;
    }
  }

  // Получить все данные покупателя
  getData(): IBuyer {
    return {
      payment: this._payment || '',
      address: this._address,
      phone: this._phone,
      email: this._email
    };
  }

  // Очистить все данные
  clear(): void {
    this._payment = null;
    this._address = '';
    this._phone = '';
    this._email = '';
  }

  // Проверить заполненность полей
  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    if (!this._address.trim()) {
      errors.address = 'Введите адрес доставки';
    }

    if (!this._phone.trim()) {
      errors.phone = 'Введите номер телефона';
    }

    if (!this._email.trim()) {
      errors.email = 'Введите email';
    }

    return errors;
  }
}