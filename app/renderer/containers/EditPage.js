import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import EditWrap from '../components/EditWrap';
import { userActions } from '../reducers/user';

const mapStateToProps = (state) => {
  return {
    ...state,
    csvCols: state.user.csvCols,
    dbPath: state.user.database.filename,
    namePattern: state.user.namePattern,
  };
};

const mapDispatchToProps = (dispatch) => {
  const user = bindActionCreators(userActions, dispatch);
  return {
    onFinish: () => {
      dispatch(push('/finish'));
    },
    changeFormat: (data) => {
      user.changeFormat(data);
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditWrap);
