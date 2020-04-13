import React from 'react';
import { Route, Switch } from 'react-router';

import LoginPage from './containers/LoginPage';
import LoggedInPage from './containers/LoggedInPage';
import HomePage from './containers/HomePage';
import NewProjectPage from './containers/CreateProjectPage';
import Progress from './containers/ProgressPage';
import Edit from './containers/EditPage';

export default (
  <Switch>
    <Route exact path='/' component={HomePage} />
    <Route exact path='/new-project' component={NewProjectPage} />
    <Route exact path='/progress' component={Progress} />
    <Route exact path='/edit' component={Edit} />

    <Route exact path='/login' component={LoginPage} />
    <Route exact path='/loggedin' component={LoggedInPage} />

    {/* if page not found, go to Home Page */}
    <Route component={HomePage} />
  </Switch>
);
