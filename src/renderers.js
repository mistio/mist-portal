/* eslint-disable lit/binding-positions */
import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

const nameRenderer = {
  body: row => html`<strong class="name">${row.name}</strong>`,
};

const tagsRenderer = {
  body: row =>
    html`${repeat(
      Object.keys(row.tags),
      key => key,
      key => html` <strong>${key}=${row.tags[key]}</strong>`
    )}`,
};

export { nameRenderer, tagsRenderer };
