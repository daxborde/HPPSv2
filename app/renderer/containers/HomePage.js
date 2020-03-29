import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import Home from '../components/Home';
import { userActions } from '../reducers/user';

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
    debugButton: () => {
      user.startSql();
      user.importCSV();
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
