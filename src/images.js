import { nameRenderer, tagsRenderer } from './renderers.js';

const renderers = () => ({
  name: nameRenderer,
  tags: tagsRenderer,
});

const actions = () => [
  {
    name: () => `Create machine from Image`,
    theme: 'secondary',
    condition: items => items.length === 1,
    run: () => {},
  },
];

const visibleColumns = ['cloud', 'tags', 'owned_by', 'created_by'];

export { actions, renderers, visibleColumns };
