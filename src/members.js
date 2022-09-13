import { html } from 'lit';
import { nameRenderer } from './renderers.js';

const renderers = () => ({
  name: nameRenderer,
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
    name: () => 'Invite member',
    theme: 'primary',
    icon: html``,
    run: () => () =>
      parent.dispatchEvent(
        new CustomEvent('go', {
          detail: {
            value: `orgs/${parent.orgName}/members/+invite`,
          },
          bubbles: true,
          composed: true,
        })
      ),
    condition: items => !items.length,
  },
];

const visibleColumns = ['teams'];

const hierarchical = false;

export { actions, renderers, visibleColumns, hierarchical };
