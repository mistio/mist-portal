import { createSlice } from '@reduxjs/toolkit';

const orgSlice = createSlice({
  name: 'org',
  initialState: {},
  reducers: {
    itemUpdated(state, action) {
      const target = `${action.payload.meta.kind}s`;
      if (!(target in state)) {
        // eslint-disable-next-line no-param-reassign
        state[target] = {};
      }
      if (!('data' in state[target])) {
        // eslint-disable-next-line no-param-reassign
        state[target].data = { arr: [], obj: {} };
      }
      // eslint-disable-next-line no-param-reassign
      state[target].data.obj[action.payload.data.id] = JSON.parse(
        JSON.stringify(action.payload.data)
      );
      return state;
    },
    sectionUpdated(state, action) {
      // Init new state with old state values
      const ret = {
        ...state,
      };
      const target = `${action.payload.meta.kind}`;
      // Convert result list to map by ID
      const oldMap =
        (state[target] && state[target].data && state[target].data.obj) || {};
      const newMap = {};
      action.payload.data.forEach(x => {
        newMap[x.id] = x;
      });

      // Update section with new results
      ret[target] = {
        data: {
          // Keep the items as a list. Only include current response
          arr: action.payload.data,
          // Update map of items, Include old and new.
          obj: { ...oldMap, ...newMap },
        },
        meta: {
          total: action.payload.meta.total,
        },
      };
      // Count all locally saved items in the returned count
      ret[target].meta.returned = Object.keys(ret[target].data.obj).length;

      return ret;
    },

    orgSelected(state, action) {
      return {
        name: action.payload,
      };
    },

    orgUpdated(state, action) {
      const org = action.payload.data;
      if (org === undefined) {
        return {};
      }
      const newState = {
        id: org.id,
        name: org.name,
      };
      if (org.billing) {
        newState.billing = action.payload.billing;
      }
      if (org.resources) {
        Object.keys(org.resources).forEach(section => {
          if (newState[section] === undefined) {
            newState[section] = { meta: {} };
          }
          if (org.resources[section]) {
            newState[section].meta.total = org.resources[section].total || 0;
          }
        });
      }
      return newState;
    },
  },
});

export const { orgSelected, orgUpdated, sectionUpdated, itemUpdated } =
  orgSlice.actions;
export default orgSlice.reducer;
