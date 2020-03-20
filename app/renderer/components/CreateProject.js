import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Grid, TextField, withStyles } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Template from './Template';

const styles = () => ({
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  input: {
    height: 50,
  },
});

class CreateProject extends Component {
  static propTypes = {
    onCreateProject: PropTypes.func.isRequired,
  };

  state = {
    projectName: '',
    excelPath: '',
    photosPath: '',
    pixelPad: 0,
  };

  handleProjectName = (event) => {
    this.setState({
      projectName: event.target.value,
    });
  };

  handleExcelPath = (event) => {
    this.setState({
      excelPath: event.target.value,
    });
  };

  handlePhotosPath = (event) => {
    this.setState({
      photosPath: event.target.value,
    });
  };

  handlePixelPad = (event) => {
    this.setState({
      pixelPad: event.target.value,
    });
  };

  handleClick = () => {
    this.props.onCreateProject({
      projectName: this.state.projectName,
      excelPath: this.state.excelPath,
      photosPath: this.state.photosPath,
      pixelPad: this.state.pixelPad,
      createProject: true,
    });
  };

  render() {
    const { classes } = this.props;

    const CustomButton = (props) => {
      if (!props.onClick) {
        return (
          <Grid item xs={2}>
            <Button className={classes.input} variant="contained" color="primary">
              {props.content}
            </Button>
          </Grid>
        );
      }

      return (
        <Grid item xs={2}>
          <Button
            className={classes.input}
            onClick={props.onClick}
            variant="contained"
            color="primary">
            {props.content}
          </Button>
        </Grid>
      );
    };

    return (
      <Template>
        <Container className={classes.content}>
          <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
            {/* Project Name */}
            <Grid container item justify="center" spacing={2}>
              <Grid item xs={2} />

              <Grid item xs={8}>
                <TextField
                  label={'Project Name'}
                  InputProps={{ className: classes.input }}
                  onChange={this.handleProjectName}
                  fullWidth
                  variant="outlined"
                  type={'text'}
                />
              </Grid>

              <Grid item xs={2} />
            </Grid>

            {/* Project Name */}
            <Grid container item justify="center" spacing={2}>
              <Grid item xs={2} />

              <Grid item xs={8}>
                <TextField
                  label={'Project Location'}
                  InputProps={{ className: classes.input }}
                  onChange={this.handleProjectName}
                  fullWidth
                  variant="outlined"
                  type={'text'}
                />
              </Grid>

              <Grid item xs={2} />
            </Grid>

            {/*Excel File*/}
            <Grid container item justify="center" spacing={2}>
              <Grid item xs={2} />

              <Grid item xs={8}>
                <TextField
                  label={'Excel File'}
                  InputProps={{ className: classes.input }}
                  onChange={this.handleExcelPath}
                  fullWidth
                  variant="outlined"
                  type={'text'}
                />
              </Grid>

              <CustomButton content={<InsertDriveFileIcon />} />
            </Grid>

            {/* Photos Directory */}
            <Grid container item justify="center" spacing={2}>
              <Grid item xs={2} />

              <Grid item xs={8}>
                <TextField
                  label={'Photos Folder'}
                  InputProps={{ className: classes.input }}
                  onChange={this.handlePhotosPath}
                  fullWidth
                  variant="outlined"
                  type={'text'}
                />
              </Grid>

              <CustomButton content={<FolderOpenIcon />} />
            </Grid>

            {/* Pixel Padding Amount */}
            <Grid container item justify="center" spacing={2}>
              <Grid item xs={2} />

              <Grid item xs={8}>
                <TextField
                  label={'Pixel Padding Amount'}
                  InputProps={{ className: classes.input }}
                  onChange={this.handlePixelPad}
                  fullWidth
                  variant="outlined"
                  type={'number'}
                />
              </Grid>

              <Grid item xs={2} />
            </Grid>

            {/* Finish Button */}
            <Grid container item justify="center">
              <Grid item xs={2} />
              <CustomButton content={'Finish'} onClick={this.handleClick} />
              <Grid item xs={2} />
            </Grid>
          </Grid>
        </Container>
      </Template>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CreateProject);
