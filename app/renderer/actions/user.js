import { createAction } from 'redux-actions';

export default {
  login: createAction('USER_LOGIN'),
  logout: createAction('USER_LOGOUT'),
  startSql: createAction('START_SQL'),
  stopSql: createAction('STOP_SQL'),
};
