import { LitElement, html, css } from 'lit';
import '@mistio/mist-form/mist-form.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';
import '@vaadin/text-field';
import { BASE_API_SPEC } from './config.js';
/* eslint-disable class-methods-use-this */
export default class ScheduleAdd extends connect(store)(LitElement) {
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
    };
  }

  constructor() {
    super();
    this.jsonSchema = {
      $ref: `${BASE_API_SPEC}#/components/schemas/AddScheduleRequest`,
    };
    this.uiSchema = {
      'ui:cancel': 'Cancel',
    };
  }

  render() {
    return html`
      <mist-form
        action="/api/v2/schedules"
        method="post"
        .jsonSchema=${this.jsonSchema}
        .uiSchema=${this.uiSchema}
        .responsiveSteps=${[
          { minWidth: '0', columns: 2, labelsPosition: 'top' },
        ]}
        @mist-form-cancel=${() => {
          window.history.back();
        }}
      ></mist-form>
    `;
  }
}

customElements.define('schedule-add', ScheduleAdd);
