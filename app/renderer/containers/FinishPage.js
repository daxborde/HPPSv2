import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Finish from '../components/Finish';

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onHome: () => {
      dispatch(push('/'));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Finish);
