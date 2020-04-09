import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import Edit from '../components/Edit';
import { userActions } from '../reducers/user';

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  const user = bindActionCreators(userActions, dispatch);
  return {
    onEdit: (data) => {
      user.edit(data);
      dispatch(push('/'));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Edit);
