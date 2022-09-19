/* eslint-disable lit-a11y/tabindex-no-positive */
/* eslint-disable no-param-reassign */
import { html, render } from 'lit';
import { nameRenderer, tagsRenderer } from './renderers.js';
import { tagAction, transferOwnershipAction, renameAction } from './actions.js';

const renderers = () => ({
  name: nameRenderer,
  tags: tagsRenderer,
});

const actions = parent => [
  tagAction(parent),
  transferOwnershipAction(parent),
  {
    component: 'hr',
    theme: 'tertiary',
    disabled: true,
    text: '',
    condition: items => items.length,
  },
  renameAction(parent),
  {
    name: () => `Edit credentials`,
    theme: 'secondary',
    condition: items => items.length === 1,
    run: () => () => {
      const items = parent.list ? parent.list.selectedItems : [parent.resource];
      parent.dispatchEvent(
        new CustomEvent('go', {
          detail: {
            value: `orgs/${parent.orgName}/clouds/${items[0].id}/+edit`,
          },
          bubbles: true,
          composed: true,
        })
      );
    },
  },
  {
    name: () => `Remove`,
    theme: 'secondary error',
    icon: html``,
    run: () => () => {
      import('@vaadin/confirm-dialog').then(() => {
        const items = parent.list
          ? parent.list.selectedItems
          : [parent.resource];
        const dialog = html` <vaadin-confirm-dialog
          id="confirm"
          header="Remove ${items.length} cloud${items.length > 1 ? 's' : ''}?"
          confirm-text="Yes"
          confirm-theme="error primary"
          cancel-text="No"
          cancel
          @confirm="${() => {
            items.forEach(async item => {
              const response = await fetch(
                `/api/v2/${parent.section}/${item.id}`,
                {
                  headers: {
                    'X-Org': parent.orgName,
                  },
                  method: 'DELETE',
                }
              );
              if (response.status > 299) {
                import('@vaadin/notification').then(module => {
                  const notification = module.Notification.show(
                    `Failed to delete '${item.name}: ${response.statusText}'`,
                    {
                      position: 'bottom-stretch',
                    }
                  );
                  notification.setAttribute('theme', 'error');
                });
              } else {
                import('@vaadin/notification').then(module => {
                  const notification = module.Notification.show(
                    `Deleted '${item.name}: ${response.statusText}'`,
                    {
                      position: 'bottom-stretch',
                    }
                  );
                  notification.setAttribute('theme', 'success');
                });
              }
            });
            parent.requestUpdate();
            parent.dispatchEvent(
              new CustomEvent('go', {
                detail: {
                  value: `orgs/${parent.orgName}/clouds`,
                },
                bubbles: true,
                composed: true,
              })
            );
          }}"
          @cancel="${() => {}}"
          opened
        >
          <p>Removing a cloud can not be undone.</p>
          <ol>
            ${items.map(item => html`<li>${item.name}</li>`)}
          </ol>
          <p>
            Removing clouds will not affect your resources, but you will no
            longer be able to manage them with Mist.
          </p>
        </vaadin-confirm-dialog>`;
        render(dialog, parent);
        parent.querySelector('vaadin-confirm-dialog#confirm').opened = true;
      });
    },
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

const board = {
  panels: [
    {
      type: 'text',
      title: 'Tags',
      content: tagsRenderer,
    },
  ],
};

export { actions, renderers, visibleColumns, board };
