import { html } from 'lit';
import { nameRenderer, tagsRenderer } from './renderers.js';

const renderers = () => ({
  name: nameRenderer,
  tags: tagsRenderer,
});

const actions = parent => [
  {
    name: () => `Remove`,
    theme: 'secondary error',
    icon: html``,
    run: () => () => {},
    condition: items => items.length,
  },
  {
    name: () => 'Add script',
    theme: 'primary',
    icon: html``,
    run: () => () =>
      parent.dispatchEvent(
        new CustomEvent('go', {
          detail: {
            value: `orgs/${parent.orgName}/scripts/+add`,
          },
          bubbles: true,
          composed: true,
        })
      ),
    condition: items => !items.length,
  },
];

const visibleColumns = ['tags', 'owned_by', 'created_by'];

const hierarchical = false;

export { actions, renderers, visibleColumns, hierarchical };
