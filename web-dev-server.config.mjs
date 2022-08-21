import http, { request } from 'http';
import proxy from 'koa-proxies';

const server = http.createServer((request, response) => {
  let body = {};
  response.writeHead(200, { 'Content-Type': 'application/json' });
  if (request.url === '/api/v2/auth') {
    body = {
      data: {
        orgs: [
          {
            id: 'ab442651f82c4b718361ece71dad255c',
            last_active: '2022-07-11T12:17:13.039000',
            name: 'org1',
          },
          {
            id: 'cf6e6e3b8a4a4db58de375456f4a815f',
            last_active: null,
            name: 'org2',
          },
        ],
        user: {
          email: 'dimo@mist.io',
          first_name: 'Dimitris',
          id: '727cc7a3240c4dc8ba693fffca3e4b8a',
          last_active: '2022-07-11T12:17:13.021000',
          last_login: '2022-07-11T12:17:12.948451',
          last_name: 'Moraitis',
          registration_date: '',
          role: null,
          username: null,
        },
      },
      meta: {},
    };
  } else if (request.url === '/api/v2/orgs') {
    if (request.method === 'POST') {
      body = {
        name: 'org1',
      };
    } else {
      body = {
        data: [
          {
            created: '2022-06-26T14:23:23.223000',
            id: '4e042f570ed043be893d57f76093bee2',
            last_active: '2022-07-02T14:06:58.974000',
            name: 'org1',
          },
          {
            created: '2022-06-26T14:23:23.223000',
            id: '4e042f570ed043be893d57f76093bee2',
            last_active: '2022-07-02T14:06:58.974000',
            name: 'lolo',
          },
        ],
        meta: {
          kind: 'orgs',
          returned: 2,
          sort: null,
          start: 0,
          total: 2,
        },
      };
    }
  } else if (request.url === '/api/v2/orgs/org1?summary=true') {
    body = {
      data: {
        clouds_count: 2,
        created: '2022-06-26T14:23:23.223000',
        default_monitoring_method: null,
        enable_r12ns: false,
        enterprise_plan: {},
        id: '4e042f570ed043be893d57f76093bee2',
        insights_enabled: false,
        last_active: '2022-07-07T14:19:57.729000',
        members: [
          {
            email: 'dimo@mist.io',
            first_name: '',
            id: '59925306a32f4279a241403d1d308157',
            last_active: '2022-07-07T14:19:57.721000',
            last_login: '2022-07-02T14:06:58.907965',
            last_name: '',
            registration_date: '',
            role: null,
            username: null,
          },
        ],
        members_count: 1,
        name: 'org1',
        ownership_enabled: true,
        resources: {
          buckets: {
            total: 0,
          },
          clouds: {
            total: 2,
          },
          clusters: {
            total: 0,
          },
          images: {
            total: 164,
          },
          keys: {
            total: 1,
          },
          machines: {
            total: 58,
          },
          networks: {
            total: 0,
          },
          rules: {
            total: 0,
          },
          schedules: {
            total: 0,
          },
          scripts: {
            total: 0,
          },
          secrets: {
            total: 3,
          },
          stacks: {
            total: 0,
          },
          teams: {
            total: 1,
          },
          templates: {
            total: 0,
          },
          volumes: {
            total: 0,
          },
          zones: {
            total: 0,
          },
        },
        selected_plan: null,
        teams: [
          {
            description: null,
            id: 'd25eb84cfeca4259be7985c27c3d514b',
            members: ['dimo@mist.io'],
            members_count: 1,
            name: 'Owners',
          },
        ],
        teams_count: 1,
        total_machine_count: 58,
      },
      meta: {
        kind: 'org',
        returned: 1,
        sort: '',
        start: 0,
        total: 1,
      },
    };
  } else if (request.url === '/api/v2/orgs/org2?summary=true') {
    body = {
      data: {
        clouds_count: 2,
        created: '2022-06-26T14:23:23.223000',
        default_monitoring_method: null,
        enable_r12ns: false,
        enterprise_plan: {},
        id: '4e042f570ed043be893d57f76093bee2',
        insights_enabled: false,
        last_active: '2022-07-07T14:19:57.729000',
        members: [
          {
            email: 'dimo@mist.io',
            first_name: '',
            id: '59925306a32f4279a241403d1d308157',
            last_active: '2022-07-07T14:19:57.721000',
            last_login: '2022-07-02T14:06:58.907965',
            last_name: '',
            registration_date: '',
            role: null,
            username: null,
          },
        ],
        members_count: 1,
        name: 'org1',
        ownership_enabled: true,
        resources: {
          buckets: {
            total: 0,
          },
          clouds: {
            total: 4,
          },
          clusters: {
            total: 1,
          },
          images: {
            total: 253,
          },
          keys: {
            total: 4,
          },
          machines: {
            total: 12,
          },
          networks: {
            total: 4,
          },
          rules: {
            total: 5,
          },
          schedules: {
            total: 0,
          },
          scripts: {
            total: 3,
          },
          secrets: {
            total: 3,
          },
          stacks: {
            total: 0,
          },
          teams: {
            total: 1,
          },
          templates: {
            total: 0,
          },
          volumes: {
            total: 0,
          },
          zones: {
            total: 0,
          },
        },
        selected_plan: null,
        teams: [
          {
            description: null,
            id: 'd25eb84cfeca4259be7985c27c3d514b',
            members: ['dimo@mist.io'],
            members_count: 1,
            name: 'Owners',
          },
        ],
        teams_count: 1,
        total_machine_count: 58,
      },
      meta: {
        kind: 'org',
        returned: 1,
        sort: '',
        start: 0,
        total: 1,
      },
    };
  } else if (request.url.startsWith('/api/v2/clouds')) {
    if (request.method === 'GET') {
      body = {
        data: [
          {
            config: {
              apikey: 'AKIAIWAIDC7SDBWRQ7GQ',
              region: 'ap-northeast-1',
            },
            created_by: 'dimo@mist.io',
            features: {
              compute: true,
              container: true,
              dns: false,
              object_storage_enabled: false,
              observations: true,
              polling: 1800,
            },
            id: 'b86588f8fe0f4d9e9192d7881c85c277',
            name: 'EC2',
            owned_by: 'dimo@mist.io',
            provider: 'ec2',
            tags: {},
          },
          {
            config: {
              apikey: 'LTAI4Ffyhc55auzWkhGcJPUK',
              region: 'eu-central-1',
            },
            created_by: 'spiros@mist.io',
            features: {
              compute: true,
              container: false,
              dns: false,
              object_storage_enabled: false,
              observations: true,
              polling: 1800,
            },
            id: 'cffb19e5d23b48398e126fb598eec054',
            name: 'Aliyun ECS  Frankfurt',
            owned_by: 'spiros@mist.io',
            provider: 'aliyun_ecs',
            tags: {},
          },
          {
            config: {
              project_id: '',
            },
            created_by: 'spiros@mist.io',
            features: {
              compute: true,
              container: false,
              dns: false,
              object_storage_enabled: false,
              observations: false,
              polling: 1800,
            },
            id: '0cad9f6d889d4b8b9078e8f376593818',
            name: 'Equinix Metal',
            owned_by: 'spiros@mist.io',
            provider: 'equinixmetal',
            tags: {},
          },
          {
            config: {
              email: '587999097471-compute@developer.gserviceaccount.com',
              project_id: 'mist-dev',
            },
            created_by: '',
            features: {
              compute: true,
              container: true,
              dns: true,
              object_storage_enabled: false,
              observations: true,
              polling: 600,
            },
            id: '359f5325870f4fa4bee7e8de4ef3e4da',
            name: 'GCE mist-dev',
            owned_by: '',
            provider: 'gce',
            tags: {},
          },
        ],
        meta: {
          kind: 'clouds',
          returned: 4,
          sort: null,
          start: 0,
          total: 4,
        },
      };
    }
  }
  response.end(JSON.stringify(body));
});

server.listen(9000);

// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  watch: !hmr,
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },
  // basePath: '/portal/',

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  appIndex: 'index.html',
  basePath: '/portal/',
  plugins: [
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
  ],

  middleware: [
    proxy('/api/', {
      target: 'http://localhost:9000/',
    }),
    function rewriteIndex(context, next) {
      // if (context.url.startsWith('/portal')) {
      //   context.url = 'index.html';
      // }

      return next();
    },
  ],
});
