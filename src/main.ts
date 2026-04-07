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
const basket = new Basket(document.querySelector("#basket")!, events);

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

// Функция создает форму заказа
function createOrderForm(): OrderForm {
  const orderElement = orderTemplate.content.cloneNode(true) as HTMLElement;
  const formElement = orderElement.querySelector("form") as HTMLFormElement;
  return new OrderForm(formElement, events);
}

// Функция создает форму контактов
function createContactsForm(): ContactsForm {
  const contactsElement = contactsTemplate.content.cloneNode(
    true,
  ) as HTMLElement;
  const formElement = contactsElement.querySelector("form") as HTMLFormElement;
  return new ContactsForm(formElement, events);
}

// Создаем начальные экземпляры форм
let orderForm = createOrderForm();
let contactsForm = createContactsForm();

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

// 1. Обновление каталога на главной странице
events.on("products:changed", () => {
  const products = catalogModel.getItems();

  const cards = products.map((product) => {
    const fragment = cardCatalogTemplate.content.cloneNode(
      true,
    ) as DocumentFragment;
    const cardElement = fragment.firstElementChild as HTMLElement;

    if (!cardElement) {
      return document.createElement("div");
    }

    const card = new CardCatalog(cardElement, events);

    card.id = product.id;
    card.title = product.title;
    card.image = CDN_URL + product.image;
    card.category = product.category;
    card.price = product.price;

    return card.render();
  });

  page.catalog = cards;
});

// 2. Выбор карточки товара (клик по карточке)
events.on("card:select", (data: { id: string }) => {
  catalogModel.setPreview(data.id);
});

// 3. Открытие модального окна с инфой о товаре
events.on("preview:changed", () => {
  const previewId = catalogModel.getPreview();
  if (!previewId) return;

  const product = catalogModel.getProduct(previewId);
  if (!product) return;

  const fragment = cardPreviewTemplate.content.cloneNode(
    true,
  ) as DocumentFragment;
  const cardElement = fragment.firstElementChild as HTMLElement;
  if (!cardElement) return;

  const cardPreview = new CardPreview(cardElement, events);

  cardPreview.id = product.id;
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

  modal.render(cardPreview.render());
  page.lockScroll();
});

// 4. Добавление товара в корзину
events.on("card:add", (data: { id: string }) => {
  const product = catalogModel.getProduct(data.id);
  if (product && product.price !== null) {
    basketModel.addItem(product);
  }
  modal.close();
});

// 5. Удаление товара из корзины
events.on("card:remove", (data: { id: string }) => {
  basketModel.removeItem(data.id);
});

// 6. Обновление отображения корзины
events.on("basket:changed", () => {
  header.counter = basketModel.getCount();

  // Если корзина открыта — обновляем содержимое
  const modalContent = document.querySelector(".modal_active .modal__content");
  if (modalContent) {
    const basketElement = modalContent.querySelector(".basket");
    if (basketElement) {
      // Перерисовываем корзину
      const basketTemplate = document.querySelector(
        "#basket",
      ) as HTMLTemplateElement;
      const newBasketElement = basketTemplate.content.cloneNode(
        true,
      ) as HTMLElement;
      const newBasket = new Basket(newBasketElement, events);

      const items = basketModel.getItems();
      const cards = items.map((product, index) => {
        const fragment = cardBasketTemplate.content.cloneNode(
          true,
        ) as DocumentFragment;
        const cardElement = fragment.firstElementChild as HTMLElement;
        if (!cardElement) return document.createElement("li");

        const card = new CardBasket(cardElement, events, index);
        card.id = product.id;
        card.title = product.title;
        card.price = product.price;
        return card.render();
      });

      newBasket.items = cards;
      newBasket.total = basketModel.getTotal();

      // Заменяем содержимое корзины
      const modalContentElement = document.querySelector(
        ".modal_active .modal__content",
      );
      if (modalContentElement) {
        modalContentElement.innerHTML = "";
        modalContentElement.appendChild(newBasket.render());
      }
    }
  }
});

// 7. Открытие корзины
events.on("basket:open", () => {
  const basketTemplate = document.querySelector(
    "#basket",
  ) as HTMLTemplateElement;
  const basketElement = basketTemplate.content.cloneNode(true) as HTMLElement;

  const newBasket = new Basket(basketElement, events);

  newBasket.items = basketModel.getItems().map((product, index) => {
    const cardElement = cardBasketTemplate.content.cloneNode(
      true,
    ) as HTMLElement;
    const card = new CardBasket(cardElement, events, index);
    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    return card.render();
  });
  newBasket.total = basketModel.getTotal();

  modal.render(newBasket.render());
  page.lockScroll();
});

// 8. Оформление заказа
events.on("basket:order", () => {
  buyerModel.clear();
  orderForm = createOrderForm();
  modal.render(orderForm.render());
});

// 9. Изменение полей в форме
events.on("form:change", (data: { field: string; value: string }) => {
  buyerModel.setField(data.field as keyof IBuyer, data.value);
});

// 10. Валидация формы
events.on("buyer:changed", () => {
  const modalContent = document.querySelector(".modal_active .modal__content");
  if (!modalContent) return;

  const orderFormElement = modalContent.querySelector("form[name='order']");
  const contactsFormElement = modalContent.querySelector(
    "form[name='contacts']",
  );

  if (orderFormElement) {
    const isValid = buyerModel.isOrderValid();
    orderForm.valid = isValid;
    orderForm.errors = buyerModel.getOrderErrors();

    const submitButton = orderFormElement.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = !isValid;
    }
  } else if (contactsFormElement) {
    const isValid = buyerModel.isContactsValid();
    contactsForm.valid = isValid;
    contactsForm.errors = buyerModel.getContactsErrors();
  }
});

// 11. Отправка формы заказа
events.on("order:submit", (data: { payment: string; address: string }) => {
  buyerModel.setField("payment", data.payment);
  buyerModel.setField("address", data.address);

  contactsForm = createContactsForm();
  modal.render(contactsForm.render());
});

// 12. Отправка формы контактов
events.on("contacts:submit", (data: { email: string; phone: string }) => {
  buyerModel.setField("email", data.email);
  buyerModel.setField("phone", data.phone);

  const errors = buyerModel.validate();
  if (Object.keys(errors).length > 0) return;

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

// 13. Закрытие модального окна
events.on("modal:close", () => {
  page.unlockScroll();
});
