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
        margin: 1%;
        display: block;
      }
      mist-list {
        display: block;
        clear: both;
        width: 100%;
      }
    `;
  }

  static get properties() {
    return {
      section: { type: String },
      orgName: { type: String },
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
    this.actions = [];
    this.visibleColumns = [];
    this.hierarchical = false;
    this._handleResize();
  }

  get list() {
    return this.shadowRoot && this.shadowRoot.querySelector('mist-list');
  }

  firstUpdated() {
    (async () => {
      let response;
      switch (this.section) {
        case 'clouds':
          response = await import(`./clouds.js`);
          break;
        case 'clusters':
          response = await import(`./clusters.js`);
          break;
        case 'machines':
          response = await import(`./machines.js`);
          break;
        case 'volumes':
          response = await import(`./volumes.js`);
          break;
        case 'buckets':
          response = await import(`./buckets.js`);
          break;
        case 'networks':
          response = await import(`./networks.js`);
          break;
        case 'zones':
          response = await import(`./zones.js`);
          break;
        case 'images':
          response = await import(`./images.js`);
          break;
        case 'stacks':
          response = await import(`./stacks.js`);
          break;
        case 'templates':
          response = await import(`./templates.js`);
          break;
        case 'keys':
          response = await import(`./keys.js`);
          break;
        case 'secrets':
          response = await import(`./secrets.js`);
          break;
        case 'scripts':
          response = await import(`./scripts.js`);
          break;
        case 'schedules':
          response = await import(`./schedules.js`);
          break;
        case 'rules':
          response = await import(`./rules.js`);
          break;
        case 'members':
          response = await import(`./members.js`);
          break;
        case 'teams':
          response = await import(`./teams.js`);
          break;
        default:
          // TODO not-found
          this.go('..');
          return;
        // response = await import(`./${this.section}.js`);
        // break;
      }
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
