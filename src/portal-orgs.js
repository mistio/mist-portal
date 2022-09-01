import { LitElement, html, css } from 'lit';
import '@vaadin/list-box';
import '@vaadin/item';
import '@vaadin/horizontal-layout';
import '@vaadin/vertical-layout';
import '@vaadin/avatar';
import '@vaadin/text-field';

import '@mistio/mist-form/mist-form.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';
import { BASE_API_SPEC } from './config.js';
/* eslint-disable class-methods-use-this */
export default class PortalOrgs extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        height: 100%;
        padding: 0;
        margin: 0;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      vaadin-button#createOrg {
        width: 100%;
        margin-top: 40px;
      }

      vaadin-list-box {
        max-height: 250px;
        overflow: auto;
      }

      a:link,
      a:visited,
      a:hover,
      a:active {
        text-decoration: none;
        color: inherit;
      }
    `;
  }

  static get properties() {
    return {
      orgs: { type: Array },
      createOrgFormVisible: { type: Boolean },
      createOrgJsonSchema: { type: Object },
    };
  }

  constructor() {
    super();
    this.orgs = [];
    this.createOrgFormVisible = false;
    this.createOrgJsonSchema = {
      $ref: `${BASE_API_SPEC}#/components/schemas/CreateOrganizationRequest`,
    };
    this.createOrgUiSchema = {
      description: {
        'ui:widget': 'textarea',
      },
      logo: {
        'ui:options': {
          accept: 'image/*',
        },
      },
      'ui:cancel': 'Back',
    };
  }

  stateChanged(state) {
    if (!this.orgs.length && state.auth && state.auth.data) {
      this.orgs = state.auth.data.orgs;
      if (!this.orgs.length) {
        this.createOrgFormVisible = true;
      }
    }
  }

  render() {
    const orgList = this.orgs.length
      ? html`
          <div ?hidden=${this.createOrgFormVisible}>
            <h3>Select organization</h3>
            <vaadin-list-box
              @selected-changed=${e =>
                this.dispatchEvent(
                  new CustomEvent('go', {
                    detail: {
                      value: `orgs/${this.orgs[e.target.selected].name}`,
                    },
                    bubbles: true,
                    composed: true,
                  })
                )}
            >
              ${this.orgs.map(
                org => html`
                  <a href="${`./orgs/${org.name}`}">
                    <vaadin-item
                      style="line-height: var(--lumo-line-height-m);"
                    >
                      <vaadin-horizontal-layout
                        style="align-items: center;"
                        theme="spacing"
                      >
                        <vaadin-avatar
                          .img="${org.avatar}"
                          .name="${`${org.name}`}"
                        ></vaadin-avatar>
                        <vaadin-vertical-layout>
                          <span> ${org.name} </span>
                          <span
                            style="color: var(--lumo-secondary-text-color); font-size: var(--lumo-font-size-s);"
                          >
                            ${org.description}
                          </span>
                        </vaadin-vertical-layout>
                      </vaadin-horizontal-layout>
                    </vaadin-item>
                  </a>
                  <hr />
                `
              )}
            </vaadin-list-box>
          </div>
        `
      : '';
    return html`
      <div>
        ${orgList}
        <vaadin-button
          id="createOrg"
          theme="primary"
          ?hidden=${this.createOrgFormVisible}
          @click=${() => {
            this.dispatchEvent(
              new CustomEvent('go', {
                detail: {
                  value: `orgs/+create`,
                },
                bubbles: true,
                composed: true,
              })
            );
          }}
          >Create organization</vaadin-button
        >
      </div>
    `;
  }
}

customElements.define('portal-orgs', PortalOrgs);
