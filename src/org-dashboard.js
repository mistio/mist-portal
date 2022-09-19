import { LitElement, html, css } from 'lit';
import '@vaadin/select';
import '@vaadin/text-field';
import '@vaadin/vaadin-lumo-styles/presets/compact.js';
import '@vaadin/vaadin-lumo-styles/color.js';

import { selectRenderer } from 'lit-vaadin-helpers';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
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
    if (
      state.auth &&
      state.auth.data.orgs &&
      state.auth.data.orgs.length !== this.orgs.length
    ) {
      this.orgs = state.auth.data.orgs;
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
              .value="${this.orgName}"
              ${selectRenderer(this.orgRenderer, this.orgs)}
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

  orgRenderer() {
    return html`
      <vaadin-list-box>
        ${this.orgs.map(
          org => html`
            ${org.name === this.orgName
              ? html` <vaadin-button
                  theme="icon tertiary small borderless"
                  title="Organization settings"
                  style="box-shadow: none !important; float:right; margin-right: 2px; border: none"
                  @click=${() => {
                    this.dispatchEvent(
                      new CustomEvent('go', {
                        detail: { value: `orgs/${this.orgName}/+settings` },
                        bubbles: true,
                        composed: true,
                      })
                    );
                  }}
                  ><vaadin-icon icon="vaadin:wrench"></vaadin-icon
                ></vaadin-button>`
              : ''}

            <vaadin-item value="${org.name}">
              <div style="display: flex; align-items: center;">
                <div style="height: 18px; width: 18px; margin-right: 8px;">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 18 18"
                    fit=""
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                  >
                    <path
                      d="M10.557 11.99l-1.71-2.966 1.71-3.015h3.42l1.71 3.01-1.71 2.964h-3.42zM4.023 16l-1.71-2.966 1.71-3.015h3.42l1.71 3.01L7.443 16h-3.42zm0-8.016l-1.71-2.966 1.71-3.015h3.42l1.71 3.015-1.71 2.966h-3.42z"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>${org.name}</div>
              </div>
            </vaadin-item>
          `
        )}
        <vaadin-button
          theme="compact primary"
          @click=${() => {
            this.dispatchEvent(
              new CustomEvent('go', {
                detail: { value: 'orgs/+create' },
                bubbles: true,
                composed: true,
              })
            );
          }}
          >Create organization</vaadin-button
        >
      </vaadin-list-box>
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
