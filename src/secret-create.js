import { LitElement, html, css } from 'lit';

import '@mistio/mist-form/mist-form.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';
import '@vaadin/text-field';
import { BASE_API_SPEC } from './config.js';
import '@vaadin/password-field';

/* eslint-disable class-methods-use-this */
export default class SecretCreate extends connect(store)(LitElement) {
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
        justify-content: center;
      }
      mist-form {
        max-width: 330px;
        margin: 5% auto;
        color: #333;
      }
    `;
  }

  static get properties() {
    return {
      orgName: { type: String },
      jsonSchema: { type: Object },
      uiSchema: { type: Object },
    };
  }

  constructor() {
    super();
    this.jsonSchema = {
      $ref: `${BASE_API_SPEC}#/components/schemas/CreateSecretRequest`,
    };
    this.uiSchema = {
      json: {
        'ui:widget': 'toggle',
        transform: e => e,
      },
      secret: {
        'ui:widget': 'textarea',
        'ui:options': {
          orderable: false,
          style: 'padding: 0;margin: 0;',
        },
        items: {
          value: {
            'ui:widget': 'password',
          },
        },
        'ui:transform': e => {
          const ret = {};
          e.forEach(i => {
            ret[i.key] = i.value;
          });
          return JSON.stringify(ret);
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
        action="/api/v2/secrets"
        .headers=${{ 'X-Org': this.orgName }}
        method="post"
        .jsonSchema=${this.jsonSchema}
        .uiSchema=${this.uiSchema}
        .formData=${{ secret: [{ key: '', value: '' }] }}
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
                  value: `orgs/${this.orgName}/secrets/${
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

customElements.define('secret-create', SecretCreate);
