import { LitElement, html, css } from 'lit';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';

/* eslint-disable class-methods-use-this */
export default class KeyPage extends connect(store)(LitElement) {
  static get styles() {
    return css``;
  }

  render() {
    return html`page`;
  }
}

customElements.define('key-page', KeyPage);
