import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Grid, withStyles } from '@material-ui/core';
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
  };

  render() {
    const { classes } = this.props;

    return (
      <Template>
        {/* Buttons */}
        <Container className={classes.content} maxWidth="md">
          <Grid container direction="column" alignItems="center" justify="center" spacing={4}>
            {/* Project Name */}
            <Grid item>
              <Button
                className={classes.button}
                variant={'contained'}
                color="primary"
                size="large"
                startIcon={<FiberNewIcon />}
                onClick={this.handleProject}>
                Create Project
              </Button>
            </Grid>

            {/* Open Project */}
            <Grid item>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                size="large"
                startIcon={<FolderOpenIcon />}>
                Open Project
              </Button>
            </Grid>
          </Grid>
        </Container>

        {/*<input onChange={this.handleChange} type="text" value={this.state.username} />*/}
        {/*<button onClick={this.handleLogin}>Log In</button>*/}
      </Template>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Home);
