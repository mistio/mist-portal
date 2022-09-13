import { LitElement, html, css } from 'lit';
import '@vaadin/button';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@mistio/mist-list/mist-list.js';
import '@vaadin/grid';

import { store } from './redux/store.js';
import reduxDataProvider from './redux/data-provider.js';

/* eslint-disable class-methods-use-this */
export default class ListPage extends connect(store)(LitElement) {
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
      section: { type: String },
      orgName: { type: String },
      selectedItems: { type: Array },
      listHeight: { type: Number },
      hierarchical: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.section = '';
    const state = store.getState();
    this.orgName = state.org.name;
    this.dataProvider = reduxDataProvider.bind(this);
    this.renderers = {};
    this.selectedItems = [];
    this.actions = [];
    this.visibleColumns = [];
    this.hierarchical = false;
    this._handleResize();
  }

  firstUpdated() {
    (async () => {
      const response = await import(`./${this.section}.js`);
      if (response.hierarchical) {
        this.hierarchical = true;
      }

      this.actions = response.actions(this);
      this.renderers = response.renderers(this);
      this.visibleColumns = response.visibleColumns;
      this.requestUpdate();
    })();
  }

  onAfterEnter(e) {
    this.section = e.params.section;
    if (!this.orgName) {
      this.orgName = e.params.org;
    }
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

  stateChanged(state) {
    if (!this.orgName.length && state.org && state.org.name) {
      this.orgName = state.org.name;
    }
  }

  render() {
    return html` <mist-list
      name="${this.section}"
      style="height: ${this.listHeight}px"
      searchable
      selectable
      ?hierarchical=${this.hierarchical}
      .dataProvider=${reduxDataProvider}
      .frozenColumns=${['name']}
      .actions=${this.actions}
      .renderers=${this.renderers}
      .visibleColumns=${this.visibleColumns}
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
                  value: `orgs/${this.orgName}/${this.section}/${e.detail.value.id}`,
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

customElements.define('list-page', ListPage);
