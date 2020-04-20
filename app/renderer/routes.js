import React from 'react';
import { Route, Switch } from 'react-router';

import LoginPage from './containers/LoginPage';
import LoggedInPage from './containers/LoggedInPage';
import HomePage from './containers/HomePage';
import NewProjectPage from './containers/CreateProjectPage';
import ProgressPage from './containers/ProgressPage';
import EditPage from './containers/EditPage';
import FinishPage from './containers/FinishPage';

export default (
  <Switch>
    <Route exact path='/' component={HomePage} />
    <Route exact path='/new-project' component={NewProjectPage} />
    <Route exact path='/progress' component={ProgressPage} />
    <Route exact path='/edit' component={EditPage} />

    <Route exact path='/login' component={LoginPage} />
    <Route exact path='/loggedin' component={LoggedInPage} />
    <Route exact path='/finish' component={FinishPage} />

    {/* if page not found, go to Home Page */}
    <Route component={HomePage} />
  </Switch>
);
