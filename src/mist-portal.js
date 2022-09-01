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
    path: '/orgs/+create',
    component: 'org-create',
    action: async () => {
      await import('./org-create.js');
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
        path: 'clouds',
        component: 'page-clouds',
        action: async () => {
          await import('./page-clouds.js');
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
        path: 'clouds/:cloud',
        component: 'cloud-page',
        action: async () => {
          await import('./cloud-page.js');
        },
      },
      {
        path: 'stacks',
        component: 'page-stacks',
        action: async () => {
          await import('./page-stacks.js');
        },
      },
      {
        path: 'clusters',
        component: 'page-clusters',
        action: async () => {
          await import('./page-clusters.js');
        },
      },
      {
        path: 'machines',
        component: 'page-machines',
        action: async () => {
          await import('./page-machines.js');
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
        path: 'machines/:machine',
        component: 'machine-page',
        action: async () => {
          await import('./machine-page.js');
        },
      },

      {
        path: 'volumes',
        component: 'page-volumes',
        action: async () => {
          await import('./page-volumes.js');
        },
      },
      {
        path: 'buckets',
        component: 'page-buckets',
        action: async () => {
          await import('./page-buckets.js');
        },
      },
      {
        path: 'networks',
        component: 'page-networks',
        action: async () => {
          await import('./page-networks.js');
        },
      },
      {
        path: 'zones',
        component: 'page-zones',
        action: async () => {
          await import('./page-zones.js');
        },
      },
      {
        path: 'images',
        component: 'page-images',
        action: async () => {
          await import('./page-images.js');
        },
      },
      {
        path: 'keys',
        component: 'page-keys',
        action: async () => {
          await import('./page-keys.js');
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
        path: 'keys/:key',
        component: 'key-page',
        action: async () => {
          await import('./key-page.js');
        },
      },
      {
        path: 'secrets',
        component: 'page-secrets',
        action: async () => {
          await import('./page-secrets.js');
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
        path: 'secrets/:secret',
        component: 'secret-page',
        action: async () => {
          await import('./secret-page.js');
        },
      },
      {
        path: 'scripts',
        component: 'page-scripts',
        action: async () => {
          await import('./page-scripts.js');
        },
      },
      {
        path: 'templates',
        component: 'page-templates',
        action: async () => {
          await import('./page-templates.js');
        },
      },
      {
        path: 'schedules',
        component: 'page-schedules',
        action: async () => {
          await import('./page-schedules.js');
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
        path: 'rules',
        component: 'page-rules',
        action: async () => {
          await import('./page-rules.js');
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
        path: 'members',
        component: 'page-members',
        action: async () => {
          await import('./page-members.js');
        },
      },
      {
        path: 'teams',
        component: 'page-teams',
        action: async () => {
          await import('./page-teams.js');
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
      vaadin-app-layout {
        --lumo-base-color: #222;
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
      const response = await (await fetch(`/api/v2/auth`)).json();

      store.dispatch(authUpdated(response));
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
  }

  disconnectedCallback() {
    window.removeEventListener('go', this.go.bind(this));
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
}

customElements.define('mist-portal', MistPortal);
