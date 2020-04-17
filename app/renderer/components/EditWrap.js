import React, { Component } from 'react';
import sqlite3 from 'sqlite3';
import Edit from './Edit';

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

  getData = (index) => {
    // open db
    const db = new sqlite3.Database(this.state.dbPath, sqlite3.OPEN_READWRITE);

    // get column names & discard img path
    const cols = this.state.colNames;

    // string builder
    const params = [];
    cols.map((x) => {
      const tmp = this.state[x] ? `"${this.state[x]}"` : null;
      params.push(`${x} = ${tmp}`);
    });

    // create list of params to update
    const args = params.join(', ');

    // write back data
    let sql = `UPDATE MatchedResults SET ${args} WHERE _rowid_ = ${this.state.index + 1}`;

    db.all(sql, (err) => {
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

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  handleKeyDown = (e) => {
    const { keyCode } = e;
    const disable_prev = this.state.index <= this.state.min;
    const disable_next = this.state.index >= this.state.max;

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
