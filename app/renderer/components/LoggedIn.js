import React, { Component } from 'react';
import PropTypes from 'prop-types';
import runMainPy from '../../python/pyrun';

export default class LoggedIn extends Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    pythonStatus: PropTypes.bool.isRequired,
    username: PropTypes.string,
  };

  handleLogout = () => {
    this.props.onLogout({
      username: '',
      loggedIn: false,
    });
  };

  componentDidMount() {
    console.log("mount!");
    if (this.props.pythonStatus) {
      console.log("status!");
      runMainPy();
      console.log("done!");
    }
  }

  render() {
    return (
      <div>
        <h2>Logged in as {this.props.username}</h2>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}
