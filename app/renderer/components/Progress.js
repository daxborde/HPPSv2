import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardContent, LinearProgress, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Template from './Template';
import sqlite3 from 'sqlite3';

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
        console.log("yaboi:"+colnames);
        this.props.grabCols({
          csvCols: colnames
        });
      });
    });

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
