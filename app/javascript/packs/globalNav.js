import React       from 'react'
import { connect } from 'react-redux'
import { Link }    from 'react-router-dom'
import {NavLink}   from "react-router-dom";
import Navigation  from 'react-toolbox/lib/navigation'
import { signout } from './modules/auth'

import "redux-logger"

class GlobalNav extends React.Component {
  signout(e) {
    e.preventDefault()
    this.props.dispatch(signout())
  }

  render() {
    const { isAuthenticated } = this.props
    return (
        <div>
        <div className="area"/>
        <nav className="main-menu">
          <ul>
            <li>
              { isAuthenticated && <NavLink to="/">
                <i className="fa fa-home fa-2x"/>
                <span className="nav-text">
                            Discover
                        </span>
              </NavLink> }

            </li>
            <li className="has-subnav">
              { isAuthenticated  && <NavLink to="/campgrounds">
                <i className="fa fa-laptop fa-2x"/>
                <span className="nav-text">
                            Profile
                        </span>
              </NavLink> }

            </li>
            <li className="has-subnav">
              { isAuthenticated  && <NavLink to="/campgrounds/new">
                <i className="fa fa-list fa-2x"/>
                <span className="nav-text">
                            Publish
                        </span>
              </NavLink> }

            </li>
            <li className="has-subnav">
              { isAuthenticated  && <NavLink to="/campgrounds/new">
                <i className="fa fa-folder-open fa-2x"/>
                <span className="nav-text">
                            News
                        </span>
              </NavLink> }

            </li>
          </ul>
          <ul className="logout">
            <li>
              { isAuthenticated && <a href="#" onClick={this.signout.bind(this)}>
                <i className="fa fa-power-off fa-2x"/>
                <span className="nav-text">
                            Logout
                        </span>
              </a> }
            </li>
          </ul>
        </nav>
        </div>
    )
  }
}

function mapStateToProps(state) {
  const  { auth }            = state
  const  { isAuthenticated } = auth

  return { isAuthenticated }
}

export default connect(mapStateToProps)(GlobalNav)
