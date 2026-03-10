export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

// Интерфейс товара
export interface IProduct {
  id: string; // id товара
  title: string; // название товара
  image: string; // изображение
  category: string; // категория (софт-скил, хард-скил и тд)
  price: number | null; // цена (null = бесценный товар)
  description: string; // описание товара
}

// Интерфейс покупателя
export interface IBuyer {
  payment: string; // способ оплаты ("card"/"cash")
  address: string; // адрес доставки
  phone: string; // номер телефона
  email: string; // электронная почта
}

// Интерфейс заказа
export interface IOrder {
  payment: string;
  address: string;
  phone: string;
  email: string;
  total: number; // общая сумма
  items: string[]; // массив ID товаров для покупки
}

// Тип для ответа сервера при получении списка товаров
export interface IProductList {
  total: number;
  items: IProduct[];
}
