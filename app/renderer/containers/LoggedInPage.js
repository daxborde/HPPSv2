import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import LoggedIn from '../components/LoggedIn';
import { userActions } from '../reducers/user';

const mapStateToProps = (state) => {
  return {
    pythonStatus: state.user.pythonStatus,
    username: state.user.username,
    database: state.user.database
  };
};

const mapDispatchToProps = (dispatch) => {
  const user = bindActionCreators(userActions, dispatch);
  return {
    onLogout: (data) => {
      user.stopSql();
      user.logout(data);
      dispatch(push('/'));
    },
    startPy: user.startPy,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoggedIn);
