import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardContent, LinearProgress, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Template from './Template';
import sqlite3 from 'sqlite3';
import { spawn } from 'child_process';
import path from 'path';
import { remote } from 'electron';

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
    const db = new sqlite3.Database(this.props.dbPath, () => {
      db.all("PRAGMA table_info(CSVData);", (err, rows) => {
        const colnames = rows.map((x) => x.name);
        console.log("yaboi:" + colnames);
        this.props.grabCols({
          csvCols: colnames
        });
      });
    });

    const run_exes = false;
    if (run_exes) {
      const python_dist = path.join(remote.app.getAppPath(), 'python', 'dist');
      const exe_names = ['test1', 'test2']
      const filepaths = exe_names.map((x) => { return path.join(python_dist, x, x) });
      console.log(`propboi=${this.props.projectPath}`)

      const crop_process = spawn(filepaths[0],
        [this.props.photosPath, this.props.projectPath, this.props.dbPath]);
      crop_process.stdout.on("data", (data) => {
        console.log(`crop stdout: ${data}`);
      });
      crop_process.stderr.on("data", (data) => {
        console.error(`crop err: ${data}`);
      });
      crop_process.on("close", (code) => {
        if (code !== 0) {
          console.err("Cropping portion failed.")
          return;
        }
        const ocr_process = spawn(filepaths[1], [this.props.dbPath]);
        ocr_process.stdout.on("data", (data) => {
          console.log(`ocr stdout: ${data}`);
        });
        ocr_process.stderr.on("data", (data) => {
          console.error(`ocr err: ${data}`);
        });
        ocr_process.on("close", (code) => {
          if (code !== 0) {
            console.error("OCR portion failed.")
            return;
          } else {
            console.log("Success!!!!!");
          }
        });
      });
    }

    // const mycolnames = await database_actions;

    // console.log(mycolnames);
  }

  render() {
    return (
      <Template title='Progress'>
        <Container>
          <Card>
            <CardContent>
              <Typography variant='h5'>Please wait...</Typography>
              <span />
              <LinearProgress />

              <Button variant='outlined' onClick={this.handleProgress}>
                home
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Template>
    );
  }
}

export default Progress;
