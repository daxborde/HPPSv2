import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import NewProject from '../components/CreateProject';
import { userActions } from '../reducers/user';

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  const user = bindActionCreators(userActions, dispatch);
  return {
    onCreateProject: (data) => {
      user.createProject(data);
      // user.startSql();
      // user.importCSV();
      dispatch(push('/progress'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewProject);
