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
  openProject: createAction('OPEN_PROJECT'),
  progress: createAction('SHOW_PROGRESS'),
  finish: createAction('EDIT_IMAGE'),
  home: createAction('HOME'),

  // middleware
  startPy: createAction('START_PYTHON'),
  importCSV: createAction('IMPORT_CSV'),

  // sql
  startSql: createAction('START_SQL'),
  stopSql: createAction('STOP_SQL'),

  // thunk
  grabCols: createAction('GET_COLUMNS'),
  grabNamePattern: createAction('FIND_DATABASE'),

  // debug
  resetUserState: createAction('RESET_USER'),

  // change file format string
  changeFormat: createAction('CHANGE_FORMAT'),
};

const reducer = handleActions(
  {
    [userActions.resetUserState]: () => {
      return {};
    },
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
    [userActions.openProject]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [userActions.progress]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [userActions.finish]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [userActions.home]: (state, action) => {
      return { ...state, ...action.payload };
    },

    [userActions.startPy]: (state) => {
      return {
        ...state,
        pythonStatus: true,
      };
    },
    [userActions.importCSV]: (state) => {
      let app_path = remote.app.getAppPath();
      // If true, we are in a packaged environment
      if(app_path.split(path.sep).pop().includes("asar")) {
        app_path = path.join(app_path, "..");
      }
      const programpath = path.join(
        app_path,
        'python',
        'dist',
        'csv_to_sqlite',
        'csv_to_sqlite',
      );
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
      };
    },

    [userActions.startSql]: (state) => {
      console.log(remote.app.getPath('userData'));
      if (state.database) {
        state.database = false;
      }
      console.info('starting db...');

      const dbPath = path.join(state.projectPath, 'data.sqlite3');

      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) return console.error(err.message);
        console.info('Connected to the SQlite database');
      });

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

    [userActions.changeFormat]: (state, action) => {
      return {
        ...state,
        namePattern: action.payload,
      };
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
