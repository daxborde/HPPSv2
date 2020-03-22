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

const { dialog } = require('electron').remote;

class CreateProject extends Component {
  static propTypes = {
    onCreateProject: PropTypes.func.isRequired,
  };

  state = {
    projectName: '',
    projectPath: '',
    csvPath: '',
    photosPath: '',
    pixelPad: 0,
  };

  handleProjectPath = () => {
    const promise = dialog.showOpenDialog({ properties: ['openDirectory'] });

    promise.then((value) => {
      if (value.canceled) return;

      this.setState({
        projectPath: value.filePaths[0],
      });
    });
  };

  handleCSVFile = () => {
    const promise = dialog.showOpenDialog({
      filters: [{ name: 'CSV', extensions: ['csv'] }],
      properties: ['openFile'],
    });

    promise
      .then((result) => {
        // console.log(value.filePaths[0]);
        if (result.canceled) return;

        this.setState({
          csvPath: result.filePaths[0],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handlePhotosPath = () => {
    const promise = dialog.showOpenDialog({ properties: ['openDirectory'] });

    promise.then((value) => {
      if (value.canceled) return;

      this.setState({
        photosPath: value.filePaths[0],
      });
    });
  };

  handleChange = (e) => {
    const value = e.target.value;

    this.setState({
      // ...this.state,
      [e.target.name]: value,
    });
  };

  handleClick = () => {
    this.props.onCreateProject({
      projectName: this.state.projectName,
      projectPath: this.state.projectPath,
      csvPath: this.state.csvPath,
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
                  label="Project Name"
                  name="projectName"
                  autoFocus={true}
                  InputProps={{ className: classes.input }}
                  onChange={this.handleChange}
                  fullWidth
                  variant="outlined"
                  type={'text'}
                />
              </Grid>

              <Grid item xs={2} />
            </Grid>

            {/* Project Location */}
            <Grid container item justify="center" spacing={2}>
              <Grid item xs={2} />

              <Grid item xs={8}>
                <TextField
                  label="Project Location"
                  name="projectPath"
                  InputProps={{ className: classes.input }}
                  onChange={this.handleChange}
                  fullWidth
                  variant="outlined"
                  type={'text'}
                  value={this.state.projectPath}
                />
              </Grid>

              <CustomButton content={<FolderOpenIcon />} onClick={this.handleProjectPath} />
            </Grid>

            {/* CSV File */}
            <Grid container item justify="center" spacing={2}>
              <Grid item xs={2} />

              <Grid item xs={8}>
                <TextField
                  label="CSV File"
                  name="csvPath"
                  InputProps={{ className: classes.input }}
                  onChange={this.handleChange}
                  fullWidth
                  variant="outlined"
                  type={'text'}
                  value={this.state.csvPath}
                />
              </Grid>

              <CustomButton content={<InsertDriveFileIcon />} onClick={this.handleCSVFile} />
            </Grid>

            {/* Photos Directory */}
            <Grid container item justify="center" spacing={2}>
              <Grid item xs={2} />

              <Grid item xs={8}>
                <TextField
                  label="Photos Folder"
                  name="photosPath"
                  InputProps={{ className: classes.input }}
                  onChange={this.handleChange}
                  fullWidth
                  variant="outlined"
                  type={'text'}
                  value={this.state.photosPath}
                />
              </Grid>

              <CustomButton content={<FolderOpenIcon />} onClick={this.handlePhotosPath} />
            </Grid>

            {/* TODO - File Rename Pattern */}

            {/* Pixel Padding Amount */}
            <Grid container item justify="center" spacing={2}>
              <Grid item xs={2} />

              <Grid item xs={8}>
                <TextField
                  label="Pixel Padding Amount"
                  name="pixelPad"
                  InputProps={{ className: classes.input }}
                  onChange={(e) => {
                    // ensure only positive value is entered
                    if (e.target.value < 0) {
                      e.target.value = '0';
                      this.handleChange(e);
                    }
                  }}
                  fullWidth
                  variant="outlined"
                  type="number"
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
