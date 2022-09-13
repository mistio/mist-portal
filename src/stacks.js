import { nameRenderer, tagsRenderer } from './renderers.js';

const renderers = () => ({
  name: nameRenderer,
  tags: tagsRenderer,
});

const actions = () => [];

const visibleColumns = ['template', 'tags', 'owned_by', 'created_by'];

export { actions, renderers, visibleColumns };
