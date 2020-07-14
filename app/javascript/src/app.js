import React             from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute      from '../packs/privateRoute'
import GlobalNav         from '../packs/globalNav'
import Home              from '../packs/home'
import Signup            from '../packs/signup'
import Login             from '../packs/login'
import CampgroundList    from '../packs/containers/campgrounds/List';
import CampgroundAdd     from '../packs/containers/campgrounds/Add';
import CampgroundInfo    from '../packs/containers/campgrounds/Info';
import CampgroundEdit    from '../packs/containers/campgrounds/Edit';
import NavLink           from "../packs/navLink";

import 'font-awesome/css/font-awesome.css';
import './style.scss';

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <GlobalNav />
          <Route exact path="/" component={Home}   />
          <Route path="/signup" component={Signup} />
          <Route path="/login"  component={Login}  />
          <Switch>
            <PrivateRoute exact path="/campgrounds"    component={CampgroundList} />
            <PrivateRoute path="/campgrounds/new"      component={CampgroundAdd}  />
            <PrivateRoute path="/campgrounds/:id/edit" component={CampgroundEdit} />
            <PrivateRoute path="/campgrounds/:id"      component={CampgroundInfo} />
          </Switch>
      </div>
    )
  }
}

export default App
