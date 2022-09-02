import { LitElement, html, css } from 'lit';
import '@mistio/mist-form/mist-form.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';
import { orgSelected } from './redux/slices/org.js';

// eslint-disable-next-line import/no-named-as-default
import BASE_API_SPEC from './config.js';
/* eslint-disable class-methods-use-this */
export default class OrgCreate extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        height: 100%;
        padding: 0px;
        margin: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      mist-form {
        margin: 10% auto;
        max-width: 280px;
        align-items: center;
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
      vault: {
        external: {
          'ui:widget': 'toggle',
        },
        auth_method: {
          'ui:widget': 'radio',
        },
        'ui:options': {
          style: 'border-left: none; padding: 0;',
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
      .headers=${{}}
      @mist-form-cancel=${() => {
        this.dispatchEvent(
          new CustomEvent('go', {
            detail: { value: 'orgs' },
            bubbles: true,
            composed: true,
          })
        );
      }}
      @response=${e => {
        const orgName = JSON.parse(e.detail.target.response).name;
        this.dispatchEvent(
          new CustomEvent('auth', {
            detail: { value: 'orgs' },
            bubbles: true,
            composed: true,
          })
        );
        store.dispatch(orgSelected(orgName));
        this.dispatchEvent(
          new CustomEvent('go', {
            detail: {
              value: `orgs/${orgName}`,
            },
            bubbles: true,
            composed: true,
          })
        );
      }}
      .responsiveSteps=${[{ minWidth: '0', columns: 1, labelsPosition: 'top' }]}
    ></mist-form>`;
  }
}

customElements.define('org-create', OrgCreate);
