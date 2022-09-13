import { LitElement, html, css } from 'lit';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';
import { itemUpdated } from './redux/slices/org.js';

/* eslint-disable class-methods-use-this */
export default class ResourcePage extends connect(store)(LitElement) {
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
      resourceID: { type: String },
      resource: { type: Object },
      section: { type: String },
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
              if (this.orgName) {
                this.dispatchEvent(
                  new CustomEvent('go', {
                    detail: {
                      value: `orgs/${this.orgName}/${this.section}`,
                    },
                    bubbles: true,
                    composed: true,
                  })
                );
              }
            }}
          >
            <vaadin-icon icon="vaadin:arrow-left"></vaadin-icon>
          </vaadin-button>
          ${this.resource ? this.resource.name : ''}
        </h2>
      </div>
    `;
  }

  stateChanged(state) {
    if (!this.orgName && state.org && state.org.name) {
      this.orgName = state.org.name;
    }
    if (
      Object.keys(this.resource || {}) &&
      state.org &&
      state.org[this.section] &&
      state.org[this.section].data &&
      state.org[this.section].data.obj
    ) {
      this.resource = state.org[this.section].data.obj[this.resourceID];
    }
  }

  onAfterEnter(e) {
    this.section = e.params.section;
    this.orgName = e.params.org;
    this.resourceID = e.params.resource;
    const state = store.getState();
    this.resource =
      state.org &&
      state.org[this.section] &&
      state.org[this.section].data &&
      state.org[this.section].data.obj[this.resourceID];
    if (!this.resource) {
      this._fetchResource(this.resourceID);
    }
  }

  async _fetchResource(id) {
    if (id) {
      const data = await (
        await fetch(`/api/v2/${this.section}/${this.resourceID}`, {
          headers: {
            'X-Org': id,
          },
        })
      ).json();
      store.dispatch(itemUpdated(data));
    }
  }
}

customElements.define('resource-page', ResourcePage);
