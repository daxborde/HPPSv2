import { createAction, handleActions } from 'redux-actions';
import { remote } from "electron";
import path from "path";
import { spawn } from "child_process";
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
    [userActions.importCSV]: (state) => {
      const programpath = path.join(remote.app.getAppPath(), 'extra-resources', 'csv_to_sqlite', 'csv_to_sqlite.exe');
      console.log("ap = "+programpath)
      const csvPath = state.csvPath;
      const dbPath = state.database.filename;
      console.log("csvPath = "+csvPath)
      console.log("dbPath = "+dbPath)

      spawn(programpath, [csvPath, dbPath])

      return {
        ...state,
        CSVStatus: true,
      };
    },
  },
  {
    pythonStatus: false,
    loggedIn: false,
    CSVStatus: false,
  },
);

export { reducer, userActions };
