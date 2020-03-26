import { createAction, handleActions } from 'redux-actions';
// import actions from '../actions/user';

const userActions = {
  login: createAction('USER_LOGIN'),
  logout: createAction('USER_LOGOUT'),
  startPy: createAction('START_PYTHON'),
  importCSV: createAction('IMPORT_CSV'),
  selectProject: createAction('SELECT_PROJECT'),
  createProject: createAction('CREATE_PROJECT'),
};

const reducer = handleActions(
  {
    [userActions.createProject]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [userActions.selectProject]: (state, action) => {
      return { ...state, ...action.payload };
    },
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
