/**
 * Базовый компонент
 */
export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {
    // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
  }

  // Установить текстовое содержимое
  protected setText(element: HTMLElement, value: unknown): void {
    if (element) {
      element.textContent = String(value);
    }
  }

  // Установить изображение с альтернативным текстом
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (element) {
      element.src = src;
      if (alt) {
        element.alt = alt;
      }
    }
  }

  // Переключить класс
  protected toggleClass(element: HTMLElement, className: string, force?: boolean) {
    element.classList.toggle(className, force);
  }

  // Установить статус disabled
  protected setDisabled(element: HTMLElement, state: boolean) {
    if (element) {
      if (state) element.setAttribute("disabled", "disabled");
      else element.removeAttribute("disabled");
    }
  }

  // Скрыть элемент
  protected setHidden(element: HTMLElement) {
    element.style.display = "none";
  }

  // Показать элемент
  protected setVisible(element: HTMLElement) {
    element.style.removeProperty("display");
  }

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}