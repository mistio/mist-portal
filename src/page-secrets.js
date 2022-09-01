/* eslint-disable lit/binding-positions */
import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import '@vaadin/button';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@mistio/mist-list/mist-list.js';
import '@vaadin/grid';

import { store } from './redux/store.js';
import reduxDataProvider from './redux/data-provider.js';
import { actions } from './secret-actions.js';

/* eslint-disable class-methods-use-this */
export default class PageSecrets extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        align-items: baseline;
        justify-content: center;
      }
      mist-list {
        display: block;
        clear: both;
        width: 100%;
      }
      div.header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
      }
      div.actions {
        display: flex;
        align-items: baseline;
        justify-content: end;
      }
    `;
  }

  static get properties() {
    return {
      actions: { type: Array },
      orgName: { type: String },
      listHeight: { type: Number },
    };
  }

  constructor() {
    super();
    this.name = 'secrets';
    const state = store.getState();
    this.orgName = state.org.name;
    this.dataProvider = reduxDataProvider.bind(this);
    this.renderers = this._getRenderers();
    this.actions = actions;
    this._handleResize();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._handleResize.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this._handleResize.bind(this));
    super.disconnectedCallback();
  }

  _handleResize() {
    this.listHeight = window.innerHeight - 200;
  }

  _getRenderers() {
    // const _this = this;
    return {
      name: {
        body: row => html`<strong class="name">${row.name}</strong>`,
      },
      tags: {
        body: row =>
          html`${repeat(
            Object.keys(row.tags),
            key => key,
            key => html` <strong>${key}=${row.tags[key]}</strong>`
          )}`,
      },
    };
  }

  stateChanged(state) {
    if (!this.orgName && state.org && state.org.name) {
      this.orgName = state.org.name;
    }
  }

  get list() {
    return this.shadowRoot.querySelector('mist-list');
  }

  render() {
    return html` <mist-list
      name="secrets"
      searchable
      selectable
      treeView
      .dataProvider=${reduxDataProvider}
      .frozenColumns=${['name']}
      .actions=${this.actions}
      .renderers=${this.renderers}
      .visibleColumns=${['tags']}
      @active-item-changed=${e => {
        if (e.detail.value) {
          if (e.detail.value.name.endsWith('/')) {
            this.list.shadowRoot
              .querySelector('vaadin-grid#grid')
              .expandItem(e.detail.value);
          } else {
            this.dispatchEvent(
              new CustomEvent('go', {
                detail: {
                  value: `orgs/${this.orgName}/secrets/${e.detail.value.id}`,
                },
                bubbles: true,
                composed: true,
              })
            );
          }
        }
      }}
    >
    </mist-list>`;
  }
}

customElements.define('page-secrets', PageSecrets);
