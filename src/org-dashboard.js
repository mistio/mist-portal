import { LitElement, html, css } from 'lit';
import '@vaadin/select';
import '@vaadin/text-field';
import '@vaadin/vaadin-lumo-styles/presets/compact.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';
import { orgUpdated, orgSelected } from './redux/slices/org.js';

/* eslint-disable class-methods-use-this */
export default class OrgDashboard extends connect(store)(LitElement) {
  static get styles() {
    return css`
      div.header {
        width: 100%;
        justify-content: space-between;
        display: flex;
      }
      vaadin-avatar {
        top: 8px;
        right: 4px;
        position: relative;
        margin-left: 8px;
      }
      a.logo-link {
        text-decoration: none;
      }
      a.logo-link > img {
        width: 71px;
        margin-left: -2px;
        position: relative;
        top: 5px;
      }

      vaadin-select#selectOrg {
        position: relative;
        top: -4px;
        left: 16px;
        width: 8em;
        --lumo-contrast-10pct: transparent;
      }
      vaadin-select#selectOrg > vaadin-select-value-button {
        text-align: center;
      }
      vaadin-text-field#searchInput {
        width: 30%;
        position: relative;
        top: 4px;
      }
      #drawer {
        width: 160px;
      }
      [part='drawer'] {
        width: 100px !important;
      }
    `;
  }

  static get properties() {
    return {
      orgName: { type: String },
      orgs: { type: Array },
    };
  }

  constructor() {
    super();
    const state = store.getState();
    this.orgName = (state.org && state.org.name) || '';
    this.orgs = state.auth.data.orgs || [];
  }

  onAfterEnter() {
    this.orgName =
      this.parentElement.parentNode.host.router.location.params.org;
    store.dispatch(orgSelected(this.orgName));
    this._fetchOrg(this.orgName);
  }

  stateChanged(state) {
    if (!this.orgName && state.org.name) {
      this.orgName = state.org.name;
      this._fetchOrg(this.orgName);
    }
    if (!this.orgs.length && state.orgs.meta && state.orgs.meta.total) {
      this.orgs = state.orgs.data;
    }
  }

  render() {
    return html`
      <vaadin-app-layout class="box m shadow">
        <vaadin-drawer-toggle
          slot="navbar touch-optimized"
          role="button"
        ></vaadin-drawer-toggle>
        <div
          class="header"
          slot="navbar touch-optimized"
          ?hidden=${this.fullscreen}
        >
          <div>
            <a href="./" class="logo-link">
              <img src="assets/mist-logo-inverted.svg" alt="" />
            </a>
            <vaadin-select
              id="selectOrg"
              theme="compact"
              .items="${this.orgs.map(i => ({ label: i.name, value: i.name }))}"
              .value="${this.orgName}"
              @change=${e => {
                this.dispatchEvent(
                  new CustomEvent('go', {
                    detail: { value: `orgs/${e.target.value}` },
                    bubbles: true,
                    composed: true,
                  })
                );
              }}
            ></vaadin-select>
          </div>
          <vaadin-text-field placeholder="Search" id="searchInput">
            <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
          </vaadin-text-field>
          <vaadin-avatar .name="Name Surname"></vaadin-avatar>
        </div>
        <mist-sidebar
          id="sidebar"
          slot="drawer"
          ?hidden=${!this.orgName.length}
        ></mist-sidebar>
        <slot></slot>
      </vaadin-app-layout>
    `;
  }

  async _fetchOrg(id) {
    if (id) {
      const data = await (
        await fetch(`/api/v2/orgs/${id}?summary=true`, {
          headers: {
            'X-Org': id,
          },
        })
      ).json();
      store.dispatch(orgUpdated(data));
    }
  }
}

customElements.define('org-dashboard', OrgDashboard);
