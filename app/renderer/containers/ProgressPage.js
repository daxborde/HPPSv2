import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import Progress from '../components/Progress';
import { userActions } from '../reducers/user';

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  const user = bindActionCreators(userActions, dispatch);
  return {
    onProgress: (data) => {
      user.progress(data);
      // user.stopSql();
      dispatch(push('/'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Progress);
