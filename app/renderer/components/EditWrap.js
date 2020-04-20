import React, { Component } from 'react';
import sqlite3 from 'sqlite3';
import Edit from './Edit';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { remote } from 'electron';

class EditWrap extends Component {
  state = {
    dbPath: this.props.dbPath,
    colNames: null,
    data: null,
    index: 0,
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    imgPath: '',
  };

  // const inputstring = "{2}-{0}-{4}"
  // const colvals = ["JOHN", "H", "SMITH", "Pvt 1st class", "304"]
  formatFileName = (inputstring, colvals) => {
    const colnums = [],
      startidxs = [],
      endidxs = [];
    let i = 0;
    for (i = 0; i < inputstring.length; i++) {
      if (inputstring.charAt(i) === '{') {
        startidxs.push(i);
        let j = i;
        for (j = i; j < inputstring.length; j++) {
          if (inputstring.charAt(j) === '}') {
            break;
          }
        }
        endidxs.push(j);
        colnums.push(inputstring.slice(i + 1, j));
        i = j;
      }
    }

    let finalname = inputstring.slice(endidxs[endidxs.length - 1] + 1);
    for (i = colnums.length - 1; i >= 0; i--) {
      const splicestart = i - 1 < 0 ? 0 : endidxs[i - 1] + 1;
      const spliceend = startidxs[i];
      finalname = inputstring.slice(splicestart, spliceend) + colvals[colnums[i]] + finalname;
      // console.log(`finalname=${finalname}`);
    }
    return finalname;
  };

  getColvals = () => {
    const colvals = [];
    this.state.colNames.map((x) => {
      const tmp = this.state[x] ? `${this.state[x]}` : '';
      colvals.push(tmp);
    });
    return colvals;
  };

  getData = (index) => {
    // open db
    const db = new sqlite3.Database(this.state.dbPath, sqlite3.OPEN_READWRITE);

    // get column names & discard img path
    const cols = this.state.colNames;

    // console.log(`cols=${this.getColvals()[0]}`);
    // console.log(`namepattern=${this.props.namePattern}`);
    const newfilename = this.formatFileName(this.props.namePattern, this.getColvals());
    // console.log(newfilename);
    const directory = path.join(this.state.imgPath, '..');
    const extension = this.state.imgPath.split('.').pop();
    const finalimgpath = path.join(directory, newfilename + '.' + extension);

    // console.log(`directory=${directory}`);
    // console.log(`extension=${extension}`);
    // console.log(`finalpath=${finalpath}`);

    fs.rename(this.state.imgPath, finalimgpath, (err) => {
      if (err) {
        console.error('fs error:' + err);
      }
    });

    let app_path = remote.app.getAppPath();
    // If true, we are in a packaged environment
    if(app_path.split(path.sep).pop().includes("asar")) {
      app_path = path.join(app_path, "..");
    }
    const python_dist = path.join(app_path, 'python', 'dist');
    const exe_name = 'exif_data';
    const filepath = path.join(python_dist, exe_name, exe_name);
    console.log(`propboi=${this.props.projectPath}`);

    const statestring = JSON.stringify(this.state)

    const exif_process = spawn(filepath, [
      "-i",
      finalimgpath,
      "-m",
      statestring,
    ],
    {
      cwd: path.join(filepath, ".."),
      // stdio: ['ignore', process.stdout, process.stderr],
    });
    exif_process.stdout.on('data', (data) => {
      console.log(`crop stdout: ${data}`);
    });
    exif_process.stderr.on('data', (data) => {
      console.warn(`crop err: ${data}`);
    });

    // string builder
    const params = [];
    const stateWithName = Object.assign(this.state, { crop_path: finalimgpath });
    const colsWithName = [...cols, 'crop_path'];
    colsWithName.map((x) => {
      const tmp = stateWithName[x] ? `"${stateWithName[x]}"` : null;
      params.push(`${x} = ${tmp}`);
    });

    // create list of params to update
    const args = params.join(', ');

    // console.log(args);

    // write back data
    let sql = `UPDATE MatchedResults SET ${args} WHERE _rowid_ = ${this.state.index + 1}`;

    db.run(sql, (err) => {
      if (err) console.log(err);
    });

    // generate sql query
    sql = `SELECT ${cols},crop_path FROM MatchedResults LIMIT 1 OFFSET ${index}`;

    // query db
    db.all(sql, (err, data) => {
      if (err) {
        console.log('error: ' + err);
        return;
      }

      const tmp = data[0];
      const imgPath = tmp['crop_path'];
      delete tmp['crop_path'];

      const newState = {};
      const keys = Object.keys(tmp);
      for (const key of keys) {
        newState[key] = tmp[key];
      }

      newState['imgPath'] = imgPath;
      newState['index'] = index;

      this.setState(newState);
    });

    db.close();
  };

  onNext = () => {
    const index = parseInt(this.state.index) + 1;
    this.getData(index);
  };

  onPrevious = () => {
    const index = parseInt(this.state.index) - 1;
    this.getData(index);
  };

  // store changes to values in local state
  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  // handle arrow keys
  handleKeyDown = (e) => {
    const tagName = e.target.tagName.toLowerCase();
    const keyCode = e.keyCode;

    const disable_prev = this.state.index <= this.state.min;
    const disable_next = this.state.index >= this.state.max;

    // console.log(target);

    switch (tagName) {
      case 'input':
      case 'textarea':
      case 'select':
        return;
    }

    switch (keyCode) {
      case 37:
        if (disable_prev) return;
        this.onPrevious();
        break;
      case 39:
        if (disable_next) return;
        this.onNext();
        break;
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    // open db
    const db = new sqlite3.Database(this.state.dbPath, sqlite3.OPEN_READONLY);

    // find number of rows and store into max
    db.all('SELECT (Count(_rowid_) -1) as MAX_VAL FROM MatchedResults', (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      this.setState({
        max: data[0].MAX_VAL,
      });
    });

    // query column names to display
    db.all('PRAGMA table_info(CSVData);', (err, cols) => {
      const index = parseInt(this.state.index);

      // extract names of columns
      let colNames = cols.map((x) => x.name);
      // remove index from column name list
      colNames = colNames.slice(1);

      // generate sql query for values
      const sql = `SELECT ${colNames.join()},crop_path FROM MatchedResults LIMIT 1 OFFSET ${index}`;

      // query db
      db.all(sql, (err, data) => {
        if (err) {
          console.log('error: ' + err);
          return;
        }

        const tmp = data[0];
        const imgPath = tmp['crop_path'];
        delete tmp['crop_path'];

        const newState = {};
        const keys = Object.keys(tmp);
        for (const key of keys) {
          newState[key] = tmp[key];
        }

        newState['colNames'] = colNames;
        newState['imgPath'] = imgPath;
        newState['index'] = index;

        this.setState(newState);
      });
    });

    db.close();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    // console.log('RE-RENDERED PARENT');
    const disable_prev = this.state.index <= this.state.min;
    const disable_next = this.state.index >= this.state.max;

    return (
      <Edit
        {...this.state}
        onPrevious={this.onPrevious}
        onNext={this.onNext}
        handleChange={this.handleChange}
        b1={disable_prev}
        b2={disable_next}
      />
    );
  }
}

export default EditWrap;
