import { createAction } from 'redux-actions';

export default {
  login: createAction('USER_LOGIN'),
  logout: createAction('USER_LOGOUT'),
  startPy: createAction('START_PYTHON'),
  selectProject: createAction('SELECT_PROJECT'),
  createProject: createAction('CREATE_PROJECT'),
};
