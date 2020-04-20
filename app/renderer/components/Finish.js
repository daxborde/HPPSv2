import React, { Component } from 'react';
import { Container } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Template from './Template';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginBottom: theme.spacing(10),
  },
  button: {
    height: 50,
    minWidth: '10em',
  },
  icon: {
    color: '#4caf50',
    fontSize: '5em',
    marginBottom: theme.spacing(4),
  },
});

class Finish extends Component {
  // static propTypes = {
  //   onFinish: PropTypes.func.isRequired,
  // };

  handleButton = () => {
    this.props.onHome();
  };

  render() {
    const { classes } = this.props;

    return (
      <Template title='Finished'>
        <Container className={classes.content}>
          <div className={classes.wrapper}>
            <CheckCircleIcon className={classes.icon} />

            <Typography variant='h5' className={classes.text}>
              All changes have been saved
            </Typography>

            <Fab
              className={classes.button}
              variant='extended'
              color='primary'
              onClick={this.handleButton}>
              Start Menu
            </Fab>
          </div>
        </Container>
      </Template>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Finish);
