import { html } from 'lit';
import { nameRenderer, tagsRenderer } from './renderers.js';

const renderers = () => ({
  name: nameRenderer,
  tags: tagsRenderer,
});

const actions = parent => [
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
    run: () => () => {
      parent.dispatchEvent(
        new CustomEvent('go', {
          detail: {
            value: `orgs/${parent.orgName}/clouds/+add`,
          },
          bubbles: true,
          composed: true,
        })
      );
    },
    condition: items => !items.length,
  },
];

const visibleColumns = ['provider', 'tags', 'owned_by', 'created_by'];

export { actions, renderers, visibleColumns };
