import { handleActions } from 'redux-actions';
import actions from '../actions/user';

export default handleActions(
  {
    [actions.createProject]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [actions.selectProject]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [actions.login]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [actions.logout]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [actions.startPy]: (state) => {
      return {
        ...state,
        pythonStatus: true,
      };
    },
  },
  {
    pythonStatus: false,
    loggedIn: false,
    createNewProject: false,
  },
);
