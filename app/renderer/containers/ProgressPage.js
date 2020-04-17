import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import Progress from '../components/Progress';
import { userActions } from '../reducers/user';

const mapStateToProps = (state) => {
  return {
    // ...state
    dbPath: state.user.database.filename,
    photosPath: state.user.photosPath,
    projectPath: state.user.projectPath,
    namePattern: state.user.namePattern,
  };
};

const mapDispatchToProps = (dispatch) => {
  const user = bindActionCreators(userActions, dispatch);
  return {
    grabCols: (cols) => {
      user.grabCols(cols);
    },
    onProgress: (data) => {
      user.progress(data);
      // user.stopSql();
      dispatch(push('/edit'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Progress);
