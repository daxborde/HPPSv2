import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardContent, LinearProgress, Typography } from '@material-ui/core';
import Template from './Template';
import { withStyles } from '@material-ui/core/styles';

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

  render() {
    const { classes } = this.props;

    return (
      <Template title='Progress'>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant='h5'>Please wait...</Typography>

            <Button variant='outlined' onClick={this.handleProgress}>
              DEBUG_NEXT
            </Button>

            <LinearProgress className={classes.progress} />
          </CardContent>
        </Card>
      </Template>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Progress);
