import { LitElement, html, css } from 'lit';

import '@vaadin/horizontal-layout';
import '@vaadin/menu-bar';

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
        margin: 1%;
      }

      .header {
        width: 100%;
        align-items: center;
        justify-content: space-between;
      }
      vaadin-menu-bar.actions {
        max-width: 60%;
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

  constructor() {
    super();
    this.actions = [];
    this.orgName = '';
    this.resourceID = '';
    this.resource = {};
    this.section = '';
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <vaadin-button
        style="margin-right: 16px"
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
      <vaadin-horizontal-layout
        class="header"
        style="border-bottom: 1px solid #e1e1e1"
      >
        <h2 class="title">${this.resource ? this.resource.name : ''}</h2>
        <vaadin-menu-bar
          class="actions"
          @item-selected=${e => {
            e.detail.value.run()();
          }}
          .items="${this.actions
            .filter(
              action => !action.condition || action.condition([this.resource])
            )
            .map(action =>
              action.component
                ? action
                : {
                    text: action.name(),
                    theme: action.theme,
                    run: action.run,
                    style: action.style,
                  }
            )}"
        ></vaadin-menu-bar>
      </vaadin-horizontal-layout>
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
          this.dispatchEvent(
            new CustomEvent('go', {
              detail: { value: `orgs/${this.orgName}` },
              bubbles: true,
              composed: true,
            })
          );
        // response = await import(`./${this.section}.js`);
        // break;
      }
      this.actions = response.actions(this);
      this.renderers = response.renderers(this);
      this.visibleColumns = response.visibleColumns;
      this.requestUpdate();
    })();
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

  reload() {
    this._fetchResource(this.resourceID);
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
