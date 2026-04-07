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
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}

// Интерфейс покупателя
export interface IBuyer {
  payment: string;
  address: string;
  phone: string;
  email: string;
}

// Интерфейс заказа
export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

// Тип для ответа сервера при получении списка товаров
export interface IProductList {
  total: number;
  items: IProduct[];
}

// Результат заказа
export interface IOrderResult {
  id: string;
  total: number;
}

// ПРОЕКТНАЯ РАБОТА СПРИНТ 9

//  Данные для шапки (счетчик корзины)
export interface IHeaderData {
  counter: number;
}

// галерея карточек
export interface IPageData {
  catalog: HTMLElement[];
}

// данные для карточки
export interface ICardData {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description?: string;
  buttonText?: string;
  disabled?: boolean;
}

// данные для компонента корзины
export interface IBasketData {
  items: HTMLElement[];
  total: number;
}

// данные для формы
export interface IFormData {
  valid: boolean;
  errors: string[];
}

// Данные для формы оплата + адрес
export interface IOrderFormData extends IFormData {
  payment: string;
  address: string;
}

// Данные для формы емаил + мобила
export interface IContactsFormData extends IFormData {
  email: string;
  phone: string;
}

// Данные для успешной оплаты
export interface ISuccessData {
  total: number;
}

export type Events =
  | "products:changed"
  | "preview:changed"
  | "basket:changed"
  | "buyer:changed"
  | "card:select"
  | "card:add"
  | "card:remove"
  | "basket:open"
  | "basket:order"
  | "order:submit"
  | "contacts:submit"
  | "modal:close"
  | "form:change";
