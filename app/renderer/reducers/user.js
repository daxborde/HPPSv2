import { createAction, handleActions } from 'redux-actions';
import sqlite3 from 'sqlite3';
import path from 'path';
import { remote } from 'electron';
import { spawn } from 'child_process';
// import ReduxThunk from 'redux-thunk';


const userActions = {
  login: createAction('USER_LOGIN'),
  logout: createAction('USER_LOGOUT'),

  // pages
  selectProject: createAction('SELECT_PROJECT'),
  createProject: createAction('CREATE_PROJECT'),
  progress: createAction('SHOW_PROGRESS'),
  edit: createAction('EDIT_IMAGE'),

  // middleware
  startPy: createAction('START_PYTHON'),
  importCSV: createAction('IMPORT_CSV'),

  // sql
  startSql: createAction('START_SQL'),
  stopSql: createAction('STOP_SQL'),

  // thunk
  grabCols: createAction('GET_COLUMNS'),

  // debug
  resetYaboi: createAction('RESET_YABOI'),
};

const reducer = handleActions(
  {
    [userActions.resetYaboi]: () => { return {}; },
    [userActions.login]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [userActions.logout]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [userActions.selectProject]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [userActions.createProject]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [userActions.progress]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [userActions.edit]: (state, action) => {
      return { ...state, ...action.payload };
    },

    [userActions.startPy]: (state) => {
      return {
        ...state,
        pythonStatus: true,
      };
    },
    [userActions.importCSV]: (state) => {
      const programpath = path.join(remote.app.getAppPath(), 'python', 'dist', 'csv_to_sqlite', 'csv_to_sqlite');
      console.log('ap = ' + programpath);
      const csvPath = state.csvPath;
      const dbPath = state.database.filename;
      console.log('csvPath = ' + csvPath);
      console.log('dbPath = ' + dbPath);

      spawn(programpath, [csvPath, dbPath]);

      return {
        ...state,
        CSVStatus: true,
      };
    },

    [userActions.grabCols]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },

    [userActions.startSql]: (state) => {
      console.log(remote.app.getPath('userData'));
      if (state.database) {
        state.database = false;
      }
      console.info('starting db...');

      const db = new sqlite3.Database(
        path.join(state.projectPath, state.projectName+".sqlite3"),
        (err) => {
          if (err) return console.error(err.message);
          console.info('Connected to the SQlite database');
        },
      );

      return {
        ...state,
        database: db,
      };
    },
    [userActions.stopSql]: (state) => {
      if (state.database) {
        console.info('stopping db...');
        state.database.close();
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
    CSVStatus: false,
  },
);

export { reducer, userActions };
