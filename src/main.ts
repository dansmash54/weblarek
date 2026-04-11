import "./scss/styles.scss";
import { CatalogModel } from "./components/models/CatalogModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { LarekAPI } from "./components/LarekAPI";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { API_URL, CDN_URL } from "./utils/constants";
import { IOrder, IBuyer } from "./types";

// Импорты view
import { Page } from "./components/view/Page";
import { Header } from "./components/view/Header";
import { Modal } from "./components/view/Modal";
import { Basket } from "./components/view/Basket";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CardBasket } from "./components/view/CardBasket";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";

const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const api = new Api(API_URL);
const larekAPI = new LarekAPI(api);

// Компоненты представления
const page = new Page(document.body);
const header = new Header(document.querySelector(".header")!, events);
const modal = new Modal(document.querySelector("#modal-container")!, events);

// Шаблоны
const cardCatalogTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
  "#card-basket",
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;

// СОЗДАЕМ ФОРМЫ
const orderFormElement = orderTemplate.content.cloneNode(true) as HTMLElement;
const orderForm = new OrderForm(
  orderFormElement.querySelector("form") as HTMLFormElement,
  events,
);

const contactsFormElement = contactsTemplate.content.cloneNode(
  true,
) as HTMLElement;
const contactsForm = new ContactsForm(
  contactsFormElement.querySelector("form") as HTMLFormElement,
  events,
);

// СОЗДАЕМ КОРЗИНУ
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const basketElement = basketTemplate.content.cloneNode(true) as HTMLElement;
const basket = new Basket(basketElement, events);

// СОЗДАЕМ CARD PREVIEW
const previewFragment = cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
const previewElement = previewFragment.firstElementChild as HTMLElement;
if (!previewElement) {
  throw new Error("CardPreview: не удалось получить элемент из темплейта");
}
const cardPreview = new CardPreview(previewElement, () => {
  const previewId = catalogModel.getPreview();
  if (previewId) {
    events.emit("card:action", { id: previewId });
  }
});

// сервак
larekAPI
  .getProductList()
  .then((products) => {
    catalogModel.setItems(products);
  })
  .catch((error) => {
    console.error("Ошибка загрузки товаров:", error);
  });

// обработчики

// 1. Обновление каталога
events.on("products:changed", () => {
  const products = catalogModel.getItems();

  const cards = products.map((product) => {
    const fragment = cardCatalogTemplate.content.cloneNode(
      true,
    ) as DocumentFragment;
    const cardElement = fragment.firstElementChild as HTMLElement;
    if (!cardElement) return document.createElement("div");

    const card = new CardCatalog(cardElement, () =>
      events.emit("card:select", { id: product.id }),
    );

    card.title = product.title;
    card.image = CDN_URL + product.image;
    card.category = product.category;
    card.price = product.price;

    return card.render();
  });

  page.catalog = cards;
});

// 2. Выбор карточки товара
events.on("card:select", (data: { id: string }) => {
 
  catalogModel.setPreview(data.id);
});

// 3. Открытие модального окна с инфой о товаре
events.on("preview:changed", () => {
  
  const previewId = catalogModel.getPreview();
 
  if (!previewId) return;

  const product = catalogModel.getProduct(previewId);
  if (!product) return;



  cardPreview.title = product.title;
  cardPreview.image = CDN_URL + product.image;
  cardPreview.category = product.category;
  cardPreview.price = product.price;
  cardPreview.description = product.description;

  if (product.price === null) {
    cardPreview.buttonText = "Недоступно";
    cardPreview.disabled = true;
  } else if (basketModel.hasItem(product.id)) {
    cardPreview.buttonText = "Удалить из корзины";
  } else {
    cardPreview.buttonText = "Купить";
  }

  

  const renderedElement = cardPreview.render();

modal.render(renderedElement);
});

// 4. Действие с карточкой (добавление/удаление)
events.on("card:action", (data: { id: string }) => {
  const product = catalogModel.getProduct(data.id);
  if (!product || product.price === null) return;

  if (basketModel.hasItem(data.id)) {
    basketModel.removeItem(data.id);
  } else {
    basketModel.addItem(product);
  }
  modal.close();
});

// 5. Добавление товара (из каталога)
events.on("card:add", (data: { id: string }) => {
  const product = catalogModel.getProduct(data.id);
  if (product && product.price !== null) {
    basketModel.addItem(product);
  }
  modal.close();
});

// 6. Удаление товара из корзины
events.on("card:remove", (data: { id: string }) => {
  basketModel.removeItem(data.id);
});

// 7. Обновление отображения корзины
events.on("basket:changed", () => {
  header.counter = basketModel.getCount();

  const items = basketModel.getItems();
  const cards = items.map((product, index) => {
    const fragment = cardBasketTemplate.content.cloneNode(
      true,
    ) as DocumentFragment;
    const cardElement = fragment.firstElementChild as HTMLElement;
    if (!cardElement) return document.createElement("li");

    const card = new CardBasket(cardElement, index, () =>
      events.emit("card:remove", { id: product.id }),
    );
    card.title = product.title;
    card.price = product.price;

    return card.render();
  });

  basket.items = cards;
  basket.total = basketModel.getTotal();
});

// 8. Открытие корзины
events.on("basket:open", () => {
  modal.render(basket.render());
});

// 9. Оформление заказа
events.on("basket:order", () => {
  buyerModel.clear();
  modal.render(orderForm.render());
});

// 10. Изменение полей в форме
events.on("form:change", (data: { field: string; value: string }) => {
  buyerModel.setField(data.field as keyof IBuyer, data.value);
   if (data.field === "payment") {
    orderForm.payment = data.value;}
});

// 11. Валидация формы (обновляем ОБЕ формы)
events.on("buyer:changed", () => {
  const errors = buyerModel.validate();

  // Для формы заказа (первый шаг)
  const orderErrors = [];
  if (errors.payment) orderErrors.push(errors.payment);
  if (errors.address) orderErrors.push(errors.address);
  orderForm.valid = orderErrors.length === 0;
  orderForm.errors = orderErrors;

  // Для формы контактов (второй шаг)
  const contactsErrors = [];
  if (errors.email) contactsErrors.push(errors.email);
  if (errors.phone) contactsErrors.push(errors.phone);
  contactsForm.valid = contactsErrors.length === 0;
  contactsForm.errors = contactsErrors;
});

// 12. Отправка формы заказа
events.on("order:submit", () => {
  modal.render(contactsForm.render());
});

// 13. Отправка формы контактов
events.on("contacts:submit", () => {
  const order: IOrder = {
    ...buyerModel.getData(),
    total: basketModel.getTotal(),
    items: basketModel.getItems().map((item) => item.id),
  };

  larekAPI
    .postOrder(order)
    .then((result) => {
      const fragment = successTemplate.content.cloneNode(
        true,
      ) as DocumentFragment;
      const successElement = fragment.firstElementChild as HTMLElement;
      if (successElement) {
        const success = new Success(successElement, events);
        success.total = result.total;
        modal.render(success.render());
      }
      basketModel.clear();
      buyerModel.clear();
    })
    .catch((error) => {
      console.error("Ошибка при оформлении заказа:", error);
    });
});

// 14. Закрытие модального окна
events.on("modal:close", () => {
  modal.close();
  // скролл разблокируется
});
