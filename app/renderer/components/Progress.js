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
    // open db
    const db = new sqlite3.Database(this.props.dbPath);

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
        const sql = `DROP TABLE IF EXISTS NamingPattern;
        CREATE TABLE NamingPattern(pattern TXT);
        INSERT INTO NamingPattern (pattern) VALUES ("${this.props.namePattern}");`;

        await db.query(sql);
        db.close();
      } catch (e) {
        return console.log(e);
      }
    })();

    let app_path = remote.app.getAppPath();

    // If true, we are in a packaged environment
    if (app_path.split(path.sep).pop().includes('asar')) {
      app_path = path.join(app_path, '..');
    }

    const python_dist = path.join(app_path, 'python', 'dist');
    const exe_names = ['crop_images', 'ocr_predict_gpu', 'fuzzy_search'];
    const filepaths = exe_names.map((x) => {
      return path.join(python_dist, x, x);
    });
    console.log(`propboi=${this.props.projectPath}`);

    const run_crop = () => {
      return new Promise((resolve, reject) => {
        // spawn new process for cropping
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

        // print stdout stream
        crop_process.stdout.on('data', (data) => {
          console.log(`crop stdout: ${data}`);
        });

        // print stderr stream
        crop_process.stderr.on('data', (data) => {
          console.warn(`crop err: ${data}`);
        });

        // handle exit
        crop_process.on('close', (code) => {
          if (code === 0) {
            resolve('Cropping Finished Successfully');
          } else {
            reject('Cropping Failed!');
          }
        });
      });
    };

    const run_ocr = () => {
      return new Promise((resolve, reject) => {
        // spawn new process for OCR
        const ocr_process = spawn(filepaths[1], [this.props.projectPath, this.props.dbPath], {
          cwd: path.join(filepaths[1], '..'),
        });

        // print stdout stream
        ocr_process.stdout.on('data', (data) => {
          console.log(`ocr stdout: ${data}`);
        });

        // print stderr stream
        ocr_process.stderr.on('data', (data) => {
          console.warn(`ocr err: ${data}`);
        });

        // handle exit
        ocr_process.on('close', (code) => {
          if (code === 0) {
            resolve('OCR Finished Successfully');
          } else {
            reject('OCR Failed!');
          }
        });
      });
    };

    const run_fuzz = () => {
      return new Promise((resolve, reject) => {
        // spawn new process for cropping
        const fuzz_process = spawn(filepaths[2], [this.props.csvPath, this.props.dbPath], {
          cwd: path.join(filepaths[2], '..'),
        });

        // print stdout stream
        fuzz_process.stdout.on('data', (data) => {
          console.log(`fuzz stdout: ${data}`);
        });

        // print stderr stream
        fuzz_process.stderr.on('data', (data) => {
          console.warn(`fuzz err: ${data}`);
        });

        // handle exit
        fuzz_process.on('close', (code) => {
          if (code === 0) {
            resolve('Fuzzy Search Finished Successfully');
          } else {
            reject('Fuzzy Search Failed!');
          }
        });
      });
    };

    // run each component
    (async () => {
      try {
        const res1 = await run_crop();
        console.log(res1);
        const res2 = await run_ocr();
        console.log(res2);
        const res3 = await run_fuzz();
        console.log(res3);
        this.handleProgress();
      } catch (e) {
        return console.error(e);
      }
    })();
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
