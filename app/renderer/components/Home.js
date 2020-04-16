import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Fab, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Template from './Template';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

const styles = (theme) => ({
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
  extendedIcon: {
    marginRight: theme.spacing(1),
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
              <Fab
                className={classes.button}
                variant='extended'
                color='primary'
                onClick={this.handleProject}>
                <FiberNewIcon className={classes.extendedIcon} />
                Create Project
              </Fab>
            </Grid>

            {/* Open Project */}
            {/* TODO - Bind action to open & open modal to ask to edit settings */}
            <Grid item>
              <Fab className={classes.button} variant='extended' color='default'>
                <FolderOpenIcon className={classes.extendedIcon} />
                Open Project
              </Fab>
            </Grid>
          </Grid>
        </Container>
      </Template>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Home);
