import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Grid } from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Template from './Template';
import CustomTextField from './CustomTextField';
import CustomButton from './CustomButton';
import { withStyles } from '@material-ui/core/styles';

const { dialog } = require('electron').remote;

const styles = (theme) => ({
  card: {
    width: '50vw',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(5, 5, 5, 0),
  },
});

class CreateProject extends Component {
  static propTypes = {
    onCreateProject: PropTypes.func.isRequired,
  };

  state = {
    error: {},
    projectName: '',
    projectPath: '',
    csvPath: '',
    photosPath: '',
    padSize: 15,
  };

  handleProjectPath = () => {
    const promise = dialog.showOpenDialog({ properties: ['openDirectory'] });

    promise.then((value) => {
      if (value.canceled) return;
      const tmp = { ...this.state.error };
      tmp['projectPath'] = false;

      this.setState({
        projectPath: value.filePaths[0],
        error: tmp,
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
        if (result.canceled) return;
        const tmp = { ...this.state.error };
        tmp['csvPath'] = false;

        this.setState({
          csvPath: result.filePaths[0],
          error: tmp,
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
      const tmp = { ...this.state.error };
      tmp['photosPath'] = false;

      this.setState({
        photosPath: value.filePaths[0],
        error: tmp,
      });
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    const tmp = { ...this.state.error };
    tmp[name] = false;

    this.setState({
      [name]: value,
      error: tmp,
    });
  };

  validate = () => {
    const requiredFields = ['projectName', 'projectPath', 'csvPath', 'photosPath'];

    const newState = {};
    newState['error'] = {};
    let flag = false;
    requiredFields.forEach((x) => {
      const tmp = this.state[x] === '';
      flag |= tmp;
      newState['error'][x] = tmp;
    });

    this.setState(newState);

    return flag === 1;
    // return requiredFields.some((key) => this.state[key] === '');
  };

  handleSubmit = () => {
    if (this.validate()) return;

    this.props.onCreateProject({
      projectName: this.state.projectName,
      projectPath: this.state.projectPath,
      csvPath: this.state.csvPath,
      photosPath: this.state.photosPath,
      padSize: this.state.padSize,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Template title='Create Project'>
        <Card className={classes.card}>
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
                    error={this.state.error['projectName']}
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
                    error={this.state.error['projectPath']}
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
                    error={this.state.error['csvPath']}
                    onChange={this.handleChange}
                  />
                </Grid>

                <Grid item xs={2}>
                  <CustomButton onClick={this.handleCSVFile}>
                    <DescriptionOutlinedIcon />
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
                    error={this.state.error['photosPath']}
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
        </Card>
      </Template>
    );
  }
}

// export default CreateProject;
export default withStyles(styles, { withTheme: true })(CreateProject);
