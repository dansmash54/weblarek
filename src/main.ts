import "./scss/styles.scss";
import { CatalogModel } from "./components/base/models/CatalogModel";
import { BasketModel } from "./components/base/models/BasketModel";
import { BuyerModel } from "./components/base/models/BuyerModel";
import { LarekAPI } from "./components/base/LarekAPI";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

// test CatalogModel
console.log("CatalogModel test");

const catalogModel = new CatalogModel();

// данные для теста
const testProducts = [
  {
    id: "product_1",
    title: "TITLE 1",
    image: "/test1.jpg",
    category: "софт-скил",
    price: 79182,
    description: "iughershglalh",
  },
  {
    id: "product_2",
    title: "TITLE 2",
    image: "/test2.jpg",
    category: "хард-скил",
    price: null,
    description: "ij40wuhrsl;hfdsl;hs",
  },
];

// setItems и getItems
console.log("Сохраняем товары в каталог:");
catalogModel.setItems(testProducts);
console.log("Результат:", catalogModel.getItems());

//  getProduct
console.log('Получаем товар по id "1":');
console.log("Результат:", catalogModel.getProduct("1"));

console.log('Получаем товар по несуществующему id "999":');
console.log("Результат:", catalogModel.getProduct("999"));

// setPreview и getPreview
console.log('Устанавливаем preview для товара с id "2":');
catalogModel.setPreview("2");
console.log("ID выбранного товара:", catalogModel.getPreview());

console.log("Сбрасываем preview:");
catalogModel.setPreview(null);
console.log("ID выбранного товара:", catalogModel.getPreview());

// test BasketModel
console.log("BasketModel test");

const basketModel = new BasketModel();

//  addItem
console.log("Добавляем товары в корзину:");
basketModel.addItem(testProducts[0]);
basketModel.addItem(testProducts[1]);
console.log("Товары в корзине:", basketModel.getItems());

//  getCount
console.log("Количество товаров в корзине:");
console.log("Результат:", basketModel.getCount());

//  getTotal
console.log("Общая сумма товаров:");
console.log("Результат:", basketModel.getTotal());

//  hasItem
console.log('Проверяем наличие товара с id "1":');
console.log("Результат:", basketModel.hasItem("1"));

console.log('Проверяем наличие товара с id "999":');
console.log("Результат:", basketModel.hasItem("999"));

//  removeItem
console.log('Удаляем товар с id "1":');
basketModel.removeItem("1");
console.log("Товары в корзине после удаления:", basketModel.getItems());

//  clear
console.log("Очищаем корзину:");
basketModel.clear();
console.log("Товары в корзине после очистки:", basketModel.getItems());

// test BuyerModel
console.log("BuyerModel test");

const buyerModel = new BuyerModel();

// setField и getData
console.log("Заполняем данные покупателя:");
buyerModel.setField("payment", "card");
buyerModel.setField("address", "ул. Ленина 1");
buyerModel.setField("phone", "+73156654655465");
buyerModel.setField("email", "kljdsgjd@tshshsf.com");
console.log("Данные покупателя:", buyerModel.getData());

//  validate (все поля заполнены)
console.log("Проверяем валидацию (все поля заполнены):");
console.log("Ошибки:", buyerModel.validate());

//  clear
console.log("Очищаем данные:");
buyerModel.clear();
console.log("Данные после очистки:", buyerModel.getData());

//  validate (пустые поля)
console.log("Проверяем валидацию (пустые поля):");
console.log("Ошибки:", buyerModel.validate());

// test LarekAPI
console.log("LarekAPI test");
const api = new Api(API_URL);
const larekAPI = new LarekAPI(api);

larekAPI
  .getProductList()
  .then((products) => {
    console.log("Товары с сервера:", products);
    catalogModel.setItems(products);
    console.log("Сохранено в каталог:", catalogModel.getItems());
  })
  .catch((error) => {
    console.error("Ошибка при получении товаров:", error);
  });
