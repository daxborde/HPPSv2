import { handleActions } from 'redux-actions';
import { createAction } from 'redux-actions';
import sqlite3 from 'sqlite3';
import path from 'path';
import { remote } from 'electron'

const userActions = {
  login: createAction('USER_LOGIN'),
  logout: createAction('USER_LOGOUT'),
  startPy: createAction('START_PYTHON'),
  startSql: createAction('START_SQL'),
  importCSV: createAction('IMPORT_CSV'),
  stopSql: createAction('STOP_SQL'),
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
    [userActions.startSql]: (state) => {
      console.warn("@"+remote.app.getPath('userData'));
      if (!state.database) {
        console.info("blarg");
        const db = new sqlite3.Database(path.join(remote.app.getPath('userData'), 'db.sqlite3'));
        // console.warn(path.join(remote.app.getPath('userData'), 'db.sqlite3'));
        return {
          ...state,
          database: db,
        };
      }
      return state;
    },
    [userActions.stopSql]: (state) => {
      console.info("ligma");
      if (state.database) {
        console.info("uwu");
        // state.database.close();
        return {
          ...state,
          database: false,
        };
      }
      return state;
    },
  },
  {
    database: false,
    pythonStatus: false,
    loggedIn: false,
  },
);

export { reducer, userActions };
