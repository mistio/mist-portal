import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import '@mistio/mist-form/mist-form.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';
// eslint-disable-next-line import/no-named-as-default
import BASE_API_SPEC from './config.js';
/* eslint-disable class-methods-use-this */
export default class CreateOrg extends connect(store)(LitElement) {
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
        margin: 10% auto;
        max-width: 180px;
      }
    `;
  }

  static get properties() {
    return {
      jsonSchema: { type: Object },
      uiSchema: { type: Object },
    };
  }

  constructor() {
    super();
    this.jsonSchema = {
      $ref: `${BASE_API_SPEC}#/components/schemas/CreateOrganizationRequest`,
    };
    this.uiSchema = {
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

  render() {
    return html` <mist-form
      action="/api/v2/orgs"
      method="POST"
      .jsonSchema=${this.jsonSchema}
      .uiSchema=${this.uiSchema}
      @mist-form-cancel=${() => {
        Router.go('/portal/orgs');
      }}
      @response=${e => {
        Router.go(`/portal/orgs/${JSON.parse(e.detail.target.response).name}`);
      }}
      .responsiveSteps=${[{ minWidth: '0', columns: 1, labelsPosition: 'top' }]}
    ></mist-form>`;
  }
}

customElements.define('create-org', CreateOrg);
