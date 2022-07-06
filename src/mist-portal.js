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

// import './styles/shared-styles.js';
// import './mist-header/mist-header.js';
import './mist-sidebar.js';
// import './app-icons/app-icons.js';
// import './mist-socket.js';
// import './mist-notice.js';
// import './mist-icons.js';
// import { configUpdated } from './redux/slices/config.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './redux/store.js';
import { authUpdated } from './redux/slices/auth.js';
import { orgSelected } from './redux/slices/org.js';

const routes = [
  {
    path: '',
    redirect: '/portal',
  },
  {
    path: '/portal',
    redirect: '/portal/orgs',
  },
  {
    path: '/portal/orgs',
    component: 'portal-orgs',
    action: async () => {
      await import('./portal-orgs.js');
    },
  },
  {
    path: '/portal/+create-org',
    component: 'create-org',
    action: async () => {
      await import('./create-org.js');
    },
  },
  {
    path: '/portal/orgs/:org',
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
    return Router.go(to);
  }

  constructor() {
    super();
    this.title = 'Mist portal';
    this.currentOrg = '';
    // this.Router = Router;
    (async () => {
      const response = await (await fetch(`/api/v2/auth`)).json();

      store.dispatch(authUpdated(response));
      let orgName = '';
      const pathArray = document.location.pathname.split('/');
      if (pathArray.length >= 3) {
        [, , orgName] = pathArray;
        if (!response.data.orgs.find(i => i.name === orgName)) {
          Router.go('/portal');
        }
        store.dispatch(orgSelected(orgName));
      } else if (
        response.data.orgs.length === 1 &&
        this.state.org.name === undefined
      ) {
        orgName = response.data.orgs[0].name; // TODO: get last_active instead of first
        store.dispatch(orgSelected(orgName));
        const targetPath = `/portal/${orgName}`;
        if (document.location.pathname !== targetPath) {
          Router.go(targetPath);
        }
      }
    })();
  }

  stateChanged(state) {
    if (!this.currentOrg && state.org.name) {
      this.currentOrg = state.org.name;
    }
  }

  firstUpdated() {
    this.router = new Router(this.shadowRoot.querySelector('div#main'));
    this.router.setRoutes(routes);
  }

  render() {
    return html` <div id="main"></div> `;
    //   <!-- <iron-media-query query="(max-width: 1024px)" query-matches="{{smallscreen}}"></iron-media-query>
    //     <iron-media-query query="(max-width: 600px)" query-matches="{{xsmallscreen}}"></iron-media-query>
    //     <app-header-layout mode="standard" class="fit" fullbleed="">
    //         <mist-notice model="[[model]]" class="paper-header"></mist-notice>
    //         <app-header slot="header" fixed="" shadow="" hidden$="[[fullscreen]]">
    //             <mist-header sticky="" model="[[model]]" title="[[page]]" query="{{searchQuery}}" class="paper-header" count="[[count]]" viewing-list="[[viewingList]]" user-menu-opened="{{userMenuOpened}}" ownership="[[model.org.ownership_enabled]]" visible-suggestions="{{visibleSuggestions}}"></mist-header>
    //         </app-header>
    //         <mist-sidebar id="sidebar" model="[[model]]" tag="[[tag]]" current="{{page}}" drawer="" smallscreen="[[smallscreen]]" xsmallscreen="[[xsmallscreen]]" isclosed="{{sidebarIsClosed}}"></mist-sidebar>
    //         <div id="main-loader" class$="is-loading-html active-[[loading]]">
    //             <paper-spinner active="[[loading]]"></paper-spinner>
    //         </div>
    //             <page-dashboard name="dashboard" model="[[model]]" viewing-dashboard="[[_isPage('dashboard', page)]]" xsmallscreen="[[xsmallscreen]]" docs="[[config.features.docs]]"></page-dashboard>
    //             <page-clouds name="clouds" route="{{subroute}}" model="[[model]]" enable-monitoring="[[config.features.monitoring]]" docs="[[config.features.docs]]" portal-name="[[config.portal_name]]" enable-billing="[[config.features.billing]]"></page-clouds>
    //             <page-clusters name="clusters" route="{{subroute}}" model="[[model]]"></page-clusters>
    //             <page-machines name="machines" route="{{subroute}}" model="[[model]]" monitoring="[[config.features.monitoring]]" docs="[[config.features.docs]]" portal-name="[[config.portal_name]]"></page-machines>
    //             <page-images name="images" route="{{subroute}}" model="[[model]]" portal-name="[[config.portal_name]]"></page-images>
    //             <page-keys name="keys" route="{{subroute}}" model="[[model]]" config="[[config]]"></page-keys>
    //             <page-networks name="networks" route="{{subroute}}" model="[[model]]"></page-networks>
    //             <page-volumes name="volumes" route="{{subroute}}" model="[[model]]"></page-volumes>
    //             <page-buckets name="buckets" route="{{subroute}}" model="[[model]]"></page-buckets>
    //             <page-zones name="zones" route="{{subroute}}" model="[[model]]"></page-zones>
    //             <page-secrets name="secrets" route="{{subroute}}" model="[[model]]"></page-secrets>
    //             <page-tunnels name="tunnels" route="{{subroute}}" model="[[model]]" hidden$="[[!config.features.tunnels]]"></page-tunnels>
    //             <page-scripts name="scripts" route="{{subroute}}" model="[[model]]" docs="[[config.features.docs]]"></page-scripts>
    //             <page-schedules name="schedules" route="{{subroute}}" model="[[model]]" docs="[[config.features.docs]]"></page-schedules>
    //             <page-rules name="rules" route="{{subroute}}" model="[[model]]" docs="[[config.features.docs]]" features="[[config.features]]"></page-rules>
    //             <page-templates name="templates" route="{{subroute}}" model="[[model]]" hidden$="[[!config.features.orchestration]]"></page-templates>
    //             <page-stacks name="stacks" route="{{subroute}}" model="[[model]]" hidden$="[[!config.features.orchestration]]"></page-stacks>
    //             <page-teams name="teams" route="{{subroute}}" model="[[model]]" rbac="[[config.features.rbac]]" billing="[[config.features.billing]]" cta="[[config.cta.rbac]]" email="[[config.email]]" docs="[[config.features.docs]]"></page-teams>
    //             <page-members name="members" route="{{subroute}}" model="[[model]]"></page-members>
    //             <page-incidents name="incidents" route="{{subroute}}" model="[[model]]"></page-incidents>
    //             <page-insights name="insights" route="{{subroute}}" model="[[model]]" email="[[config.email]]" insights-enabled="[[model.org.insights_enabled]]" hidden$="[[!config.features.insights]]"></page-insights>
    //             <page-my-account name="my-account" route="{{subroute}}" user="[[model.user]]" org="[[model.org]]" machines="[[model.machines]]" tokens="[[model.tokens]]" sessions="[[model.sessions]]" config="[[config]]"></page-my-account>
    //             <page-not-found name="not-found" route="{{subroute}}"></page-not-found>
    //         <paper-toast id="mist-toast"></paper-toast>
    //     </app-header-layout>
    //     <mist-socket model="{{model}}"></mist-socket>
    //     <app-notifications id="desktop-notifier" on-click="handleDesktopNotificationClick"></app-notifications>
    //     <organization-add id="organizationAdd" current-org="[[model.org]]"></organization-add> -->
    // `;
  }
}

customElements.define('mist-portal', MistPortal);
