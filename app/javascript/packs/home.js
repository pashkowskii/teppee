import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Home extends React.Component {
  render() {
    const { isAuthenticated } = this.props
    if (isAuthenticated) {
      return (
        <div>
          <h2>Home</h2>
        </div>
      )
    }
    return (
        <div className="slideshow">
            <div className="crossfade">
                <figure></figure>
                <figure></figure>
                <figure></figure>
                <figure></figure>
                <figure></figure>
            </div>
            <p className="login-btn"><Link to="/login">Login</Link></p>
            <p className="signup-btn"><Link to="/signup">Signup</Link></p>
        </div>
    )
  }
}

function mapStateToProps(state) {
  const  { auth }            = state
  const  { isAuthenticated } = auth

  return { isAuthenticated }
}

export default connect(mapStateToProps)(Home)
