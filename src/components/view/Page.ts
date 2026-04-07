import { Component } from '../base/Component';
import { IPageData } from '../../types/index';

export class Page extends Component<IPageData> {
  protected _gallery: HTMLElement;
  protected _wrapper: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    
    this._gallery = container.querySelector('.gallery') as HTMLElement;
    this._wrapper = container.querySelector('.page__wrapper') as HTMLElement;
  }

  set catalog(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  lockScroll(): void {
    this._wrapper.classList.add('page__wrapper_locked');
  }

  unlockScroll(): void {
    this._wrapper.classList.remove('page__wrapper_locked');
  }
}