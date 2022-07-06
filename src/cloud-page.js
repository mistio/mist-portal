import { LitElement, html, css } from "lit";


import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "./redux/store.js";

/* eslint-disable class-methods-use-this */
export default class CloudPage extends connect(store)(LitElement) {
  static get styles() {
    return css``;
  }

  constructor() {
    super()
    
  }

  render() {
      return html`page`
  }
}

customElements.define("cloud-page", CloudPage);
