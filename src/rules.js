import { html } from 'lit';
import { nameRenderer, tagsRenderer } from './renderers.js';

const renderers = () => ({
  name: nameRenderer,
  tags: tagsRenderer,
});

const actions = () => [
  {
    name: () => `Remove`,
    theme: 'secondary error',
    icon: html``,
    run: () => () => {},
    condition: items => items.length,
  },
  {
    name: () => `Edit`,
    theme: 'secondary error',
    icon: html``,
    run: () => () => {},
    condition: items => items.length,
  },
  {
    name: () => 'Add rule',
    theme: 'primary',
    icon: html``,
    run: () => parent =>
      parent.dispatchEvent(
        new CustomEvent('go', {
          detail: {
            value: `orgs/${parent.orgName}/rules/+add`,
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
