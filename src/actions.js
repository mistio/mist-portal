/* eslint-disable lit-a11y/tabindex-no-positive */
import { html, render } from 'lit';
import { dialogFooterRenderer, dialogRenderer } from '@vaadin/dialog/lit.js';

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const tagAction = parent => ({
  name: () => `Tag`,
  theme: 'secondary',
  condition: items => items.length,
  run: () => () => {
    import('@mistio/mist-form/mist-form.js');
    import('@vaadin/dialog').then(() => {
      const items = parent.list ? parent.list.selectedItems : [parent.resource];
      let newName = items[0].name;
      const dialog = html` <vaadin-dialog
        id="tag"
        aria-label="Edit tags"
        header-title="Edit tags"
        ${dialogRenderer(
          () => html`
            <vaadin-vertical-layout
              theme="spacing"
              style="width: 300px; max-width: 100%; align-items: stretch;"
            >
              <vaadin-vertical-layout style="align-items: stretch;">
                <mist-form
                  method="post"
                  action="/api/v2/tags"
                  .jsonSchema=${{
                    type: 'object',
                    properties: {
                      tags: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            key: {
                              name: 'key',
                              type: 'string',
                            },
                            value: {
                              name: 'value',
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                </mist-form>
              </vaadin-vertical-layout>
            </vaadin-vertical-layout>
          `,
          []
        )}
        ${dialogFooterRenderer(
          () =>
            html`
              <vaadin-button
                @click=${() => {
                  // eslint-disable-next-line no-param-reassign
                  parent.querySelector('vaadin-dialog#tag').opened = false;
                  newName = items[0].name;
                }}
                >Cancel</vaadin-button
              >
              <vaadin-button
                type="submit"
                theme="primary"
                ?disabled=${newName === items[0].name}
                @click=${async () => {
                  const response = await fetch(`/api/v2/tags`, {
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Org': parent.orgName,
                    },
                    method: 'POST',
                    body: JSON.stringify({}),
                  });
                  if (response.status > 299) {
                    import('@vaadin/notification').then(module => {
                      const notification = module.Notification.show(
                        `Failed to rename '${items[0].name}: ${response.statusText}'`,
                        {
                          position: 'bottom-stretch',
                        }
                      );
                      notification.setAttribute('theme', 'error');
                    });
                  } else {
                    import('@vaadin/notification').then(module => {
                      const notification = module.Notification.show(
                        `Renamed '${items[0].name}' to '${newName}`,
                        {
                          position: 'bottom-stretch',
                        }
                      );
                      notification.setAttribute('theme', 'success');
                      // eslint-disable-next-line no-param-reassign
                      parent.querySelector(
                        'vaadin-dialog#rename'
                      ).opened = false;
                      newName = items[0].name;
                      if (parent.list) {
                        parent.list.reload();
                      } else {
                        parent.reload();
                      }
                    });
                  }
                }}
                >Save</vaadin-button
              >
            `,
          []
        )}
        opened
      >
      </vaadin-dialog>`;
      render(dialog, parent);
      // eslint-disable-next-line no-param-reassign
      parent.querySelector('vaadin-dialog#tag').opened = true;
      const existingDialog = parent.querySelector('vaadin-dialog');
      if (existingDialog) {
        existingDialog.requestContentUpdate();
      }
    });
  },
});

const transferOwnershipAction = () => ({
  name: () => `Transfer ownership`,
  theme: 'secondary',
  condition: items => items.length,
  run: () => () => {},
});

const renameAction = parent => ({
  name: () => `Rename`,
  theme: 'secondary',
  condition: items => items.length === 1,
  run: () => () => {
    import('@vaadin/dialog').then(() => {
      const items = parent.list ? parent.list.selectedItems : [parent.resource];
      let newName = items[0].name;
      const dialog = html` <vaadin-dialog
        id="rename"
        aria-label="Rename cloud"
        header-title="Rename cloud"
        ${dialogRenderer(
          () => html`
            <vaadin-vertical-layout
              theme="spacing"
              style="width: 300px; max-width: 100%; align-items: stretch;"
            >
              <vaadin-vertical-layout style="align-items: stretch;">
                <vaadin-text-field
                  autoselect
                  tabindex="1"
                  label="Name"
                  value="${newName}"
                  @keydown=${e => {
                    if (e.code === 'Enter') {
                      document.body
                        .querySelector(
                          'vaadin-dialog-overlay vaadin-button[theme=primary]'
                        )
                        .click();
                    }
                  }}
                  @value-changed=${e => {
                    newName = e.detail.value;
                    debounce(() => {
                      parent
                        .querySelector('vaadin-dialog')
                        .requestContentUpdate();
                    })();
                  }}
                ></vaadin-text-field>
              </vaadin-vertical-layout>
            </vaadin-vertical-layout>
          `,
          []
        )}
        ${dialogFooterRenderer(
          () =>
            html`
              <vaadin-button
                @click=${() => {
                  // eslint-disable-next-line no-param-reassign
                  parent.querySelector('vaadin-dialog#rename').opened = false;
                  newName = items[0].name;
                }}
                >Cancel</vaadin-button
              >
              <vaadin-button
                type="submit"
                theme="primary"
                ?disabled=${newName === items[0].name}
                @click=${async () => {
                  const response = await fetch(
                    `/api/v2/${parent.section}/${items[0].id}`,
                    {
                      headers: {
                        'Content-Type': 'application/json',
                        'X-Org': parent.orgName,
                      },
                      method: 'PUT',
                      body: JSON.stringify({ name: newName }),
                    }
                  );
                  if (response.status > 299) {
                    import('@vaadin/notification').then(module => {
                      const notification = module.Notification.show(
                        `Failed to rename '${items[0].name}: ${response.statusText}'`,
                        {
                          position: 'bottom-stretch',
                        }
                      );
                      notification.setAttribute('theme', 'error');
                    });
                  } else {
                    import('@vaadin/notification').then(module => {
                      const notification = module.Notification.show(
                        `Renamed '${items[0].name}' to '${newName}`,
                        {
                          position: 'bottom-stretch',
                        }
                      );
                      notification.setAttribute('theme', 'success');
                      // eslint-disable-next-line no-param-reassign
                      parent.querySelector(
                        'vaadin-dialog#rename'
                      ).opened = false;
                      newName = items[0].name;
                      if (parent.list) {
                        parent.list.reload();
                      } else {
                        parent.reload();
                      }
                    });
                  }
                }}
                >Save</vaadin-button
              >
            `,
          []
        )}
        opened
      >
      </vaadin-dialog>`;
      render(dialog, parent);
      // eslint-disable-next-line no-param-reassign
      parent.querySelector('vaadin-dialog#rename').opened = true;
      const existingDialog = parent.querySelector('vaadin-dialog');
      if (existingDialog) {
        existingDialog.requestContentUpdate();
      }
    });
  },
});

export { tagAction, transferOwnershipAction, renameAction };
