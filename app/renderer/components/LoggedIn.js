import React, { Component } from 'react';
import { PythonShell } from 'python-shell';
import PropTypes from 'prop-types';
const app = require('electron').remote.app
const path = require('path')
// import runMainPy from '../../python/pyrun';

export default class LoggedIn extends Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    database: PropTypes.any.isRequired,
    username: PropTypes.string,
  };

  handleLogout = () => {
    this.props.onLogout({
      username: '',
      loggedIn: false,
    });
  };

  // componentDidMount() {
  //   const runMainPy = () => {
  //     console.log("madeit!");
  //     // var python = require('child_process').spawn('python', ['./main.py']);
  //     // python.stdout.on('data',function(data){
  //     //     console.log("data: ",data.toString('utf8'));
  //     // });

  //     const mypath = path.join(app.getAppPath(), 'python/');

  //     console.warn("path:"+mypath);

  //     const options = {
  //       mode: 'text',
  //       scriptPath: mypath,
  //     };
  //     // path.join(app.getAppPath(), 'python/main.py')
  //     PythonShell.run('main.py', options, (err, results) => {
  //       if (err) throw err;
  //       console.log('main.py finished.');
  //       console.log('results', results);
  //     });
  //   };

  //   console.log("mount!");
  //   if (this.props.pythonStatus) {
  //     console.log("status!");
  //     // runMainPy();
  //     console.log("done!");
  //   }
  // }

  render() {
    return (
      <div>
        <h2>Logged in as {this.props.username}</h2>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}
