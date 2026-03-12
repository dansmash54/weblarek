import { IProduct } from "../../types/index";

export class CatalogModel {
  private _items: IProduct[] = [];
  private _preview: string | null = null;

  // Сохранить массив товаров
  setItems(items: IProduct[]): void {
    this._items = items;
  }

  // Получить список всех товаров
  getItems(): IProduct[] {
    return this._items;
  }

  // Получить товар по ID
  getProduct(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  // Сохранить выбранную карточку
  setPreview(id: string | null): void {
    this._preview = id;
  }

  // Получить ID выбранной карточки
  getPreview(): string | null {
    return this._preview;
  }
}
