import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Template from './Template';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

const styles = () => ({
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
});

class Home extends Component {
  static propTypes = {
    onSelectProject: PropTypes.func.isRequired,
  };

  handleProject = () => {
    this.props.onSelectProject({
      createNew: true,
    });
    this.props.debugButton();
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
              <Button
                className={classes.button}
                variant={'contained'}
                color='primary'
                size='large'
                startIcon={<FiberNewIcon />}
                onClick={this.handleProject}>
                Create Project
              </Button>
            </Grid>

            {/* Open Project */}
            {/* TODO - Bind action to open & open modal to ask to edit settings */}
            <Grid item>
              <Button
                className={classes.button}
                variant='contained'
                color='primary'
                size='large'
                startIcon={<FolderOpenIcon />}>
                Open Project
              </Button>
            </Grid>

            { /* Dev testing button */ }
            {/* <Grid item>
              <Button
                className={classes.button}
                variant='contained'
                color='primary'
                size='large'
                startIcon={<AddIcon />}
                onClick={this.props.debugButton}>
                Debug Button
              </Button>
            </Grid> */}
          </Grid>
        </Container>
      </Template>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Home);
