import { LitElement, html, css } from 'lit';
import '@vaadin/vaadin-lumo-styles/all-imports';
import '@vaadin/vaadin-lumo-styles/color';
import '@vaadin/vaadin-lumo-styles/presets/compact.js';
import '@vaadin/polymer-legacy-adapter/style-modules.js';

import '@vaadin/app-layout/theme/lumo/vaadin-app-layout';
import '@vaadin/app-layout/theme/lumo/vaadin-drawer-toggle.js';
import '@vaadin/app-layout/theme/lumo/vaadin-drawer-toggle-styles.js';
import '@vaadin/icons';
import '@vaadin/avatar';

import { Router } from '@vaadin/router';

import './mist-sidebar.js';
// import './app-icons/app-icons.js';
// import './mist-icons.js';
// import { configUpdated } from './redux/slices/config.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';
import { authUpdated } from './redux/slices/auth.js';
import { orgSelected } from './redux/slices/org.js';

const routes = [
  {
    path: '/orgs/+create',
    component: 'org-create',
    action: async () => {
      await import('./org-create.js');
    },
  },
  {
    path: '/',
    redirect: '/orgs',
  },
  {
    path: '/orgs',
    component: 'portal-orgs',
    action: async () => {
      await import('./portal-orgs.js');
    },
  },
  {
    path: '/orgs/:org',
    component: 'org-dashboard',
    action: async () => {
      await import('./org-dashboard.js');
    },
    // onAfterEnter: async () => {
    //   debugger;
    // },
    children: [
      {
        path: '+settings',
        component: 'org-settings',
        action: async () => {
          await import('./org-settings.js');
        },
      },
      {
        path: ':section',
        component: 'list-page',
        action: async () => {
          await import('./list-page.js');
        },
      },
      {
        path: 'clouds/+add',
        component: 'cloud-add',
        action: async () => {
          await import('./cloud-add.js');
        },
      },
      {
        path: 'clouds/:cloud/+edit',
        component: 'cloud-edit',
        action: async () => {
          await import('./cloud-edit.js');
        },
      },
      {
        path: 'clusters/+create',
        component: 'cluster-create',
        action: async () => {
          await import('./cluster-create.js');
        },
      },
      {
        path: 'machines/+create',
        component: 'machine-create',
        action: async () => {
          await import('./machine-create.js');
        },
      },
      {
        path: 'keys/+add',
        component: 'key-add',
        action: async () => {
          await import('./key-add.js');
        },
      },
      {
        path: 'secrets/+create',
        component: 'secret-create',
        action: async () => {
          await import('./secret-create.js');
        },
      },
      {
        path: 'schedules/+add',
        component: 'schedule-add',
        action: async () => {
          await import('./schedule-add.js');
        },
      },
      {
        path: 'rules/+add',
        component: 'rule-add',
        action: async () => {
          await import('./rule-add.js');
        },
      },
      {
        path: ':section/:resource',
        component: 'resource-page',
        action: async () => {
          await import('./resource-page.js');
        },
      },
    ],
  },
];

document.documentElement.setAttribute('theme', 'dark');

export class MistPortal extends connect(store)(LitElement) {
  static get properties() {
    return {
      title: { type: String },
      fullscreen: { type: Boolean },
      currentOrg: { type: String },
    };
  }

  static get styles() {
    return css`
      div#main {
        height: 100%;
        padding: 0 3%;
      }
      vaadin-drawer-toggle {
        --lumo-primary-text-color: #fff;
        margin: 8px;
      }

      a.logo-link > img {
        margin-top: 4px;
      }
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  get state() {
    return store.getState();
  }

  // eslint-disable-next-line class-methods-use-this
  go(to) {
    if (to && to.detail && to.detail.value) {
      // eslint-disable-next-line no-param-reassign
      to = to.detail.value;
    }
    return Router.go(`${this.router.baseUrl}${to}`);
  }

  constructor() {
    super();
    this.title = 'Mist portal';
    this.currentOrg = '';
    (async () => {
      const response = await this.auth();
      let orgName = '';
      const pathArray = document.location.pathname.split('/');
      if (pathArray.length >= 4) {
        [, , , orgName] = pathArray;
        if (!response.data.orgs.find(i => i.name === orgName)) {
          this.go('');
        }
        store.dispatch(orgSelected(orgName));
      } else if (
        response.data.orgs.length === 1 &&
        this.state.org.name === undefined
      ) {
        orgName = response.data.orgs[0].name; // TODO: get last_active instead of first
        store.dispatch(orgSelected(orgName));
        if (document.location.pathname.indexOf(orgName) === -1) {
          this.go(`orgs/${orgName}`);
        }
      }
    })();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('go', this.go.bind(this));
    window.addEventListener('auth', this.auth);
  }

  disconnectedCallback() {
    window.removeEventListener('go', this.go.bind(this));
    window.removeEventListener('auth', this.auth);
    super.disconnectedCallback();
  }

  stateChanged(state) {
    if (!this.currentOrg && state.org.name) {
      this.currentOrg = state.org.name;
    }
  }

  firstUpdated() {
    this.router = new Router(this.shadowRoot.querySelector('div#main'));
    this.router.setRoutes(routes);
    window.router = this.router;
  }

  render() {
    return html` <div id="main"></div> `;
  }

  // eslint-disable-next-line class-methods-use-this
  async auth() {
    const response = await (await fetch(`/api/v2/auth`)).json();
    if (response.status === 401) {
      document.location = '/';
    } else {
      store.dispatch(authUpdated(response));
    }
    return response;
  }
}

customElements.define('mist-portal', MistPortal);
