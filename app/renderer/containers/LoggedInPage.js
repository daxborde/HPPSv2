import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import LoggedIn from '../components/LoggedIn';
import { userActions } from '../reducers/user';

const mapStateToProps = (state) => {
  return { pythonStatus: state.user.pythonStatus };
};

const mapDispatchToProps = (dispatch) => {
  const user = bindActionCreators(userActions, dispatch);
  return {
    onLogout: (data) => {
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
