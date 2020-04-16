import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardContent, LinearProgress, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Template from './Template';

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
