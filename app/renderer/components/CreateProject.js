import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Template from './Template';
import CustomTextField from './CustomTextField';
import CustomButton from './CustomButton';

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
    padSize: '0',
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
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  validate = () => {
    const requiredFields = ['projectName', 'projectPath', 'csvPath', 'photosPath', 'padSize'];

    let error = false;
    requiredFields.forEach((key) => {
      console.log(this.state[key]);
      if (this.state[key] === '') error = true;
    });

    return error;
  };

  handleSubmit = () => {
    // if (this.validate()) return;

    this.props.onCreateProject({
      projectName: this.state.projectName,
      projectPath: this.state.projectPath,
      csvPath: this.state.csvPath,
      photosPath: this.state.photosPath,
      padSize: this.state.padSize,
    });
  };

  render() {
    return (
      <Template title='Create Project'>
        <Container>
          <form>
            <Grid container direction='column' justify='center' alignItems='center' spacing={3}>
              {/* Project Name */}
              <Grid container item justify='center' spacing={2}>
                <Grid item xs={8}>
                  <CustomTextField
                    label='Project Name'
                    name='projectName'
                    type='text'
                    value={this.state.projectName}
                    autoFocus={true}
                    onChange={this.handleChange}
                  />
                </Grid>
              </Grid>

              {/* Project Location */}
              <Grid container item justify='center' spacing={2}>
                <Grid item xs={2} />

                <Grid item xs={8}>
                  <CustomTextField
                    label='Project Location'
                    name='projectPath'
                    type='text'
                    value={this.state.projectPath}
                    onChange={this.handleChange}
                  />
                </Grid>

                <Grid item xs={2}>
                  <CustomButton onClick={this.handleProjectPath}>
                    <FolderOpenIcon />
                  </CustomButton>
                </Grid>
              </Grid>

              {/* CSV File */}
              <Grid container item justify='center' spacing={2}>
                <Grid item xs={2} />

                <Grid item xs={8}>
                  <CustomTextField
                    label='CSV File'
                    name='csvPath'
                    type='text'
                    value={this.state.csvPath}
                    onChange={this.handleChange}
                  />
                </Grid>

                <Grid item xs={2}>
                  <CustomButton onClick={this.handleCSVFile}>
                    <InsertDriveFileIcon />
                  </CustomButton>
                </Grid>
              </Grid>

              {/* Photos Directory */}
              <Grid container item justify='center' spacing={2}>
                <Grid item xs={2} />

                <Grid item xs={8}>
                  <CustomTextField
                    label='Photos Folder'
                    name='photosPath'
                    type='text'
                    value={this.state.photosPath}
                    onChange={this.handleChange}
                  />
                </Grid>

                <Grid item xs={2}>
                  <CustomButton onClick={this.handlePhotosPath}>
                    <FolderOpenIcon />
                  </CustomButton>
                </Grid>
              </Grid>

              {/* TODO - File Rename Pattern */}

              {/* Pixel Padding Amount */}
              <Grid container item justify='center' spacing={2}>
                <Grid item xs={8}>
                  <CustomTextField
                    label='Pixel Padding Amount'
                    name='padSize'
                    type='number'
                    onChange={(e) => {
                      // ensure only positive value is entered
                      if (e.target.value < 0) e.target.value = 0;
                      this.handleChange(e);
                    }}
                  />
                </Grid>
              </Grid>

              {/* Finish Button */}
              <Grid container item justify='center'>
                <CustomButton onClick={this.handleSubmit}>Finish</CustomButton>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Template>
    );
  }
}

export default CreateProject;
