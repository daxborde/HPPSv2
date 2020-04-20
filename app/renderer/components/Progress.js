import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, LinearProgress, Typography } from '@material-ui/core';
import Template from './Template';
import { withStyles } from '@material-ui/core/styles';
import sqlite3 from 'sqlite3';
import { spawn } from 'child_process';
import path from 'path';
import { remote } from 'electron';

const styles = (theme) => ({
  card: {
    width: '50vw',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(2),
  },
  progress: {
    marginTop: theme.spacing(4),
  },
});

class Progress extends Component {
  static propTypes = {
    onProgress: PropTypes.func.isRequired,
  };

  state = {
    username: '',
  };

  handleChange = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  handleProgress = () => {
    this.props.onProgress({
      loggedIn: true,
    });
  };

  componentDidMount() {
    // const db = new sqlite3.Database(this.props.dbPath, () => {
    //   db.all('PRAGMA table_info(CSVData);', (err, rows) => {
    //     const colnames = rows.map((x) => x.name);
    //     console.log('yaboi:' + colnames);
    //     this.props.grabCols({
    //       csvCols: colnames,
    //     });
    //   });

    const db = new sqlite3.Database(this.props.dbPath);
    const sql = `DROP TABLE IF EXISTS NamingPattern;
        CREATE TABLE NamingPattern(pattern TXT);
        INSERT INTO NamingPattern (pattern) VALUES ("${this.props.namePattern}");`;

    // create async sqlite3 operation
    db.query = function (sql) {
      const that = this;
      return new Promise((resolve, reject) => {
        that.exec(sql, (err) => {
          if (err !== null) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };

    // store naming pattern in the db
    (async () => {
      try {
        await db.query(sql);
      } catch (e) {
        return console.log(e);
      }
    })();

    // close db when done
    db.close();

    let app_path = remote.app.getAppPath();
    // If true, we are in a packaged environment
    if(app_path.split(path.sep).pop().includes("asar")) {
      app_path = path.join(app_path, "..");
    }
    const python_dist = path.join(app_path, 'python', 'dist');
    const exe_names = ['crop_images', 'ocr_predict_gpu', 'fuzzy_search'];
    const filepaths = exe_names.map((x) => {
      return path.join(python_dist, x, x);
    });
    console.log(`propboi=${this.props.projectPath}`);

    const crop_process = spawn(
      filepaths[0],
      [
        this.props.photosPath,
        this.props.projectPath,
        this.props.dbPath,
        '--padding',
        this.props.padSize,
      ],
      {
        cwd: path.join(filepaths[0], '..'),
        // stdio: ['ignore', process.stdout, process.stderr],
      },
    );
    crop_process.stdout.on('data', (data) => {
      console.log(`crop stdout: ${data}`);
    });
    crop_process.stderr.on('data', (data) => {
      console.warn(`crop err: ${data}`);
    });
    crop_process.on('close', (code) => {
      if (code !== 0) {
        console.error('Cropping portion failed.');
        return;
      }
      console.log('Success!!!!!');
      const ocr_process = spawn(filepaths[1], [this.props.projectPath, this.props.dbPath], {
        cwd: path.join(filepaths[1], '..'),
      });
      ocr_process.stdout.on('data', (data) => {
        console.log(`ocr stdout: ${data}`);
      });
      ocr_process.stderr.on('data', (data) => {
        console.warn(`ocr err: ${data}`);
      });
      ocr_process.on('close', (code) => {
        if (code !== 0) {
          console.error('OCR portion failed.');
          return;
        }
        console.log('Success2!!!!!');
        const fuzz_process = spawn(filepaths[2], [this.props.csvPath, this.props.dbPath], {
          cwd: path.join(filepaths[2], '..'),
        });
        fuzz_process.stdout.on('data', (data) => {
          console.log(`fuzz stdout: ${data}`);
        });
        fuzz_process.stderr.on('data', (data) => {
          console.warn(`fuzz err: ${data}`);
        });
        fuzz_process.on('close', (code) => {
          if (code !== 0) {
            console.error('Fuzzy Search portion failed.');
            return;
          }
          console.log('Success3!!!!!');
          this.handleProgress();
        });
      });
    });

    // const mycolnames = await database_actions;
    // console.log(mycolnames);
  }

  render() {
    const { classes } = this.props;

    return (
      <Template title='Progress'>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant='h5'>Please wait...</Typography>

            {/*<Button variant='outlined' onClick={this.handleProgress}>*/}
            {/*  DEBUG_NEXT*/}
            {/*</Button>*/}

            <LinearProgress className={classes.progress} />
          </CardContent>
        </Card>
      </Template>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Progress);
