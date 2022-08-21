import { Router } from '@vaadin/router';

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
    path: '/+create-org',
    component: 'create-org',
    action: async () => {
      await import('./create-org.js');
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
        path: 'keys/:cloud',
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
        path: 'secrets/:cloud',
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

const router = new Router(
  document.querySelector('mist-portal').shadowRoot.querySelector('div#main')
);
router.setRoutes(routes);
export { router };
