import { html } from 'lit';
import { store } from './redux/store.js';

const actions = [
  {
    name: () => `Edit`,
    theme: 'secondary',
    condition: items => items.length === 1,
    run: () => {},
  },
  {
    name: () => `Remove`,
    theme: 'secondary error',
    icon: html``,
    run: (items, list) => () => {
      let requests = 0;
      items.forEach(i => {
        requests += 1;
        fetch(`/api/v2/secrets/${i.id}`, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Org': store.getState().org.name,
          },
          method: 'DELETE',
        })
          .then(response => {
            requests -= 1;
            if (list && list.grid) {
              list.grid.deselectItem(i);
            }
            if (response.ok) {
              // eslint-disable-next-line no-console
              console.log('delete success', i);
            } else {
              // eslint-disable-next-line no-console
              console.error('delete failed', i);
            }
            if (!requests) {
              list.reload();
            }
            return response.json();
          })
          // eslint-disable-next-line no-console
          .then(data => console.log(data));
      });
    },
    condition: items => items.length,
  },
  {
    name: () => 'Create secret',
    theme: 'primary',
    icon: html``,
    // eslint-disable-next-line func-names
    run() {
      return function () {
        this.dispatchEvent(
          new CustomEvent('go', {
            detail: {
              value: `orgs/${this.orgName}/secrets/+create`,
            },
            bubbles: true,
            composed: true,
          })
        );
      };
    },
    condition: items => !items.length,
  },
];

export { actions };
