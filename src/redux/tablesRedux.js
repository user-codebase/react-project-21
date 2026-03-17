import { API_URL } from '../config';

// selectors
export const getAllTables = state => state.tables;

// actions
const createActionName = actionName => `app/tables/${actionName}`;

const FETCH_TABLES_SUCCESS = createActionName('FETCH_TABLES_SUCCESS');

// action creators
export const fetchTablesSuccess = payload => ({
  type: FETCH_TABLES_SUCCESS,
  payload,
});

// thunk
export const fetchTables = () => {
  return async dispatch => {
    try {
      const res = await fetch(`${API_URL}/tables`);
      const data = await res.json();
      dispatch(fetchTablesSuccess(data));
    } catch (err) {
      console.error('Błąd pobierania stolików', err);
    }
  };
};

// reducer
const tablesReducer = (statePart = [], action) => {
  switch (action.type) {
    case FETCH_TABLES_SUCCESS:
      return [...action.payload];
    default:
      return statePart;
  }
};

export default tablesReducer;