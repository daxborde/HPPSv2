import { handleActions } from 'redux-actions';
import { createAction } from 'redux-actions';
// import actions from '../actions/user';

const userActions = {
  login: createAction('USER_LOGIN'),
  logout: createAction('USER_LOGOUT'),
  startPy: createAction('START_PYTHON'),
  importCSV: createAction('IMPORT_CSV'),
};

const reducer = handleActions(
  {
    [userActions.login]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [userActions.logout]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [userActions.startPy]: (state) => {
      return {
        ...state,
        pythonStatus: true,
      };
    },
  },
  {
    pythonStatus: false,
    loggedIn: false,
  },
);

export { reducer, userActions };
