import { sectionUpdated } from './slices/org.js';
import { store } from './store.js';

/* eslint-disable consistent-return */
export default async function reduxDataProvider(opts, callback) {
  const state = store.getState();
  const start = opts.page * opts.pageSize;
  const name = this.name || this.getAttribute('name');
  const baseurl = `/api/v2/${name}`;
  let url = `${baseurl}?start=${start}&limit=${opts.pageSize}`;
  const parentName = opts.parentItem ? opts.parentItem.name : null;
  if (parentName) {
    url = `${url}&search=${encodeURIComponent(
      `name=r"^${parentName}[^/]+/{0,1}$"`
    )}`;
  } else if (this.treeView) {
    url = `${url}&search=${encodeURIComponent('name=r"^[^/]*/{0,1}$"')}`;
  } else if (this.combinedFilter) {
    url = `${url}&search=${this.combinedFilter}`;
  } else {
    url = `${url}&search=${encodeURIComponent('name=r"[^/]$"')}`;
  }
  this.loading = true;
  fetch(url, {
    headers: {
      'X-Org': state.org.id || state.org.name,
    },
  })
    .then(response => response.json())
    .then(body => {
      const resources = body.data;
      const retval = [];
      if (!this.treeView) {
        store.dispatch(sectionUpdated(body));
      }
      resources.forEach(r => {
        Object.keys(r).forEach(k => {
          if (this.frozenColumns && this.frozenColumns.indexOf(k) === -1)
            this.allColumns.add(k);
        });
        retval.push({ hasChildren: r.name.endsWith('/'), ...r });
      });
      if (!this.visibleColumns || !this.visibleColumns.length) {
        this.visibleColumns = Array.from(this.allColumns);
      }
      callback(retval, body.meta.total);
      this.loading = false;
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
      this.loading = false;
    });
}
