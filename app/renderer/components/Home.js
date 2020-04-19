import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Fab, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Template from './Template';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import fs from 'fs';
import sqlite3 from 'sqlite3';

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
    namePattern: null,
  };

  getPattern = () => {};

  handleProjectPath = () => {
    const promise = dialog.showOpenDialog({
      title: 'Select Existing Project Folder',
      properties: ['openDirectory'],
    });

    promise.then((value) => {
      if (value.canceled) return;

      const path = value.filePaths[0];
      const dbPath = `${path}/data.sqlite3`;
      // console.log(`path - ${typeof path}: ${path}`);

      // check there a db file in folder
      if (!fs.existsSync(dbPath)) {
        // set flag to state to display alert
        return;
      }

      const db = new sqlite3.Database(dbPath);
      const sql = 'SELECT pattern from NamingPattern WHERE _rowid_ = 1';

      // create async sqlite3 operation
      db.query = function(sql) {
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

          this.props.onOpenProject({
            namePattern: pattern,
            projectPath: path,
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
