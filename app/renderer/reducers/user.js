import { handleActions } from 'redux-actions';
import actions from '../actions/user';
import sqlite3 from 'sqlite3';
import path from 'path';
import { remote } from 'electron'

export default handleActions(
  {
    [actions.login]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [actions.logout]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [actions.startSql]: (state) => {
      console.warn("@"+remote.app.getPath('userData'));
      if (!state.database) {
        console.info("blarg");
        let db = new sqlite3.Database(path.join(remote.app.getPath('userData'), 'db.sqlite3'));
        return {
          ...state,
          database: db,
        };
      }
      return state;
    },
    [actions.stopSql]: (state) => {
      console.info("ligma");
      if (state.database) {
        console.info("uwu");
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
    loggedIn: false,
  },
);
