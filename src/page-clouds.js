import { LitElement, html, css } from 'lit';
import '@vaadin/button';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { Router } from '@vaadin/router';
import '@mistio/mist-list/mist-list.js';
import '@vaadin/grid';

import { store } from './redux/store.js';
import reduxDataProvider from './redux/data-provider.js';

/* eslint-disable class-methods-use-this */
export default class PageClouds extends connect(store)(LitElement) {
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
    this.name = 'clouds';
    const state = store.getState();
    this.orgName = state.org.name;
    this.dataProvider = reduxDataProvider.bind(this);
    this.renderers = this._getRenderers();
    this.selectedItems = [];
    this.actions = [
      {
        name: () => `Edit credentials`,
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
        name: () => 'Add cloud',
        theme: 'primary',
        icon: html``,
        run: () => () => Router.go(`/portal/orgs/${this.orgName}/clouds/+add`),
        condition: items => !items.length,
      },
    ];
  }

  _getRenderers() {
    // const _this = this;
    return {
      name: {
        body: row => html`<strong class="name">${row.name}</strong>`,
      },
      icon: {
        title: () => '',
        body: () => html``,
        // body: (_item, row) => {
        //   if (!row.provider) return '';
        //   return `./assets/providers/provider-${row.provider
        //     .replace('_', '')
        //     .replace(' ', '')}.png`;
        // },
      },
      // machines: {
      //   body: (item, _row) => (item && Object.keys(item).length) || 0,
      //   cmp: (row1, row2) => {
      //     const item1 =
      //       (row1.machines && Object.keys(row1.machines).length) || 0;
      //     const item2 =
      //       (row2.machines && Object.keys(row2.machines).length) || 0;
      //     if (item1 > item2) return 1;
      //     if (item2 > item1) return -1;
      //     return 0;
      //   },
      // },
      // volumes: {
      //   body: (item, _row) => (item && Object.keys(item).length) || 0,
      //   cmp: (row1, row2) => {
      //     const item1 = (row1.volumes && Object.keys(row1.volumes).length) || 0;
      //     const item2 = (row2.volumes && Object.keys(row2.volumes).length) || 0;
      //     if (item1 > item2) return 1;
      //     if (item2 > item1) return -1;
      //     return 0;
      //   },
      // },
      // locations: {
      //   body: (item, _row) => (item && Object.keys(item).length) || 0,
      //   cmp: (row1, row2) => {
      //     const item1 =
      //       (row1.locations && Object.keys(row1.locations).length) || 0;
      //     const item2 =
      //       (row2.locations && Object.keys(row2.locations).length) || 0;
      //     if (item1 > item2) return 1;
      //     if (item2 > item1) return -1;
      //     return 0;
      //   },
      // },
      // owned_by: {
      //   title: (_item, _row) => 'owner',
      //   body: (item, _row) =>
      //     _this.model.members[item]
      //       ? _this.model.members[item].name ||
      //         _this.model.members[item].email ||
      //         _this.model.members[item].username
      //       : '',
      //   cmp: (row1, row2) => {
      //     const item1 = this.model.members[row1.owned_by]
      //       ? this.model.members[row1.owned_by].name ||
      //         this.model.members[row1.owned_by].email ||
      //         this.model.members[row1.owned_by].username
      //       : '';
      //     const item2 = this.model.members[row2.owned_by]
      //       ? this.model.members[row2.owned_by].name ||
      //         this.model.members[row2.owned_by].email ||
      //         this.model.members[row2.owned_by].username
      //       : '';
      //     return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
      //   },
      // },
      // created_by: {
      //   title: (_item, _row) => 'created by',
      //   body: (item, _row) =>
      //     _this.model.members[item]
      //       ? _this.model.members[item].name ||
      //         _this.model.members[item].email ||
      //         _this.model.members[item].username
      //       : '',
      //   cmp: (row1, row2) => {
      //     const item1 = this.model.members[row1.created_by]
      //       ? this.model.members[row1.owned_by].name ||
      //         this.model.members[row1.owned_by].email ||
      //         this.model.members[row1.owned_by].username
      //       : '';
      //     const item2 = this.model.members[row2.created_by]
      //       ? this.model.members[row2.owned_by].name ||
      //         this.model.members[row2.owned_by].email ||
      //         this.model.members[row2.owned_by].username
      //       : '';
      //     return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
      //   },
      // },
      // tags: {
      //   body: (item, _row) => {
      //     const tags = item;
      //     let display = '';
      //     Object.keys(tags || {})
      //       .sort()
      //       .forEach(key => {
      //         display += `<span class='tag'>${key}`;
      //         if (tags[key] != null && tags[key] !== '')
      //           display += `=${tags[key]}`;
      //         display += '</span>';
      //       });
      //     return display;
      //   },
      //   // sort by number of tags, resources with more tags come first
      //   // if two resources have the same number of tags show them in alphabetic order
      //   cmp: (row1, row2) => {
      //     const keys1 = Object.keys(row1.tags).sort();
      //     const keys2 = Object.keys(row2.tags).sort();
      //     if (keys1.length > keys2.length) return -1;
      //     if (keys1.length < keys2.length) return 1;
      //     const item1 = keys1.length > 0 ? keys1[0] : '';
      //     const item2 = keys2.length > 0 ? keys2[0] : '';
      //     return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
      //   },
      // },
    };
  }

  stateChanged(state) {
    if (!this.orgName.length && state.org && state.org.name) {
      this.orgName = state.org.name;
    }
  }

  render() {
    return html` <mist-list
      name="clouds"
      searchable
      selectable
      .dataProvider=${reduxDataProvider}
      .frozenColumns=${['name']}
      .actions=${this.actions}
      .renderers=${this.renderers}
      .visibleColumns=${['provider', 'tags', 'owned_by', 'created_by']}
      @active-item-changed=${e => {
        if (e.detail.value)
          Router.go(`/portal/orgs/${this.orgName}/clouds/${e.detail.value.id}`);
      }}
    >
    </mist-list>`;
  }
}

customElements.define('page-clouds', PageClouds);
