import { html } from 'lit';
import { nameRenderer, tagsRenderer } from './renderers.js';

const renderers = () => ({
  name: nameRenderer,
  tags: tagsRenderer,
});

const actions = parent => [
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
    name: () => 'Create network',
    theme: 'primary',
    icon: html``,
    run: () => () =>
      parent.dispatchEvent(
        new CustomEvent('go', {
          detail: {
            value: `orgs/${parent.orgName}/networks/+create`,
          },
          bubbles: true,
          composed: true,
        })
      ),
    condition: items => !items.length,
  },
];

const visibleColumns = ['cloud', 'tags', 'owned_by', 'created_by'];

export { actions, renderers, visibleColumns };
