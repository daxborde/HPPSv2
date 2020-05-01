import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Fab, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Template from './Template';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const { dialog } = require('electron').remote;

const styles = (theme) => ({
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  button: {
    height: 50,
    minWidth: '200px',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
});

class Home extends Component {
  static propTypes = {
    onSelectProject: PropTypes.func.isRequired,
  };

  state = {
    error: false,
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      error: false,
    });
  };

  handleProjectPath = () => {
    const promise = dialog.showOpenDialog({
      title: 'Select Existing Project Folder',
      properties: ['openDirectory'],
    });

    promise.then((value) => {
      if (value.canceled) return;

      const projectPath = value.filePaths[0];
      const dbPath = `${projectPath}/data.sqlite3`;
      // console.log(`projectPath - ${typeof projectPath}: ${projectPath}`);

      // check there a db file in folder
      if (!fs.existsSync(dbPath)) {
        // set flag to state to display alert
        this.setState({
          error: true,
        });

        return;
      }

      const db = new sqlite3.Database(dbPath);
      const sql = 'SELECT pattern from NamingPattern WHERE _rowid_ = 1';

      // create async sqlite3 operation
      db.query = function (sql) {
        const that = this;
        return new Promise((resolve, reject) => {
          that.all(sql, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      };

      // get naming pattern from the db
      (async () => {
        try {
          const result = await db.query(sql);
          const pattern = result[0]['pattern'];

          db.close();
          this.props.onOpenProject({
            namePattern: pattern,
            projectPath: projectPath,
          });
        } catch (e) {
          return console.log(e);
        }
      })();
    });
  };

  handleProject = () => {
    this.props.onSelectProject({
      createNew: true,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Template title='Start Menu'>
        {/* error notification */}
        <Snackbar
          open={this.state.error}
          autoHideDuration={6000}
          key='top, right'
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}>
          <MuiAlert elevation={6} variant='filled' onClose={this.handleClose} severity='error'>
            This is not a project folder!
          </MuiAlert>
        </Snackbar>

        {/* Buttons */}
        <Container className={classes.content} maxWidth='md'>
          <Grid container direction='column' alignItems='center' justify='center' spacing={4}>
            {/* Project Name */}
            <Grid item>
              <Fab
                className={classes.button}
                variant='extended'
                color='primary'
                onClick={this.handleProject}>
                <FiberNewIcon className={classes.extendedIcon} />
                Create Project
              </Fab>
            </Grid>

            {/* Open Project */}
            <Grid item>
              <Fab
                className={classes.button}
                variant='extended'
                color='default'
                onClick={this.handleProjectPath}>
                <FolderOpenIcon className={classes.extendedIcon} />
                Open Project
              </Fab>
            </Grid>
          </Grid>
        </Container>
      </Template>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Home);
