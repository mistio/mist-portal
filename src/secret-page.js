import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';
import { itemUpdated } from './redux/slices/org.js';

/* eslint-disable class-methods-use-this */
export default class SecretPage extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        padding: 0;
        margin: 0;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        align-items: baseline;
      }
      div.page {
      }
    `;
  }

  static get properties() {
    return {
      actions: { type: Array },
      orgName: { type: String },
      secretID: { type: String },
      secret: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="page">
        <h2>
          <vaadin-button
            theme="tertiary"
            @click=${() => {
              if (this.orgName)
                Router.go(`/portal/orgs/${this.orgName}/secrets`);
            }}
          >
            <vaadin-icon icon="vaadin:arrow-left"></vaadin-icon>
          </vaadin-button>
          ${this.secret ? this.secret.name : ''}
        </h2>
      </div>
    `;
  }

  stateChanged(state) {
    if (!this.orgName && state.org && state.org.name) {
      this.orgName = state.org.name;
    }
    if (
      Object.keys(this.secret || {}) &&
      state.org &&
      state.org.secrets &&
      state.org.secrets.data &&
      state.org.secrets.data.obj
    ) {
      this.secret = state.org.secrets.data.obj[this.secretID];
    }
  }

  onAfterEnter(e) {
    this.orgName = e.params.org;
    this.secretID = e.params.secret;
    const state = store.getState();
    this.secret =
      state.org &&
      state.org.secrets &&
      state.org.secrets.data &&
      state.org.secrets.data.obj[this.secretID];
    if (!this.secret) {
      this._fetchSecret(this.secretID);
    }
  }

  async _fetchSecret(id) {
    if (id) {
      const data = await (
        await fetch(`/api/v2/secrets/${this.secretID}`, {
          headers: {
            'X-Org': id,
          },
        })
      ).json();
      store.dispatch(itemUpdated(data));
    }
  }
}

customElements.define('secret-page', SecretPage);
