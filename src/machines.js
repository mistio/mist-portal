import { html } from 'lit';
import { nameRenderer, tagsRenderer } from './renderers.js';
import { tagAction, transferOwnershipAction, renameAction } from './actions.js';

const renderers = () => ({
  name: nameRenderer,
  tags: tagsRenderer,
});

const actions = parent => [
  {
    name: () => `Shell`,
    theme: 'secondary',
    condition: items => items.length === 1,
    run: () => {},
  },
  {
    name: () => `Attach`,
    theme: 'secondary',
    condition: items => items.length === 1,
    run: () => {},
  },
  {
    name: () => `Run script`,
    theme: 'secondary',
    condition: items => items.length === 1,
    run: () => {},
  },
  {
    name: () => `Console`,
    theme: 'secondary',
    condition: items => items.length === 1,
    run: () => {},
  },
  {
    component: 'hr',
    theme: 'tertiary',
    disabled: true,
    text: '',
    condition: items => items.length,
  },
  tagAction(parent),
  transferOwnershipAction(parent),
  {
    component: 'hr',
    theme: 'tertiary',
    disabled: true,
    text: '',
    condition: items => items.length,
  },
  {
    name: () => `Start`,
    theme: 'secondary',
    condition: items =>
      items.length > 0 && items.filter(x => x.state !== 'stopped').length === 0,
    run: () => {},
  },
  {
    name: () => `Stop`,
    theme: 'secondary',
    condition: items =>
      items.length > 0 && items.filter(x => x.state !== 'running').length === 0,
    run: () => {},
  },
  renameAction(parent),
  {
    name: () => `Destroy`,
    theme: 'secondary error',
    icon: html``,
    run: () => () => {},
    condition: items => items.length,
  },
  {
    name: () => `Undefine`,
    theme: 'secondary error',
    icon: html``,
    run: () => () => {},
    condition: items => items.length,
  },
  {
    name: () => 'Create machine',
    theme: 'primary',
    icon: html``,
    run: () => () =>
      parent.dispatchEvent(
        new CustomEvent('go', {
          detail: {
            value: `orgs/${parent.orgName}/machines/+create`,
          },
          bubbles: true,
          composed: true,
        })
      ),
    condition: items => !items.length,
  },
];

const visibleColumns = ['cloud', 'state', 'tags', 'owned_by', 'created_by'];

export { actions, renderers, visibleColumns };
