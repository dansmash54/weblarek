import { IApi, IProduct, IOrder, IProductList, IOrderResult } from "../types/index";

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
  async postOrder(order: IOrder): Promise<IOrderResult> {
    return await this._api.post<IOrderResult>("/order", order);
  }
}