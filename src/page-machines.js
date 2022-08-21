import { LitElement, html, css } from 'lit';
import '@vaadin/button';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { Router } from '@vaadin/router';
import '@mistio/mist-list/mist-list.js';
import '@vaadin/grid';

import { store } from './redux/store.js';
import reduxDataProvider from './redux/data-provider.js';
import { nameRenderer, tagsRenderer } from './renderers.js';

/* eslint-disable class-methods-use-this */
export default class PageMachines extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        align-items: baseline;
        justify-content: center;
      }
      mist-list {
        display: block;
        clear: both;
        width: 100%;
      }
      div.header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
      }
      div.actions {
        display: flex;
        align-items: baseline;
        justify-content: end;
      }
    `;
  }

  static get properties() {
    return {
      action: { type: Array },
      orgName: { type: String },
      selectedItems: { type: Array },
    };
  }

  constructor() {
    super();
    this.name = 'machines';
    const state = store.getState();
    this.orgName = state.org.name;
    this.dataProvider = reduxDataProvider.bind(this);
    this.renderers = this._getRenderers();
    this.selectedItems = [];
    this.actions = [
      {
        name: () => `Edit`,
        theme: 'secondary',
        condition: items => items.length === 1,
        run: () => {},
      },
      {
        name: () => `Rename`,
        theme: 'secondary',
        condition: items => items.length === 1,
        run: () => {},
      },
      {
        name: () => `Remove`,
        theme: 'secondary error',
        icon: html``,
        run: () => () => {},
        condition: items => items.length,
      },
      {
        name: () => 'Create machine',
        theme: 'primary',
        icon: html``,
        run: () => () =>
          Router.go(`/portal/orgs/${this.orgName}/machines/+create`),
        condition: items => !items.length,
      },
    ];
  }

  _getRenderers() {
    return {
      name: nameRenderer,
      tags: tagsRenderer,
    };
  }

  stateChanged(state) {
    if (!this.orgName.length && state.org && state.org.name) {
      this.orgName = state.org.name;
    }
  }

  render() {
    return html` <mist-list
      name="machines"
      searchable
      selectable
      .dataProvider=${reduxDataProvider}
      .frozenColumns=${['name']}
      .actions=${this.actions}
      .renderers=${this.renderers}
      .visibleColumns=${['cloud', 'tags', 'owned_by', 'created_by']}
      @active-item-changed=${e => {
        if (e.detail.value)
          Router.go(
            `/portal/orgs/${this.orgName}/machines/${e.detail.value.id}`
          );
      }}
    >
    </mist-list>`;
  }
}

customElements.define('page-machines', PageMachines);
