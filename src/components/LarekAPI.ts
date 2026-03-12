import { IApi } from "../types/index";
import { IProduct, IOrder, IProductList } from "../types/index";

export class LarekAPI {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  // Получить список всех товаров с сервера
  async getProductList(): Promise<IProduct[]> {
    const response = await this._api.get<IProductList>("/product/");
    return response.items;
  }

  // Отправить заказ на сервер
  async postOrder(order: IOrder): Promise<{ id: string; total: number }> {
    return await this._api.post("/order", order);
  }
}
