import { LitElement, html, css } from 'lit';
import '@mistio/mist-form/mist-form.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';
import '@vaadin/text-field';
import { BASE_API_SPEC } from './config.js';
/* eslint-disable class-methods-use-this */
export default class CloudEdit extends connect(store)(LitElement) {
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
        align-items: baseline;
        justify-content: center;
      }
      mist-form {
        max-width: 330px;
        margin: 10% auto;
      }
    `;
  }

  static get properties() {
    return {
      jsonSchema: { type: Object },
      uiSchema: { type: Object },
      orgName: { type: String },
    };
  }

  constructor() {
    super();
    this.orgName = '';
    this.jsonSchema = {
      $ref: `${BASE_API_SPEC}#/components/schemas/EditCloudRequest`,
    };
    this.uiSchema = {
      credentials: {
        tlsKey: {
          'ui:widget': 'password',
        },
        apikey: {
          'ui:widget': 'password',
        },
        password: {
          'ui:widget': 'password',
        },
        secret: {
          'ui:widget': 'password',
        },
        privateKey: {
          'ui:widget': 'password',
        },
        key: {
          'ui:widget': 'password',
        },
        apisecret: {
          'ui:widget': 'password',
        },
        token: {
          'ui:widget': 'password',
        },
      },
      'ui:cancel': 'Cancel',
    };
  }

  stateChanged(state) {
    if (!this.orgName && state.org && state.org.name) {
      this.orgName = state.org.name;
    }
  }

  render() {
    return html`
      <mist-form
        action="/api/v2/clouds"
        method="post"
        .headers=${{
          'X-Org': this.orgName,
          'Content-Type': 'application/json',
        }}
        .jsonSchema=${this.jsonSchema}
        .uiSchema=${this.uiSchema}
        .responsiveSteps=${[
          { minWidth: '0', columns: 2, labelsPosition: 'top' },
        ]}
        @mist-form-cancel=${() => {
          window.history.back();
        }}
        @response=${e => {
          if (e.detail.status < 300) {
            this.dispatchEvent(
              new CustomEvent('go', {
                detail: {
                  value: `orgs/${this.orgName}/clouds/${
                    JSON.parse(e.detail.target.response).id
                  }`,
                },
                bubbles: true,
                composed: true,
              })
            );
          }
        }}
      ></mist-form>
    `;
  }
}

customElements.define('cloud-edit', CloudEdit);
