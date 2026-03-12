import { IProduct } from "../../types/index";

export class BasketModel {
  private _items: IProduct[] = [];

  // Получить список товаров в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // Добавить товар в корзину
  addItem(item: IProduct): void {
    this._items.push(item);
  }

  // Удалить товар из корзины по ID
  removeItem(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
  }

  // Очистить корзину
  clear(): void {
    this._items = [];
  }

  // Получить общую сумму всех товаров
  getTotal(): number {
    return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  // Получить количество товаров в корзине
  getCount(): number {
    return this._items.length;
  }

  // Проверить наличие товара в корзине
  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
