import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import Home from '../components/Home';
import userActions from '../actions/user';

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  const user = bindActionCreators(userActions, dispatch);
  return {
    onSelectProject: (data) => {
      user.selectProject(data);
      dispatch(push('/new-project'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
